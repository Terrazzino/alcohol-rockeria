import "server-only";

import type {
  CategoriaEditable,
  CategoriaListado,
  DatosCategoria,
} from "@/domain/categorias";
import { clientePrisma } from "@/lib/prisma";

const seleccionCategoria = {
  id: true,
  nombre: true,
  slug: true,
  descripcion: true,
  urlImagen: true,
  orden: true,
  estaVisible: true,
} as const;

export async function obtenerCategorias(): Promise<CategoriaListado[]> {
  const categorias = await clientePrisma.categoria.findMany({
    select: {
      ...seleccionCategoria,
      _count: { select: { productos: true } },
    },
    orderBy: [{ orden: "asc" }, { nombre: "asc" }],
  });

  return categorias.map(({ _count, ...categoria }) => ({
    ...categoria,
    cantidadProductos: _count.productos,
  }));
}

export function obtenerCategoriaPorId(
  id: string,
): Promise<CategoriaEditable | null> {
  return clientePrisma.categoria.findUnique({
    where: { id },
    select: seleccionCategoria,
  });
}

export function crearCategoria(datos: DatosCategoria) {
  return clientePrisma.categoria.create({ data: datos });
}

export function actualizarCategoria(id: string, datos: DatosCategoria) {
  return clientePrisma.categoria.update({ where: { id }, data: datos });
}

export function eliminarCategoria(id: string) {
  return clientePrisma.categoria.delete({ where: { id } });
}

export function cambiarVisibilidadCategoria(id: string, estaVisible: boolean) {
  return clientePrisma.categoria.update({
    where: { id },
    data: { estaVisible },
  });
}
