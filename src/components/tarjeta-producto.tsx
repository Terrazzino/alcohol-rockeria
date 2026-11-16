import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { buttonStyles } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { ProductoPublico } from "@/domain/catalogo-publico";
import { formatearPrecioArgentino } from "@/domain/productos";

export function TarjetaProducto({ producto }: { producto: ProductoPublico }) {
  const estaDisponible = producto.estado === "ACTIVO";

  return (
    <Card className="group min-w-0 overflow-hidden transition duration-300 hover:-translate-y-1 hover:border-border-strong hover:shadow-elevated">
      <div className="relative aspect-[4/5] overflow-hidden bg-gradient-to-br from-border via-surface to-background">
        <div className="absolute inset-0 bg-grain opacity-30" />
        {producto.imagen ? (
          <Image
            src={producto.imagen.rutaImagen}
            alt={producto.imagen.textoAlternativo}
            fill
            sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 25vw"
            className={`object-contain p-4 transition duration-500 group-hover:scale-105 sm:p-5 ${estaDisponible ? "" : "grayscale"}`}
          />
        ) : (
          <div
            role="img"
            aria-label={`El producto ${producto.nombre} no tiene imagen cargada`}
            className="relative flex size-full items-center justify-center"
          >
            <span className="font-display text-6xl font-bold uppercase text-border-strong">
              AR
            </span>
          </div>
        )}
        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          {producto.destacado && <Badge variant="accent">Destacado</Badge>}
          <Badge variant={estaDisponible ? "success" : "error"}>
            {estaDisponible ? "Disponible" : "Sin stock"}
          </Badge>
        </div>
      </div>
      <CardContent className="grid gap-3">
        <div className="min-w-0">
          {producto.banda && (
            <p className="mb-1 text-xs font-bold uppercase tracking-[0.14em] text-accent">
              {producto.banda.nombre}
            </p>
          )}
          <h3 className="font-display text-xl font-bold uppercase leading-tight tracking-wide text-foreground">
            {producto.nombre}
          </h3>
        </div>
        <p className="text-lg font-bold tabular-nums text-foreground">
          {formatearPrecioArgentino(producto.precioBase)}
        </p>
        <Link
          href={`/productos/${producto.slug}`}
          className={buttonStyles({
            variant: "secondary",
            size: "sm",
            className: "w-full",
          })}
          aria-label={`Ver detalle de ${producto.nombre}`}
        >
          Ver detalle
        </Link>
      </CardContent>
    </Card>
  );
}
