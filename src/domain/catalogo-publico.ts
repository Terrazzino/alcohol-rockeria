import type { EstadoProductoDominio } from "./productos";
import { PATRON_SLUG } from "./slug";

export const PRODUCTOS_POR_PAGINA = 12;
export const LONGITUD_MAXIMA_BUSQUEDA_CATALOGO = 120;

export type EstadoProductoPublico = Exclude<EstadoProductoDominio, "OCULTO">;
export type DisponibilidadCatalogo = "disponible" | "sin-stock";
export type ValorParametroCatalogo = string | string[] | undefined;

export interface ParametrosUrlCatalogo {
  buscar?: ValorParametroCatalogo;
  categoria?: ValorParametroCatalogo;
  banda?: ValorParametroCatalogo;
  disponibilidad?: ValorParametroCatalogo;
  pagina?: ValorParametroCatalogo;
}

export interface CriteriosCatalogo {
  buscar: string;
  categoria: string | null;
  banda: string | null;
  disponibilidad: DisponibilidadCatalogo | null;
  pagina: number;
}

export interface CategoriaPublica {
  id: string;
  nombre: string;
  slug: string;
  urlImagen: string | null;
}

export interface BandaPublica {
  id: string;
  nombre: string;
  slug: string;
  urlImagen: string | null;
}

export interface ImagenProductoPublica {
  rutaImagen: string;
  textoAlternativo: string;
}

export interface ProductoPublico {
  id: string;
  nombre: string;
  slug: string;
  precioBase: string;
  estado: EstadoProductoPublico;
  destacado: boolean;
  banda: BandaPublica | null;
  imagen: ImagenProductoPublica | null;
}

export interface PaginacionCatalogo {
  paginaActual: number;
  totalPaginas: number;
  totalProductos: number;
  desde: number;
  hasta: number;
  hayAnterior: boolean;
  haySiguiente: boolean;
}

export interface CatalogoPublico {
  categorias: CategoriaPublica[];
  bandas: BandaPublica[];
  productos: ProductoPublico[];
  paginacion: PaginacionCatalogo;
  criterios: CriteriosCatalogo;
}

function primerValor(valor: ValorParametroCatalogo): string | undefined {
  return Array.isArray(valor) ? valor[0] : valor;
}

function normalizarBusqueda(valor: ValorParametroCatalogo): string {
  return (primerValor(valor) ?? "")
    .trim()
    .replace(/\s+/g, " ")
    .slice(0, LONGITUD_MAXIMA_BUSQUEDA_CATALOGO);
}

function normalizarSlug(valor: ValorParametroCatalogo): string | null {
  const slug = (primerValor(valor) ?? "").trim().toLowerCase();
  return slug.length <= 120 && PATRON_SLUG.test(slug) ? slug : null;
}

function normalizarDisponibilidad(
  valor: ValorParametroCatalogo,
): DisponibilidadCatalogo | null {
  const disponibilidad = primerValor(valor);
  return disponibilidad === "disponible" || disponibilidad === "sin-stock"
    ? disponibilidad
    : null;
}

export function normalizarCriteriosCatalogo(
  parametros: ParametrosUrlCatalogo,
): CriteriosCatalogo {
  return {
    buscar: normalizarBusqueda(parametros.buscar),
    categoria: normalizarSlug(parametros.categoria),
    banda: normalizarSlug(parametros.banda),
    disponibilidad: normalizarDisponibilidad(parametros.disponibilidad),
    pagina: normalizarPaginaCatalogo(parametros.pagina),
  };
}

export function limitarCriteriosAOpcionesVisibles(
  criterios: CriteriosCatalogo,
  categorias: CategoriaPublica[],
  bandas: BandaPublica[],
): CriteriosCatalogo {
  return {
    ...criterios,
    categoria: categorias.some(({ slug }) => slug === criterios.categoria)
      ? criterios.categoria
      : null,
    banda: bandas.some(({ slug }) => slug === criterios.banda)
      ? criterios.banda
      : null,
  };
}

export function tieneCriteriosCatalogoActivos(
  criterios: CriteriosCatalogo,
): boolean {
  return Boolean(
    criterios.buscar ||
    criterios.categoria ||
    criterios.banda ||
    criterios.disponibilidad,
  );
}

export function crearParametrosUrlCatalogo(
  criterios: CriteriosCatalogo,
  pagina = criterios.pagina,
): string {
  const parametros = new URLSearchParams();

  if (criterios.buscar) parametros.set("buscar", criterios.buscar);
  if (criterios.categoria) parametros.set("categoria", criterios.categoria);
  if (criterios.banda) parametros.set("banda", criterios.banda);
  if (criterios.disponibilidad) {
    parametros.set("disponibilidad", criterios.disponibilidad);
  }
  if (pagina > 1) parametros.set("pagina", pagina.toString());

  return parametros.toString();
}

export function normalizarPaginaCatalogo(
  valor: string | string[] | undefined,
): number {
  const candidato = Array.isArray(valor) ? valor[0] : valor;
  if (!candidato || !/^\d+$/.test(candidato)) return 1;

  const pagina = Number(candidato);
  return Number.isSafeInteger(pagina) && pagina >= 1 ? pagina : 1;
}

export function calcularPaginacionCatalogo(
  totalProductos: number,
  paginaSolicitada: number,
  productosPorPagina = PRODUCTOS_POR_PAGINA,
): PaginacionCatalogo {
  const totalSeguro = Math.max(0, Math.trunc(totalProductos));
  const tamanoSeguro = Math.max(1, Math.trunc(productosPorPagina));
  const totalPaginas = Math.ceil(totalSeguro / tamanoSeguro);
  const paginaMaxima = Math.max(1, totalPaginas);
  const paginaActual = Math.min(
    Math.max(1, Math.trunc(paginaSolicitada)),
    paginaMaxima,
  );
  const desde = totalSeguro === 0 ? 0 : (paginaActual - 1) * tamanoSeguro + 1;
  const hasta = Math.min(paginaActual * tamanoSeguro, totalSeguro);

  return {
    paginaActual,
    totalPaginas,
    totalProductos: totalSeguro,
    desde,
    hasta,
    hayAnterior: paginaActual > 1,
    haySiguiente: paginaActual < totalPaginas,
  };
}
