import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { buttonStyles } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import type {
  DetalleProductoPublico,
  ImagenDetalleProducto,
} from "@/domain/detalle-producto";
import { formatearPrecioArgentino } from "@/domain/productos";
import { SelectorCarritoProducto } from "@/features/carrito/selector-carrito-producto";

function SinImagen({ nombre }: { nombre: string }) {
  return (
    <div
      role="img"
      aria-label={`El producto ${nombre} no tiene imágenes cargadas`}
      className="flex aspect-square items-center justify-center rounded-sm border border-border bg-gradient-to-br from-border via-surface to-background"
    >
      <span className="font-display text-7xl font-bold uppercase text-border-strong">
        AR
      </span>
    </div>
  );
}

function ImagenGaleria({
  imagen,
  principal = false,
}: {
  imagen: ImagenDetalleProducto;
  principal?: boolean;
}) {
  return (
    <div className="relative aspect-square overflow-hidden rounded-sm border border-border bg-background-secondary">
      <Image
        src={imagen.rutaImagen}
        alt={imagen.textoAlternativo}
        fill
        sizes={
          principal
            ? "(max-width: 1023px) 100vw, 55vw"
            : "(max-width: 639px) 50vw, (max-width: 1023px) 33vw, 18vw"
        }
        className="object-contain p-3 sm:p-5"
        priority={principal}
      />
    </div>
  );
}

function GaleriaProducto({ producto }: { producto: DetalleProductoPublico }) {
  const [principal, ...restantes] = producto.imagenes;

  return (
    <section aria-labelledby="titulo-galeria-producto">
      <h2 id="titulo-galeria-producto" className="sr-only">
        Galería de {producto.nombre}
      </h2>
      {!principal ? (
        <SinImagen nombre={producto.nombre} />
      ) : (
        <>
          <ImagenGaleria imagen={principal} principal />
          {restantes.length > 0 && (
            <ul
              className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3"
              aria-label="Imágenes adicionales"
            >
              {restantes.map((imagen) => (
                <li key={imagen.id}>
                  <ImagenGaleria imagen={imagen} />
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </section>
  );
}

export function DetalleProducto({
  producto,
  numeroWhatsapp,
}: {
  producto: DetalleProductoPublico;
  numeroWhatsapp: string | null;
}) {
  const estaDisponible = producto.estado === "ACTIVO";

  return (
    <main id="contenido-principal" className="flex-1 py-8 sm:py-12 lg:py-16">
      <Container>
        <Link
          href="/#productos"
          className={buttonStyles({ variant: "ghost", size: "sm" })}
        >
          <span aria-hidden="true">←</span>
          Volver al catálogo
        </Link>

        <div className="mt-6 grid min-w-0 gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(20rem,0.95fr)] lg:items-start">
          <GaleriaProducto producto={producto} />

          <article className="min-w-0 lg:sticky lg:top-24">
            <div className="flex flex-wrap gap-2">
              <Badge variant={estaDisponible ? "success" : "error"}>
                {estaDisponible ? "Producto disponible" : "Producto sin stock"}
              </Badge>
              {producto.categoria && <Badge>{producto.categoria.nombre}</Badge>}
              {producto.banda && (
                <Badge variant="accent">{producto.banda.nombre}</Badge>
              )}
            </div>

            <h1 className="mt-5 break-words font-display text-4xl font-bold uppercase leading-none tracking-wide text-foreground sm:text-5xl">
              {producto.nombre}
            </h1>
            <p className="mt-5 text-3xl font-black tabular-nums text-accent">
              {formatearPrecioArgentino(producto.precioBase)}
            </p>
            <p className="mt-1 text-xs font-bold uppercase tracking-[0.14em] text-muted">
              Precio base
            </p>

            <div className="mt-6 border-t border-border pt-6">
              <h2 className="font-display text-xl font-bold uppercase tracking-wide">
                Descripción
              </h2>
              <p className="mt-3 whitespace-pre-line text-base leading-7 text-foreground-secondary">
                {producto.descripcion}
              </p>
            </div>

            <SelectorCarritoProducto
              producto={producto}
              numeroWhatsapp={numeroWhatsapp}
            />
          </article>
        </div>
      </Container>
    </main>
  );
}
