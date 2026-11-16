import { PATRON_SLUG } from "./slug";

import type { EstadoProductoPublico } from "./catalogo-publico";

export interface RelacionProductoPublica {
  nombre: string;
  slug: string;
}

export interface ImagenDetalleProducto {
  id: string;
  rutaImagen: string;
  textoAlternativo: string;
}

export interface VarianteDetalleProducto {
  id: string;
  nombre: string;
  estaDisponible: boolean;
  precio: string;
  usaPrecioBase: boolean;
}

export interface DetalleProductoPublico {
  id: string;
  nombre: string;
  slug: string;
  descripcion: string;
  precioBase: string;
  estado: EstadoProductoPublico;
  categoria: RelacionProductoPublica | null;
  banda: RelacionProductoPublica | null;
  imagenes: ImagenDetalleProducto[];
  variantes: VarianteDetalleProducto[];
}

export function normalizarSlugProductoPublico(slug: string): string | null {
  const normalizado = slug.trim().toLowerCase();

  return normalizado.length > 0 &&
    normalizado.length <= 160 &&
    PATRON_SLUG.test(normalizado)
    ? normalizado
    : null;
}
