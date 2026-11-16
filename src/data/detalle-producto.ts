import "server-only";

import type {
  DetalleProductoPublico,
  VarianteDetalleProducto,
} from "@/domain/detalle-producto";
import type { EstadoProductoPublico } from "@/domain/catalogo-publico";
import { obtenerPrecioEfectivo } from "@/domain/variantes";
import { ordenImagenesProductoPublicas } from "@/data/orden-imagenes-publicas";
import { clientePrisma } from "@/lib/prisma";

const estadosPublicos: EstadoProductoPublico[] = ["ACTIVO", "SIN_STOCK"];

function esEstadoProductoPublico(
  estado: string,
): estado is EstadoProductoPublico {
  return estado === "ACTIVO" || estado === "SIN_STOCK";
}

function mapearVariante(
  precioBase: string,
  variante: {
    id: string;
    nombre: string;
    estaDisponible: boolean;
    precioEspecifico: { toString(): string } | null;
  },
): VarianteDetalleProducto {
  const precio = obtenerPrecioEfectivo(
    precioBase,
    variante.precioEspecifico?.toString() ?? null,
  );

  return {
    id: variante.id,
    nombre: variante.nombre,
    estaDisponible: variante.estaDisponible,
    precio: precio.precio,
    usaPrecioBase: precio.usaPrecioBase,
  };
}

export async function obtenerDetalleProductoPublico(
  slug: string,
): Promise<DetalleProductoPublico | null> {
  const producto = await clientePrisma.producto.findFirst({
    where: { slug, estado: { in: estadosPublicos } },
    select: {
      id: true,
      nombre: true,
      slug: true,
      descripcion: true,
      precioBase: true,
      estado: true,
      categoria: {
        select: { nombre: true, slug: true, estaVisible: true },
      },
      banda: {
        select: { nombre: true, slug: true, estaVisible: true },
      },
      imagenes: {
        select: {
          id: true,
          rutaImagen: true,
          textoAlternativo: true,
        },
        orderBy: ordenImagenesProductoPublicas,
      },
      variantes: {
        select: {
          id: true,
          nombre: true,
          precioEspecifico: true,
          estaDisponible: true,
        },
        orderBy: [{ orden: "asc" }, { nombre: "asc" }, { id: "asc" }],
      },
    },
  });

  if (!producto) return null;
  if (!esEstadoProductoPublico(producto.estado)) {
    throw new Error("La consulta pública devolvió un producto oculto.");
  }

  const precioBase = producto.precioBase.toString();

  return {
    id: producto.id,
    nombre: producto.nombre,
    slug: producto.slug,
    descripcion: producto.descripcion,
    precioBase,
    estado: producto.estado,
    categoria: producto.categoria.estaVisible
      ? {
          nombre: producto.categoria.nombre,
          slug: producto.categoria.slug,
        }
      : null,
    banda: producto.banda?.estaVisible
      ? { nombre: producto.banda.nombre, slug: producto.banda.slug }
      : null,
    imagenes: producto.imagenes,
    variantes: producto.variantes.map((variante) =>
      mapearVariante(precioBase, variante),
    ),
  };
}
