import "server-only";

import type { ProductoPublico } from "@/domain/catalogo-publico";
import type { Prisma } from "@/generated/prisma/client";

import { ordenImagenesProductoPublicas } from "./orden-imagenes-publicas";

export const seleccionProductoPublico = {
  id: true,
  nombre: true,
  slug: true,
  precioBase: true,
  estado: true,
  destacado: true,
  banda: {
    select: { id: true, nombre: true, slug: true, estaVisible: true },
  },
  imagenes: {
    select: { rutaImagen: true, textoAlternativo: true },
    orderBy: ordenImagenesProductoPublicas,
    take: 1,
  },
} satisfies Prisma.ProductoSelect;

export const ordenProductosPublicos = [
  { orden: { sort: "asc", nulls: "last" } },
  { creadoEn: "desc" },
  { nombre: "asc" },
] satisfies Prisma.ProductoOrderByWithRelationInput[];

type ProductoSeleccionado = Prisma.ProductoGetPayload<{
  select: typeof seleccionProductoPublico;
}>;

export function mapearProductoPublico(
  producto: ProductoSeleccionado,
): ProductoPublico {
  if (producto.estado !== "ACTIVO" && producto.estado !== "SIN_STOCK") {
    throw new Error("La consulta pública devolvió un producto oculto.");
  }

  return {
    id: producto.id,
    nombre: producto.nombre,
    slug: producto.slug,
    precioBase: producto.precioBase.toString(),
    estado: producto.estado,
    destacado: producto.destacado,
    banda: producto.banda?.estaVisible
      ? {
          id: producto.banda.id,
          nombre: producto.banda.nombre,
          slug: producto.banda.slug,
          urlImagen: null,
        }
      : null,
    imagen: producto.imagenes[0] ?? null,
  };
}
