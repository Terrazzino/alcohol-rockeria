import Image from "next/image";
import Link from "next/link";

import { TarjetaProducto } from "@/components/tarjeta-producto";
import { Badge } from "@/components/ui/badge";
import { buttonStyles } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import type {
  BandaPublica,
  CategoriaPublica,
  CriteriosCatalogo,
  PaginacionCatalogo,
  ProductoPublico,
} from "@/domain/catalogo-publico";
import {
  crearParametrosUrlCatalogo,
  LONGITUD_MAXIMA_BUSQUEDA_CATALOGO,
  tieneCriteriosCatalogoActivos,
} from "@/domain/catalogo-publico";

export function CategoriasPublicas({
  categorias,
}: {
  categorias: CategoriaPublica[];
}) {
  if (categorias.length === 0) {
    return (
      <EmptyState
        title="No hay categorías visibles"
        description="Las categorías cargadas aparecerán aquí cuando estén habilitadas para el catálogo."
      />
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
      {categorias.map((categoria) => (
        <Link
          key={categoria.id}
          href={`/?categoria=${encodeURIComponent(categoria.slug)}#productos`}
          className="group rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
          aria-label={`Ver productos de la categoría ${categoria.nombre}`}
        >
          <Card className="relative min-h-44 overflow-hidden bg-surface-raised transition duration-300 group-hover:-translate-y-1 group-hover:border-border-strong group-hover:shadow-elevated sm:min-h-56">
            {categoria.urlImagen ? (
              <Image
                src={categoria.urlImagen}
                alt={`Imagen de la categoría ${categoria.nombre}`}
                fill
                unoptimized
                sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw"
                className="object-cover opacity-55 transition duration-500 group-hover:scale-105 group-hover:opacity-70"
              />
            ) : (
              <div className="absolute inset-0 bg-grain opacity-30" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/35 to-transparent" />
            <h3 className="absolute bottom-5 left-5 right-5 break-words font-display text-3xl font-bold uppercase leading-none tracking-wide text-foreground sm:text-4xl">
              {categoria.nombre}
            </h3>
          </Card>
        </Link>
      ))}
    </div>
  );
}

export function BandasPublicas({ bandas }: { bandas: BandaPublica[] }) {
  if (bandas.length === 0) {
    return (
      <EmptyState
        title="No hay bandas visibles"
        description="Las bandas habilitadas aparecerán aquí cuando estén disponibles."
      />
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {bandas.map((banda) => (
        <Link
          key={banda.id}
          href={`/?banda=${encodeURIComponent(banda.slug)}#productos`}
          className="group relative flex min-h-28 items-end overflow-hidden rounded-sm border border-border bg-surface p-4 font-display text-lg font-bold uppercase tracking-[0.08em] text-foreground transition duration-300 hover:-translate-y-1 hover:border-border-strong focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent sm:min-h-36"
          aria-label={`Ver productos de ${banda.nombre}`}
        >
          {banda.urlImagen ? (
            <Image
              src={banda.urlImagen}
              alt={`Imagen de la banda ${banda.nombre}`}
              fill
              unoptimized
              sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 25vw"
              className="object-cover opacity-35 transition duration-500 group-hover:scale-105 group-hover:opacity-50"
            />
          ) : (
            <div className="absolute inset-0 bg-grain opacity-25" />
          )}
          <span className="absolute inset-0 bg-gradient-to-t from-background via-background/45 to-transparent" />
          <span className="relative break-words">{banda.nombre}</span>
        </Link>
      ))}
    </div>
  );
}

export function FiltrosCatalogoPublico({
  bandas,
  categorias,
  criterios,
  totalResultados,
}: {
  bandas: BandaPublica[];
  categorias: CategoriaPublica[];
  criterios: CriteriosCatalogo;
  totalResultados: number;
}) {
  const categoriaActiva = categorias.find(
    ({ slug }) => slug === criterios.categoria,
  );
  const bandaActiva = bandas.find(({ slug }) => slug === criterios.banda);
  const filtrosActivos = [
    criterios.buscar ? `Búsqueda: “${criterios.buscar}”` : null,
    categoriaActiva ? `Categoría: ${categoriaActiva.nombre}` : null,
    bandaActiva ? `Banda: ${bandaActiva.nombre}` : null,
    criterios.disponibilidad === "disponible"
      ? "Disponibilidad: disponible"
      : criterios.disponibilidad === "sin-stock"
        ? "Disponibilidad: sin stock"
        : null,
  ].filter((filtro): filtro is string => Boolean(filtro));

  return (
    <div className="mb-8 rounded-sm border border-border bg-surface p-4 shadow-card sm:p-5">
      <form
        action="/#productos"
        method="get"
        className="grid gap-4 lg:grid-cols-[minmax(14rem,1.5fr)_repeat(3,minmax(10rem,1fr))] lg:items-end"
      >
        <Input
          id="buscar-catalogo"
          name="buscar"
          type="search"
          label="Buscar productos"
          placeholder="Producto, banda o categoría"
          defaultValue={criterios.buscar}
          maxLength={LONGITUD_MAXIMA_BUSQUEDA_CATALOGO}
        />
        <Select
          id="categoria-catalogo"
          name="categoria"
          label="Categoría"
          defaultValue={criterios.categoria ?? ""}
        >
          <option value="">Todas</option>
          {categorias.map((categoria) => (
            <option key={categoria.id} value={categoria.slug}>
              {categoria.nombre}
            </option>
          ))}
        </Select>
        <Select
          id="banda-catalogo"
          name="banda"
          label="Banda"
          defaultValue={criterios.banda ?? ""}
        >
          <option value="">Todas</option>
          {bandas.map((banda) => (
            <option key={banda.id} value={banda.slug}>
              {banda.nombre}
            </option>
          ))}
        </Select>
        <Select
          id="disponibilidad-catalogo"
          name="disponibilidad"
          label="Disponibilidad"
          defaultValue={criterios.disponibilidad ?? ""}
        >
          <option value="">Todos los estados</option>
          <option value="disponible">Disponible</option>
          <option value="sin-stock">Sin stock</option>
        </Select>
        <div className="flex flex-col gap-3 sm:flex-row lg:col-span-4">
          <button
            type="submit"
            className={buttonStyles({ className: "w-full sm:w-auto" })}
          >
            Aplicar criterios
          </button>
          {filtrosActivos.length > 0 && (
            <Link
              href="/#productos"
              className={buttonStyles({
                variant: "secondary",
                className: "w-full sm:w-auto",
              })}
            >
              Limpiar
            </Link>
          )}
        </div>
      </form>

      <div
        className="mt-4 flex flex-wrap items-center gap-2 border-t border-border pt-4"
        aria-live="polite"
      >
        <p className="mr-1 text-sm font-semibold text-foreground-secondary">
          {totalResultados} {totalResultados === 1 ? "resultado" : "resultados"}
        </p>
        {filtrosActivos.map((filtro) => (
          <Badge key={filtro}>{filtro}</Badge>
        ))}
        {filtrosActivos.length === 0 && (
          <span className="text-sm text-muted">Sin criterios activos</span>
        )}
      </div>
    </div>
  );
}

function enlacePagina(criterios: CriteriosCatalogo, pagina: number) {
  const parametros = crearParametrosUrlCatalogo(criterios, pagina);
  return parametros ? `/?${parametros}#productos` : "/#productos";
}

function NavegacionPaginas({
  criterios,
  paginacion,
}: {
  criterios: CriteriosCatalogo;
  paginacion: PaginacionCatalogo;
}) {
  if (paginacion.totalPaginas <= 1) return null;

  return (
    <nav
      className="mt-8 flex flex-col items-center justify-between gap-4 rounded-sm border border-border bg-surface p-4 sm:flex-row"
      aria-label="Paginación del catálogo"
    >
      <p className="text-sm text-foreground-secondary" aria-live="polite">
        Mostrando {paginacion.desde}–{paginacion.hasta} de{" "}
        {paginacion.totalProductos} productos
      </p>
      <div className="flex w-full gap-3 sm:w-auto">
        {paginacion.hayAnterior ? (
          <Link
            href={enlacePagina(criterios, paginacion.paginaActual - 1)}
            className={buttonStyles({
              variant: "secondary",
              size: "sm",
              className: "flex-1 sm:flex-none",
            })}
          >
            Anterior
          </Link>
        ) : (
          <span
            aria-disabled="true"
            className={buttonStyles({
              variant: "secondary",
              size: "sm",
              className: "flex-1 opacity-45 sm:flex-none",
            })}
          >
            Anterior
          </span>
        )}
        <span className="inline-flex min-h-10 items-center px-2 text-sm font-semibold">
          {paginacion.paginaActual} / {paginacion.totalPaginas}
        </span>
        {paginacion.haySiguiente ? (
          <Link
            href={enlacePagina(criterios, paginacion.paginaActual + 1)}
            className={buttonStyles({
              variant: "secondary",
              size: "sm",
              className: "flex-1 sm:flex-none",
            })}
          >
            Siguiente
          </Link>
        ) : (
          <span
            aria-disabled="true"
            className={buttonStyles({
              variant: "secondary",
              size: "sm",
              className: "flex-1 opacity-45 sm:flex-none",
            })}
          >
            Siguiente
          </span>
        )}
      </div>
    </nav>
  );
}

export function ProductosPublicos({
  criterios,
  productos,
  paginacion,
}: {
  criterios: CriteriosCatalogo;
  productos: ProductoPublico[];
  paginacion: PaginacionCatalogo;
}) {
  if (productos.length === 0) {
    const hayCriterios = tieneCriteriosCatalogoActivos(criterios);

    return (
      <EmptyState
        title={
          hayCriterios
            ? "No encontramos coincidencias"
            : "No hay productos publicados"
        }
        description={
          hayCriterios
            ? "Probá con otros términos o restablecé los filtros del catálogo."
            : "El catálogo mostrará productos cuando estén activos o marcados como sin stock."
        }
        action={
          hayCriterios ? (
            <Link
              href="/#productos"
              className={buttonStyles({ variant: "secondary" })}
            >
              Restablecer criterios
            </Link>
          ) : undefined
        }
      />
    );
  }

  return (
    <>
      <div className="grid min-w-0 grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {productos.map((producto) => (
          <TarjetaProducto key={producto.id} producto={producto} />
        ))}
      </div>
      <NavegacionPaginas criterios={criterios} paginacion={paginacion} />
    </>
  );
}
