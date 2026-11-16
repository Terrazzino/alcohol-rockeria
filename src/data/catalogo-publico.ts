import "server-only";

import { Prisma } from "@/generated/prisma/client";

import {
  mapearProductoPublico,
  ordenProductosPublicos,
  seleccionProductoPublico,
} from "@/data/productos-publicos";
import {
  PRODUCTOS_POR_PAGINA,
  calcularPaginacionCatalogo,
  limitarCriteriosAOpcionesVisibles,
  type CatalogoPublico,
  type CriteriosCatalogo,
} from "@/domain/catalogo-publico";
import { clientePrisma } from "@/lib/prisma";

const estadosPublicos: Array<"ACTIVO" | "SIN_STOCK"> = ["ACTIVO", "SIN_STOCK"];

function crearFiltroCatalogo(
  criterios: CriteriosCatalogo,
): Prisma.ProductoWhereInput {
  const estado =
    criterios.disponibilidad === "disponible"
      ? "ACTIVO"
      : criterios.disponibilidad === "sin-stock"
        ? "SIN_STOCK"
        : { in: estadosPublicos };
  const filtro: Prisma.ProductoWhereInput = { estado };

  if (criterios.categoria) {
    filtro.categoria = {
      is: { slug: criterios.categoria, estaVisible: true },
    };
  }

  if (criterios.banda) {
    filtro.banda = { is: { slug: criterios.banda, estaVisible: true } };
  }

  if (criterios.buscar) {
    const contieneBusqueda = {
      contains: criterios.buscar,
      mode: Prisma.QueryMode.insensitive,
    };
    filtro.OR = [
      { nombre: contieneBusqueda },
      { descripcion: contieneBusqueda },
      {
        categoria: {
          is: { estaVisible: true, nombre: contieneBusqueda },
        },
      },
      {
        banda: {
          is: { estaVisible: true, nombre: contieneBusqueda },
        },
      },
    ];
  }

  return filtro;
}

export async function obtenerCatalogoPublico(
  criteriosSolicitados: CriteriosCatalogo,
): Promise<CatalogoPublico> {
  const [categorias, bandas] = await Promise.all([
    clientePrisma.categoria.findMany({
      where: { estaVisible: true },
      select: { id: true, nombre: true, slug: true, urlImagen: true },
      orderBy: [{ orden: "asc" }, { nombre: "asc" }],
    }),
    clientePrisma.banda.findMany({
      where: { estaVisible: true },
      select: { id: true, nombre: true, slug: true, urlImagen: true },
      orderBy: [{ orden: "asc" }, { nombre: "asc" }],
    }),
  ]);
  const criteriosVisibles = limitarCriteriosAOpcionesVisibles(
    criteriosSolicitados,
    categorias,
    bandas,
  );
  const where = crearFiltroCatalogo(criteriosVisibles);
  const totalProductos = await clientePrisma.producto.count({ where });
  const paginacion = calcularPaginacionCatalogo(
    totalProductos,
    criteriosVisibles.pagina,
  );
  const criterios = {
    ...criteriosVisibles,
    pagina: paginacion.paginaActual,
  };

  const productos = await clientePrisma.producto.findMany({
    where,
    select: seleccionProductoPublico,
    orderBy: ordenProductosPublicos,
    skip: (paginacion.paginaActual - 1) * PRODUCTOS_POR_PAGINA,
    take: PRODUCTOS_POR_PAGINA,
  });

  return {
    categorias,
    bandas,
    criterios,
    productos: productos.map(mapearProductoPublico),
    paginacion,
  };
}
