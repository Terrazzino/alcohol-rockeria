import "server-only";

import { Prisma } from "@/generated/prisma/client";

import type {
  DatosVariante,
  ProductoConVariantes,
  VarianteEditable,
  VarianteListado,
} from "@/domain/variantes";
import { clientePrisma } from "@/lib/prisma";

const seleccionVariante = {
  id: true,
  nombre: true,
  sku: true,
  precioEspecifico: true,
  estaDisponible: true,
  orden: true,
} as const;

function prepararDatosPersistencia(datos: DatosVariante) {
  return {
    ...datos,
    precioEspecifico:
      datos.precioEspecifico === null
        ? null
        : new Prisma.Decimal(datos.precioEspecifico),
  };
}

export async function obtenerProductoParaVariantes(
  id: string,
): Promise<ProductoConVariantes | null> {
  const producto = await clientePrisma.producto.findUnique({
    where: { id },
    select: {
      id: true,
      nombre: true,
      precioBase: true,
      categoria: { select: { nombre: true } },
      banda: { select: { nombre: true } },
    },
  });

  return producto
    ? { ...producto, precioBase: producto.precioBase.toString() }
    : null;
}

export async function obtenerVariantesPorProducto(
  productoId: string,
): Promise<VarianteListado[]> {
  const variantes = await clientePrisma.varianteProducto.findMany({
    where: { productoId },
    select: seleccionVariante,
    orderBy: [{ orden: "asc" }, { nombre: "asc" }],
  });

  return variantes.map((variante) => ({
    ...variante,
    precioEspecifico: variante.precioEspecifico?.toString() ?? null,
  }));
}

export async function obtenerVariantePorId(
  productoId: string,
  id: string,
): Promise<VarianteEditable | null> {
  const variante = await clientePrisma.varianteProducto.findFirst({
    where: { id, productoId },
    select: seleccionVariante,
  });

  return variante
    ? {
        ...variante,
        precioEspecifico: variante.precioEspecifico?.toString() ?? null,
      }
    : null;
}

export function crearVariante(productoId: string, datos: DatosVariante) {
  return clientePrisma.varianteProducto.create({
    data: { productoId, ...prepararDatosPersistencia(datos) },
  });
}

export function actualizarVariante(
  productoId: string,
  id: string,
  datos: DatosVariante,
) {
  return clientePrisma.varianteProducto.update({
    where: { id, productoId },
    data: prepararDatosPersistencia(datos),
  });
}

export function eliminarVariante(productoId: string, id: string) {
  return clientePrisma.varianteProducto.delete({ where: { id, productoId } });
}

export function cambiarDisponibilidadVariante(
  productoId: string,
  id: string,
  estaDisponible: boolean,
) {
  return clientePrisma.varianteProducto.update({
    where: { id, productoId },
    data: { estaDisponible },
  });
}
