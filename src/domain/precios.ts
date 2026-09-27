import { z } from "zod";

import {
  PRECIO_MAXIMO_CENTAVOS,
  precioACentavos,
  type EstadoProductoDominio,
} from "./productos";

export const ALCANCES_PRECIOS = [
  "TODOS",
  "CATEGORIA",
  "BANDA",
  "SELECCION",
] as const;

export type AlcancePrecios = (typeof ALCANCES_PRECIOS)[number];

export const ETIQUETAS_ALCANCE_PRECIOS: Record<AlcancePrecios, string> = {
  TODOS: "Todos los productos",
  CATEGORIA: "Una categoría",
  BANDA: "Una banda",
  SELECCION: "Productos seleccionados",
};

export const PORCENTAJE_MINIMO_CENTESIMAS = -10_000;
export const PORCENTAJE_MAXIMO_CENTESIMAS = 1_000_000;
export const MAXIMO_PRODUCTOS_SELECCIONADOS = 1_000;

export interface SolicitudActualizacionPrecios {
  alcance: AlcancePrecios;
  referenciaId: string | null;
  productoIds: string[];
  incluirOcultos: boolean;
  porcentajeCentesimas: number;
}

export interface OpcionFiltroPrecio {
  id: string;
  nombre: string;
  estaVisible: boolean;
}

export interface ProductoOpcionPrecio {
  id: string;
  nombre: string;
  precioBase: string;
  estado: EstadoProductoDominio;
  categoria: { nombre: string };
  banda: { nombre: string } | null;
}

export interface OpcionesGestionPrecios {
  categorias: OpcionFiltroPrecio[];
  bandas: OpcionFiltroPrecio[];
  productos: ProductoOpcionPrecio[];
}

export interface VariantePrecioFuente {
  id: string;
  nombre: string;
  precioEspecifico: string;
}

export interface ProductoPrecioFuente {
  id: string;
  nombre: string;
  estado: EstadoProductoDominio;
  precioBase: string;
  categoria: { id: string; nombre: string };
  banda: { id: string; nombre: string } | null;
  variantes: VariantePrecioFuente[];
}

export interface VariantePreviewPrecio extends VariantePrecioFuente {
  precioResultante: string;
}

export interface ProductoPreviewPrecio {
  id: string;
  nombre: string;
  estado: EstadoProductoDominio;
  precioActual: string;
  precioResultante: string;
  categoria: { id: string; nombre: string };
  banda: { id: string; nombre: string } | null;
  variantes: VariantePreviewPrecio[];
}

export interface VistaPreviaPrecios {
  solicitud: SolicitudActualizacionPrecios;
  productos: ProductoPreviewPrecio[];
  cantidadVariantes: number;
  cantidadOcultos: number;
}

export type CampoSolicitudPrecios =
  "alcance" | "referenciaId" | "productoIds" | "porcentaje";
export type ErroresSolicitudPrecios = Partial<
  Record<CampoSolicitudPrecios, string>
>;

export type ResultadoVistaPrevia =
  | { success: true; data: VistaPreviaPrecios }
  | { success: false; mensaje: string };

export function normalizarPorcentaje(valor: string) {
  return valor.trim().replace(",", ".");
}

export function porcentajeACentesimas(valor: string): number | null {
  const normalizado = normalizarPorcentaje(valor);
  if (!/^[+-]?\d+(?:\.\d{1,2})?$/.test(normalizado)) return null;

  const signo = normalizado.startsWith("-") ? -1 : 1;
  const sinSigno = normalizado.replace(/^[+-]/, "");
  const [enteros, decimales = ""] = sinSigno.split(".");
  const resultado =
    signo * (Number(enteros) * 100 + Number(decimales.padEnd(2, "0")));

  return Number.isSafeInteger(resultado) ? resultado : null;
}

export function formatearPorcentaje(porcentajeCentesimas: number) {
  const signo = porcentajeCentesimas > 0 ? "+" : "";
  const absoluto = Math.abs(porcentajeCentesimas);
  const enteros = Math.trunc(absoluto / 100);
  const decimales = absoluto % 100;
  const valor =
    decimales === 0
      ? `${enteros}`
      : `${enteros},${decimales.toString().padStart(2, "0").replace(/0$/, "")}`;

  return `${signo}${porcentajeCentesimas < 0 ? "-" : ""}${valor} %`;
}

export function centavosAPrecio(centavos: number) {
  const enteros = Math.trunc(centavos / 100);
  const decimales = centavos % 100;
  return `${enteros}.${decimales.toString().padStart(2, "0")}`;
}

export function calcularPrecioResultante(
  precioActualCentavos: number,
  porcentajeCentesimas: number,
): number | null {
  if (
    !Number.isSafeInteger(precioActualCentavos) ||
    !Number.isSafeInteger(porcentajeCentesimas) ||
    precioActualCentavos < 0 ||
    porcentajeCentesimas < PORCENTAJE_MINIMO_CENTESIMAS ||
    porcentajeCentesimas > PORCENTAJE_MAXIMO_CENTESIMAS
  ) {
    return null;
  }

  const factor = BigInt(10_000) + BigInt(porcentajeCentesimas);
  const numerador = BigInt(precioActualCentavos) * factor;
  const resultado = Number((numerador + BigInt(5_000)) / BigInt(10_000));

  return resultado <= PRECIO_MAXIMO_CENTAVOS ? resultado : null;
}

const esquemaPorcentaje = z
  .string({ error: "Ingresá un porcentaje." })
  .trim()
  .superRefine((valor, contexto) => {
    const porcentaje = porcentajeACentesimas(valor);
    if (porcentaje === null) {
      contexto.addIssue({
        code: "custom",
        message: "Ingresá un porcentaje válido con hasta 2 decimales.",
      });
      return;
    }
    if (porcentaje === 0) {
      contexto.addIssue({
        code: "custom",
        message: "El porcentaje debe ser distinto de cero.",
      });
    }
    if (porcentaje < PORCENTAJE_MINIMO_CENTESIMAS) {
      contexto.addIssue({
        code: "custom",
        message: "La disminución no puede superar el 100 %.",
      });
    }
    if (porcentaje > PORCENTAJE_MAXIMO_CENTESIMAS) {
      contexto.addIssue({
        code: "custom",
        message: "El aumento no puede superar el 10.000 %.",
      });
    }
  })
  .transform((valor) => porcentajeACentesimas(valor) as number);

const esquemaSolicitud = z
  .object({
    alcance: z.enum(ALCANCES_PRECIOS, {
      error: "Seleccioná un alcance válido.",
    }),
    referenciaId: z.preprocess(
      (valor) => (valor === "" ? null : valor),
      z.uuid("Seleccioná una opción válida.").nullable(),
    ),
    productoIds: z
      .array(z.uuid("La selección contiene un producto inválido."))
      .max(
        MAXIMO_PRODUCTOS_SELECCIONADOS,
        `No se pueden seleccionar más de ${MAXIMO_PRODUCTOS_SELECCIONADOS} productos.`,
      ),
    incluirOcultos: z.boolean(),
    porcentaje: esquemaPorcentaje,
  })
  .superRefine((datos, contexto) => {
    if (
      (datos.alcance === "CATEGORIA" || datos.alcance === "BANDA") &&
      datos.referenciaId === null
    ) {
      contexto.addIssue({
        code: "custom",
        path: ["referenciaId"],
        message:
          datos.alcance === "CATEGORIA"
            ? "Seleccioná una categoría."
            : "Seleccioná una banda.",
      });
    }
    if (datos.alcance === "SELECCION" && datos.productoIds.length === 0) {
      contexto.addIssue({
        code: "custom",
        path: ["productoIds"],
        message: "Seleccioná al menos un producto.",
      });
    }
  })
  .transform((datos): SolicitudActualizacionPrecios => ({
    alcance: datos.alcance,
    referenciaId:
      datos.alcance === "CATEGORIA" || datos.alcance === "BANDA"
        ? datos.referenciaId
        : null,
    productoIds:
      datos.alcance === "SELECCION" ? [...new Set(datos.productoIds)] : [],
    incluirOcultos: datos.incluirOcultos,
    porcentajeCentesimas: datos.porcentaje,
  }));

export function validarSolicitudPrecios(entrada: unknown) {
  return esquemaSolicitud.safeParse(entrada);
}

export function mapearErroresSolicitudPrecios(
  error: z.ZodError,
): ErroresSolicitudPrecios {
  return error.issues.reduce<ErroresSolicitudPrecios>((errores, issue) => {
    const campo = issue.path[0];
    if (
      (campo === "alcance" ||
        campo === "referenciaId" ||
        campo === "productoIds" ||
        campo === "porcentaje") &&
      !errores[campo]
    ) {
      errores[campo] = issue.message;
    }
    return errores;
  }, {});
}

export function crearVistaPreviaPrecios(
  solicitud: SolicitudActualizacionPrecios,
  productos: ProductoPrecioFuente[],
): ResultadoVistaPrevia {
  const preview: ProductoPreviewPrecio[] = [];

  for (const producto of productos) {
    const precioActualCentavos = precioACentavos(producto.precioBase);
    const precioResultante =
      precioActualCentavos === null
        ? null
        : calcularPrecioResultante(
            precioActualCentavos,
            solicitud.porcentajeCentesimas,
          );

    if (precioActualCentavos === null || precioResultante === null) {
      return {
        success: false,
        mensaje: `El precio resultante de “${producto.nombre}” queda fuera del rango permitido.`,
      };
    }

    const variantes: VariantePreviewPrecio[] = [];
    for (const variante of producto.variantes) {
      const precioVarianteCentavos = precioACentavos(variante.precioEspecifico);
      const resultadoVariante =
        precioVarianteCentavos === null
          ? null
          : calcularPrecioResultante(
              precioVarianteCentavos,
              solicitud.porcentajeCentesimas,
            );

      if (precioVarianteCentavos === null || resultadoVariante === null) {
        return {
          success: false,
          mensaje: `El precio resultante de la variante “${variante.nombre}” de “${producto.nombre}” queda fuera del rango permitido.`,
        };
      }

      variantes.push({
        ...variante,
        precioEspecifico: centavosAPrecio(precioVarianteCentavos),
        precioResultante: centavosAPrecio(resultadoVariante),
      });
    }

    preview.push({
      id: producto.id,
      nombre: producto.nombre,
      estado: producto.estado,
      precioActual: centavosAPrecio(precioActualCentavos),
      precioResultante: centavosAPrecio(precioResultante),
      categoria: producto.categoria,
      banda: producto.banda,
      variantes,
    });
  }

  return {
    success: true,
    data: {
      solicitud,
      productos: preview,
      cantidadVariantes: preview.reduce(
        (total, producto) => total + producto.variantes.length,
        0,
      ),
      cantidadOcultos: preview.filter(
        (producto) => producto.estado === "OCULTO",
      ).length,
    },
  };
}

export function vistaPreviaCoincideConCalculo(preview: VistaPreviaPrecios) {
  const recalculada = crearVistaPreviaPrecios(
    preview.solicitud,
    preview.productos.map((producto) => ({
      id: producto.id,
      nombre: producto.nombre,
      estado: producto.estado,
      precioBase: producto.precioActual,
      categoria: producto.categoria,
      banda: producto.banda,
      variantes: producto.variantes.map((variante) => ({
        id: variante.id,
        nombre: variante.nombre,
        precioEspecifico: variante.precioEspecifico,
      })),
    })),
  );

  if (!recalculada.success) return false;
  if (
    recalculada.data.cantidadVariantes !== preview.cantidadVariantes ||
    recalculada.data.cantidadOcultos !== preview.cantidadOcultos ||
    recalculada.data.productos.length !== preview.productos.length
  ) {
    return false;
  }

  return recalculada.data.productos.every((producto, indiceProducto) => {
    const original = preview.productos[indiceProducto];
    return (
      original?.id === producto.id &&
      original.precioActual === producto.precioActual &&
      original.precioResultante === producto.precioResultante &&
      original.variantes.length === producto.variantes.length &&
      producto.variantes.every((variante, indiceVariante) => {
        const varianteOriginal = original.variantes[indiceVariante];
        return (
          varianteOriginal?.id === variante.id &&
          varianteOriginal.precioEspecifico === variante.precioEspecifico &&
          varianteOriginal.precioResultante === variante.precioResultante
        );
      })
    );
  });
}
