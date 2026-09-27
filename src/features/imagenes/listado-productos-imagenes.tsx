import Image from "next/image";
import Link from "next/link";

import { buttonStyles } from "@/components/ui/button";
import type { ProductoResumenImagenes } from "@/domain/imagenes";

export function ListadoProductosImagenes({
  productos,
}: {
  productos: ProductoResumenImagenes[];
}) {
  return (
    <section aria-labelledby="titulo-productos-imagenes">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2
          id="titulo-productos-imagenes"
          className="font-display text-2xl font-bold uppercase tracking-wide"
        >
          Productos
        </h2>
        <p className="text-sm text-muted">{productos.length} productos</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {productos.map((producto) => (
          <article
            key={producto.id}
            className="overflow-hidden rounded-sm border border-border bg-surface shadow-card"
          >
            <div className="relative aspect-[4/3] bg-background-secondary">
              {producto.imagenPrincipal ? (
                <Image
                  src={producto.imagenPrincipal.rutaImagen}
                  alt={producto.imagenPrincipal.textoAlternativo}
                  fill
                  sizes="(max-width: 639px) 100vw, (max-width: 1279px) 50vw, 33vw"
                  className="object-contain"
                />
              ) : (
                <div className="flex size-full items-center justify-center p-6 text-sm text-muted">
                  Sin imagen principal
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-display text-2xl font-bold uppercase tracking-wide">
                {producto.nombre}
              </h3>
              <p className="mt-1 break-all text-xs text-muted">
                /{producto.slug}
              </p>
              <p className="mt-3 text-sm text-foreground-secondary">
                {producto.cantidadImagenes}{" "}
                {producto.cantidadImagenes === 1 ? "imagen" : "imágenes"}
              </p>
              <Link
                href={`/admin/productos/${producto.id}/imagenes`}
                className={buttonStyles({ className: "mt-4 w-full" })}
              >
                Gestionar imágenes
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
