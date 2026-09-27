import "server-only";

import type {
  DatosImagen,
  ImagenProductoListado,
  ProductoParaImagenes,
  ProductoResumenImagenes,
} from "@/domain/imagenes";
import { clientePrisma } from "@/lib/prisma";

const seleccionImagen = {
  id: true,
  rutaImagen: true,
  textoAlternativo: true,
  orden: true,
  esPrincipal: true,
  creadoEn: true,
} as const;

export async function obtenerProductosParaImagenes(): Promise<
  ProductoResumenImagenes[]
> {
  const productos = await clientePrisma.producto.findMany({
    select: {
      id: true,
      nombre: true,
      slug: true,
      _count: { select: { imagenes: true } },
      imagenes: {
        where: { esPrincipal: true },
        select: { rutaImagen: true, textoAlternativo: true },
        take: 1,
      },
    },
    orderBy: [{ orden: "asc" }, { nombre: "asc" }],
  });

  return productos.map(({ _count, imagenes, ...producto }) => ({
    ...producto,
    cantidadImagenes: _count.imagenes,
    imagenPrincipal: imagenes[0] ?? null,
  }));
}

export function obtenerProductoParaImagenes(
  id: string,
): Promise<ProductoParaImagenes | null> {
  return clientePrisma.producto.findUnique({
    where: { id },
    select: { id: true, nombre: true, slug: true },
  });
}

export function obtenerImagenesPorProducto(
  productoId: string,
): Promise<ImagenProductoListado[]> {
  return clientePrisma.imagenProducto.findMany({
    where: { productoId },
    select: seleccionImagen,
    orderBy: [{ orden: "asc" }, { creadoEn: "asc" }],
  });
}

export function obtenerImagenPorId(productoId: string, id: string) {
  return clientePrisma.imagenProducto.findFirst({
    where: { id, productoId },
    select: seleccionImagen,
  });
}

export function crearImagen(
  productoId: string,
  rutaImagen: string,
  datos: DatosImagen,
) {
  return clientePrisma.$transaction(async (transaccion) => {
    const cantidad = await transaccion.imagenProducto.count({
      where: { productoId },
    });
    const esPrincipal = cantidad === 0 || datos.esPrincipal;

    if (esPrincipal) {
      await transaccion.imagenProducto.updateMany({
        where: { productoId, esPrincipal: true },
        data: { esPrincipal: false },
      });
    }

    return transaccion.imagenProducto.create({
      data: { productoId, rutaImagen, ...datos, esPrincipal },
      select: seleccionImagen,
    });
  });
}

export function actualizarImagen(
  productoId: string,
  id: string,
  datos: Pick<DatosImagen, "textoAlternativo" | "orden">,
) {
  return clientePrisma.imagenProducto.update({
    where: { id, productoId },
    data: datos,
    select: seleccionImagen,
  });
}

export function definirImagenPrincipal(productoId: string, id: string) {
  return clientePrisma.$transaction(async (transaccion) => {
    const imagen = await transaccion.imagenProducto.findFirst({
      where: { id, productoId },
      select: { id: true },
    });
    if (!imagen) return null;

    await transaccion.imagenProducto.updateMany({
      where: { productoId, esPrincipal: true, NOT: { id } },
      data: { esPrincipal: false },
    });
    await transaccion.imagenProducto.update({
      where: { id, productoId },
      data: { esPrincipal: true },
    });

    return imagen;
  });
}

export function eliminarImagen(productoId: string, id: string) {
  return clientePrisma.$transaction(async (transaccion) => {
    const imagen = await transaccion.imagenProducto.findFirst({
      where: { id, productoId },
      select: { id: true, rutaImagen: true, esPrincipal: true },
    });
    if (!imagen) return null;

    await transaccion.imagenProducto.delete({ where: { id, productoId } });

    if (imagen.esPrincipal) {
      const siguiente = await transaccion.imagenProducto.findFirst({
        where: { productoId },
        select: { id: true },
        orderBy: [{ orden: "asc" }, { creadoEn: "asc" }],
      });
      if (siguiente) {
        await transaccion.imagenProducto.update({
          where: { id: siguiente.id },
          data: { esPrincipal: true },
        });
      }
    }

    return imagen;
  });
}
