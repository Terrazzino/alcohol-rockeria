import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { z } from "zod";

import { EncabezadoPaginaAdmin } from "@/components/admin/encabezado-pagina-admin";
import { EstadoVacioAdmin } from "@/components/admin/estado-vacio-admin";
import { Badge } from "@/components/ui/badge";
import { buttonStyles } from "@/components/ui/button";
import {
  obtenerProductoParaVariantes,
  obtenerVariantesPorProducto,
} from "@/data/variantes";
import { formatearPrecioArgentino } from "@/domain/productos";
import { ListadoVariantes } from "@/features/variantes/listado-variantes";

export const metadata: Metadata = {
  title: "Variantes del producto | Administración",
};

interface PaginaVariantesProductoProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ resultado?: string | string[] }>;
}

const mensajesResultado: Record<string, string> = {
  creada: "La variante se creó correctamente.",
  actualizada: "La variante se actualizó correctamente.",
};

export default async function PaginaVariantesProducto({
  params,
  searchParams,
}: PaginaVariantesProductoProps) {
  const { id } = await params;
  if (!z.uuid().safeParse(id).success) notFound();

  const [producto, variantes, parametros] = await Promise.all([
    obtenerProductoParaVariantes(id),
    obtenerVariantesPorProducto(id),
    searchParams,
  ]);
  if (!producto) notFound();

  const resultado = Array.isArray(parametros.resultado)
    ? parametros.resultado[0]
    : parametros.resultado;
  const mensaje = resultado ? mensajesResultado[resultado] : undefined;

  return (
    <>
      <EncabezadoPaginaAdmin
        titulo={`Variantes · ${producto.nombre}`}
        descripcion="Administrá las opciones específicas de este producto sin modificar el producto principal."
        etiqueta="Productos"
        acciones={
          <div className="flex flex-wrap gap-2">
            <Link
              href="/admin/productos"
              className={buttonStyles({ variant: "secondary" })}
            >
              Volver
            </Link>
            <Link
              href={`/admin/productos/${producto.id}/variantes/nueva`}
              className={buttonStyles()}
            >
              Nueva variante
            </Link>
          </div>
        }
      />

      <section className="mt-6 flex flex-wrap gap-3 rounded-sm border border-border bg-surface p-4 text-sm">
        <div>
          <span className="text-muted">Precio base</span>
          <p className="mt-1 font-bold text-accent">
            {formatearPrecioArgentino(producto.precioBase)}
          </p>
        </div>
        <div className="h-auto w-px bg-border" aria-hidden="true" />
        <div>
          <span className="text-muted">Categoría</span>
          <p className="mt-1 font-semibold">{producto.categoria.nombre}</p>
        </div>
        <div className="h-auto w-px bg-border" aria-hidden="true" />
        <div>
          <span className="text-muted">Banda</span>
          <p className="mt-1 font-semibold">
            {producto.banda?.nombre ?? "Sin banda"}
          </p>
        </div>
        <Badge className="self-center">Producto</Badge>
      </section>

      {mensaje ? (
        <p
          role="status"
          className="mt-6 rounded-sm border border-success/40 bg-success-soft p-4 text-sm text-success"
        >
          {mensaje}
        </p>
      ) : null}

      <div className="pt-7 sm:pt-8">
        {variantes.length === 0 ? (
          <EstadoVacioAdmin
            titulo="Este producto no tiene variantes"
            descripcion="Es válido dejarlo así. Si tiene talles, colores u otras opciones, podés crear la primera variante."
            accion={
              <Link
                href={`/admin/productos/${producto.id}/variantes/nueva`}
                className={buttonStyles()}
              >
                Crear primera variante
              </Link>
            }
          />
        ) : (
          <ListadoVariantes
            productoId={producto.id}
            precioBase={producto.precioBase}
            variantes={variantes}
          />
        )}
      </div>
    </>
  );
}
