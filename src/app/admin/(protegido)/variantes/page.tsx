import type { Metadata } from "next";
import Link from "next/link";

import { EncabezadoPaginaAdmin } from "@/components/admin/encabezado-pagina-admin";
import { EstadoVacioAdmin } from "@/components/admin/estado-vacio-admin";
import { Badge } from "@/components/ui/badge";
import { buttonStyles } from "@/components/ui/button";
import { obtenerProductos } from "@/data/productos";

export const metadata: Metadata = { title: "Variantes | Administración" };

export default async function PaginaVariantes() {
  const productos = await obtenerProductos();

  return (
    <>
      <EncabezadoPaginaAdmin
        titulo="Variantes"
        descripcion="Elegí un producto para administrar sus talles, colores u otras opciones de forma contextual."
        etiqueta="Catálogo"
        acciones={
          <Link
            href="/admin/productos"
            className={buttonStyles({ variant: "secondary" })}
          >
            Ver productos
          </Link>
        }
      />

      <section className="pt-7 sm:pt-8" aria-label="Productos con variantes">
        {productos.length === 0 ? (
          <EstadoVacioAdmin
            titulo="No hay productos todavía"
            descripcion="Primero creá un producto y después vas a poder agregarle variantes."
            accion={
              <Link href="/admin/productos/nuevo" className={buttonStyles()}>
                Crear producto
              </Link>
            }
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {productos.map((producto) => (
              <Link
                key={producto.id}
                href={`/admin/productos/${producto.id}/variantes`}
                className="group min-w-0 rounded-sm border border-border bg-surface p-5 shadow-card transition-colors hover:border-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
              >
                <div className="flex items-start justify-between gap-3">
                  <h2 className="break-words font-display text-2xl font-bold uppercase tracking-wide group-hover:text-accent">
                    {producto.nombre}
                  </h2>
                  <Badge variant="accent">{producto.cantidadVariantes}</Badge>
                </div>
                <p className="mt-3 text-sm text-foreground-secondary">
                  {producto.cantidadVariantes === 1
                    ? "1 variante cargada"
                    : `${producto.cantidadVariantes} variantes cargadas`}
                </p>
                <p className="mt-5 text-xs font-bold uppercase tracking-[0.12em] text-accent">
                  Gestionar variantes →
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
