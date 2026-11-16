import { z } from "zod";

import { PRECIO_MAXIMO_CENTAVOS, precioACentavos } from "./productos";
import { PATRON_SLUG } from "./slug";

export const VERSION_PERSISTENCIA_CARRITO = 1;
export const CANTIDAD_MAXIMA_ITEM_CARRITO = 99;
export const ITEMS_MAXIMOS_CARRITO = 50;

export interface VarianteItemCarrito {
  id: string;
  nombre: string;
}

export interface ImagenItemCarrito {
  rutaImagen: string;
  textoAlternativo: string;
}

export interface SeleccionCarrito {
  productoId: string;
  slug: string;
  nombre: string;
  variante: VarianteItemCarrito | null;
  precioUnitario: string;
  imagen: ImagenItemCarrito | null;
}

export interface ItemCarrito extends SeleccionCarrito {
  cantidad: number;
}

const esquemaPrecioCarrito = z.string().refine((valor) => {
  const centavos = precioACentavos(valor);
  return (
    centavos !== null &&
    Number.isSafeInteger(centavos) &&
    centavos <= PRECIO_MAXIMO_CENTAVOS
  );
});

const esquemaUrlImagenCarrito = z
  .url()
  .max(2048)
  .refine((valor) => {
    const protocolo = new URL(valor).protocol;
    return protocolo === "http:" || protocolo === "https:";
  });

const esquemaItemCarrito = z.object({
  productoId: z.uuid(),
  slug: z.string().max(160).regex(PATRON_SLUG),
  nombre: z.string().trim().min(1).max(150),
  variante: z
    .object({
      id: z.uuid(),
      nombre: z.string().trim().min(1).max(100),
    })
    .nullable(),
  cantidad: z.number().int().min(1).max(CANTIDAD_MAXIMA_ITEM_CARRITO),
  precioUnitario: esquemaPrecioCarrito,
  imagen: z
    .object({
      rutaImagen: esquemaUrlImagenCarrito,
      textoAlternativo: z.string().trim().min(1).max(240),
    })
    .nullable(),
});

const esquemaPersistenciaCarrito = z
  .object({
    version: z.literal(VERSION_PERSISTENCIA_CARRITO),
    items: z.array(esquemaItemCarrito).max(ITEMS_MAXIMOS_CARRITO),
  })
  .superRefine(({ items }, contexto) => {
    const claves = new Set<string>();
    for (const item of items) {
      const clave = obtenerClaveItemCarrito(item);
      if (claves.has(clave)) {
        contexto.addIssue({
          code: "custom",
          message: "El carrito contiene combinaciones duplicadas.",
          path: ["items"],
        });
        return;
      }
      claves.add(clave);
    }
  });

export function crearClaveItemCarrito(
  productoId: string,
  varianteId: string | null,
): string {
  return `${productoId}:${varianteId ?? "base"}`;
}

export function obtenerClaveItemCarrito(item: ItemCarrito): string {
  return crearClaveItemCarrito(item.productoId, item.variante?.id ?? null);
}

export function esCantidadCarritoValida(cantidad: number): boolean {
  return (
    Number.isInteger(cantidad) &&
    cantidad >= 1 &&
    cantidad <= CANTIDAD_MAXIMA_ITEM_CARRITO
  );
}

export function agregarItemCarrito(
  items: ItemCarrito[],
  seleccion: SeleccionCarrito,
  cantidad: number,
): ItemCarrito[] {
  if (!esCantidadCarritoValida(cantidad)) return items;

  const clave = crearClaveItemCarrito(
    seleccion.productoId,
    seleccion.variante?.id ?? null,
  );
  const existente = items.find(
    (item) => obtenerClaveItemCarrito(item) === clave,
  );

  if (!existente) {
    return items.length >= ITEMS_MAXIMOS_CARRITO
      ? items
      : [...items, { ...seleccion, cantidad }];
  }

  const cantidadResultante = existente.cantidad + cantidad;
  if (!esCantidadCarritoValida(cantidadResultante)) return items;

  return items.map((item) =>
    obtenerClaveItemCarrito(item) === clave
      ? { ...seleccion, cantidad: cantidadResultante }
      : item,
  );
}

export function actualizarCantidadItemCarrito(
  items: ItemCarrito[],
  clave: string,
  cantidad: number,
): ItemCarrito[] {
  if (!esCantidadCarritoValida(cantidad)) return items;

  return items.map((item) =>
    obtenerClaveItemCarrito(item) === clave ? { ...item, cantidad } : item,
  );
}

export function eliminarItemCarrito(
  items: ItemCarrito[],
  clave: string,
): ItemCarrito[] {
  return items.filter((item) => obtenerClaveItemCarrito(item) !== clave);
}

export function vaciarCarrito(): ItemCarrito[] {
  return [];
}

export function calcularSubtotalItemCarrito(item: ItemCarrito): number {
  return (precioACentavos(item.precioUnitario) ?? 0) * item.cantidad;
}

export function calcularTotalCarrito(items: ItemCarrito[]): number {
  return items.reduce(
    (total, item) => total + calcularSubtotalItemCarrito(item),
    0,
  );
}

export function centavosAPrecioCarrito(centavos: number): string {
  const enteros = Math.trunc(centavos / 100);
  const decimales = centavos % 100;
  return `${enteros}.${decimales.toString().padStart(2, "0")}`;
}

export function contarUnidadesCarrito(items: ItemCarrito[]): number {
  return items.reduce((total, item) => total + item.cantidad, 0);
}

export function serializarCarrito(items: ItemCarrito[]): string {
  return JSON.stringify({ version: VERSION_PERSISTENCIA_CARRITO, items });
}

export function deserializarCarrito(valor: string | null): ItemCarrito[] {
  if (!valor) return [];

  try {
    const resultado = esquemaPersistenciaCarrito.safeParse(JSON.parse(valor));
    return resultado.success ? resultado.data.items : [];
  } catch {
    return [];
  }
}
