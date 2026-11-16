"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";

import {
  CANTIDAD_MAXIMA_ITEM_CARRITO,
  ITEMS_MAXIMOS_CARRITO,
  actualizarCantidadItemCarrito,
  agregarItemCarrito,
  contarUnidadesCarrito,
  deserializarCarrito,
  eliminarItemCarrito,
  esCantidadCarritoValida,
  serializarCarrito,
  vaciarCarrito,
  type ItemCarrito,
  type SeleccionCarrito,
} from "@/domain/carrito";

const CLAVE_PERSISTENCIA_CARRITO = "alcohol-rockeria:carrito:v1";
const EVENTO_CAMBIO_CARRITO = "alcohol-rockeria:cambio-carrito";
const CARRITO_VACIO_SERIALIZADO = serializarCarrito([]);

let respaldoEnMemoria = CARRITO_VACIO_SERIALIZADO;
let almacenamientoDisponible = true;

function obtenerSnapshotCarrito() {
  try {
    almacenamientoDisponible = true;
    return (
      window.localStorage.getItem(CLAVE_PERSISTENCIA_CARRITO) ??
      CARRITO_VACIO_SERIALIZADO
    );
  } catch {
    almacenamientoDisponible = false;
    return respaldoEnMemoria;
  }
}

function suscribirCarrito(notificar: () => void) {
  const cambioLocal = () => notificar();
  const cambioOtraPestana = (evento: StorageEvent) => {
    if (evento.key === CLAVE_PERSISTENCIA_CARRITO) {
      respaldoEnMemoria = evento.newValue ?? CARRITO_VACIO_SERIALIZADO;
      notificar();
    }
  };

  window.addEventListener(EVENTO_CAMBIO_CARRITO, cambioLocal);
  window.addEventListener("storage", cambioOtraPestana);
  return () => {
    window.removeEventListener(EVENTO_CAMBIO_CARRITO, cambioLocal);
    window.removeEventListener("storage", cambioOtraPestana);
  };
}

function guardarSnapshotCarrito(items: ItemCarrito[]) {
  const serializado = serializarCarrito(items);
  respaldoEnMemoria = serializado;

  try {
    window.localStorage.setItem(CLAVE_PERSISTENCIA_CARRITO, serializado);
    almacenamientoDisponible = true;
  } catch {
    almacenamientoDisponible = false;
  }

  window.dispatchEvent(new Event(EVENTO_CAMBIO_CARRITO));
}

function suscripcionVacia() {
  return () => undefined;
}

interface ResultadoCarrito {
  exito: boolean;
  mensaje: string;
}

interface ContextoCarrito {
  items: ItemCarrito[];
  cantidadUnidades: number;
  hidratado: boolean;
  persistenciaDisponible: boolean;
  agregar: (seleccion: SeleccionCarrito, cantidad: number) => ResultadoCarrito;
  actualizarCantidad: (clave: string, cantidad: number) => ResultadoCarrito;
  eliminar: (clave: string) => void;
  vaciar: () => void;
}

const CarritoContext = createContext<ContextoCarrito | null>(null);

export function ProveedorCarrito({ children }: { children: ReactNode }) {
  const snapshot = useSyncExternalStore(
    suscribirCarrito,
    obtenerSnapshotCarrito,
    () => CARRITO_VACIO_SERIALIZADO,
  );
  const hidratado = useSyncExternalStore(
    suscripcionVacia,
    () => true,
    () => false,
  );
  const items = useMemo(() => deserializarCarrito(snapshot), [snapshot]);
  const guardar = useCallback(
    (siguientes: ItemCarrito[]) => guardarSnapshotCarrito(siguientes),
    [],
  );

  const agregar = useCallback(
    (seleccion: SeleccionCarrito, cantidad: number): ResultadoCarrito => {
      if (!esCantidadCarritoValida(cantidad)) {
        return {
          exito: false,
          mensaje: `Ingresá una cantidad entera entre 1 y ${CANTIDAD_MAXIMA_ITEM_CARRITO}.`,
        };
      }

      const existente = items.find(
        (item) =>
          item.productoId === seleccion.productoId &&
          item.variante?.id === seleccion.variante?.id,
      );
      if (
        existente &&
        existente.cantidad + cantidad > CANTIDAD_MAXIMA_ITEM_CARRITO
      ) {
        return {
          exito: false,
          mensaje: `La combinación no puede superar ${CANTIDAD_MAXIMA_ITEM_CARRITO} unidades.`,
        };
      }
      if (!existente && items.length >= ITEMS_MAXIMOS_CARRITO) {
        return {
          exito: false,
          mensaje: `El carrito admite hasta ${ITEMS_MAXIMOS_CARRITO} combinaciones distintas.`,
        };
      }

      guardar(agregarItemCarrito(items, seleccion, cantidad));
      return {
        exito: true,
        mensaje: existente
          ? "Actualizamos la cantidad de esta selección."
          : "Agregamos la selección al carrito.",
      };
    },
    [guardar, items],
  );

  const actualizarCantidad = useCallback(
    (clave: string, cantidad: number): ResultadoCarrito => {
      if (!esCantidadCarritoValida(cantidad)) {
        return {
          exito: false,
          mensaje: `Ingresá una cantidad entera entre 1 y ${CANTIDAD_MAXIMA_ITEM_CARRITO}.`,
        };
      }

      guardar(actualizarCantidadItemCarrito(items, clave, cantidad));
      return { exito: true, mensaje: "Cantidad actualizada." };
    },
    [guardar, items],
  );

  const eliminar = useCallback(
    (clave: string) => guardar(eliminarItemCarrito(items, clave)),
    [guardar, items],
  );
  const vaciar = useCallback(() => guardar(vaciarCarrito()), [guardar]);

  const valor = useMemo<ContextoCarrito>(
    () => ({
      items,
      cantidadUnidades: contarUnidadesCarrito(items),
      hidratado,
      persistenciaDisponible: almacenamientoDisponible,
      agregar,
      actualizarCantidad,
      eliminar,
      vaciar,
    }),
    [actualizarCantidad, agregar, eliminar, hidratado, items, vaciar],
  );

  return (
    <CarritoContext.Provider value={valor}>{children}</CarritoContext.Provider>
  );
}

export function useCarrito(): ContextoCarrito {
  const contexto = useContext(CarritoContext);
  if (!contexto) {
    throw new Error("useCarrito debe utilizarse dentro de ProveedorCarrito.");
  }
  return contexto;
}
