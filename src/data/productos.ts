import "server-only";

import { Prisma } from "@/generated/prisma/client";

import type {
  DatosProducto,
  EstadoProductoDominio,
  OpcionRelacionProducto,
  ProductoEditable,
  ProductoListado,
} from "@/domain/productos";
import { clientePrisma } from "@/lib/prisma";

const seleccionProductoEditable = {
  id: true,
  nombre: true,
  slug: true,
  descripcion: true,
  precioBase: true,
  categoriaId: true,
  bandaId: true,
  estado: true,
  destacado: true,
  orden: true,
} as const;

function prepararDatosPersistencia(datos: DatosProducto) {
  return {
    ...datos,
    precioBase: new Prisma.Decimal(datos.precioBase),
  };
}

export async function obtenerProductos(): Promise<ProductoListado[]> {
  const productos = await clientePrisma.producto.findMany({
    select: {
      id: true,
      nombre: true,
      slug: true,
      precioBase: true,
      estado: true,
      destacado: true,
      orden: true,
      categoria: { select: { id: true, nombre: true } },
      banda: { select: { id: true, nombre: true } },
    },
    orderBy: [{ orden: "asc" }, { nombre: "asc" }],
  });

  return productos.map((producto) => ({
    ...producto,
    precioBase: producto.precioBase.toString(),
  }));
}

export async function obtenerProductoPorId(
  id: string,
): Promise<ProductoEditable | null> {
  const producto = await clientePrisma.producto.findUnique({
    where: { id },
    select: seleccionProductoEditable,
  });

  return producto
    ? { ...producto, precioBase: producto.precioBase.toString() }
    : null;
}

export function crearProducto(datos: DatosProducto) {
  return clientePrisma.producto.create({
    data: prepararDatosPersistencia(datos),
  });
}

export function actualizarProducto(id: string, datos: DatosProducto) {
  return clientePrisma.producto.update({
    where: { id },
    data: prepararDatosPersistencia(datos),
  });
}

export function eliminarProducto(id: string) {
  return clientePrisma.producto.delete({ where: { id } });
}

export function cambiarEstadoProducto(
  id: string,
  estado: EstadoProductoDominio,
) {
  return clientePrisma.producto.update({
    where: { id },
    data: { estado },
  });
}

export function cambiarDestacadoProducto(id: string, destacado: boolean) {
  return clientePrisma.producto.update({
    where: { id },
    data: { destacado },
  });
}

export async function obtenerOpcionesRelacionesProducto(): Promise<{
  categorias: OpcionRelacionProducto[];
  bandas: OpcionRelacionProducto[];
}> {
  const [categorias, bandas] = await Promise.all([
    clientePrisma.categoria.findMany({
      select: { id: true, nombre: true, estaVisible: true },
      orderBy: [{ orden: "asc" }, { nombre: "asc" }],
    }),
    clientePrisma.banda.findMany({
      select: { id: true, nombre: true, estaVisible: true },
      orderBy: [{ orden: "asc" }, { nombre: "asc" }],
    }),
  ]);

  return { categorias, bandas };
}

export async function verificarReferenciasProducto(
  categoriaId: string,
  bandaId: string | null,
) {
  const [categoria, banda] = await Promise.all([
    clientePrisma.categoria.findUnique({
      where: { id: categoriaId },
      select: { id: true },
    }),
    bandaId
      ? clientePrisma.banda.findUnique({
          where: { id: bandaId },
          select: { id: true },
        })
      : Promise.resolve(null),
  ]);

  return {
    categoriaExiste: Boolean(categoria),
    bandaExiste: bandaId === null || Boolean(banda),
  };
}
