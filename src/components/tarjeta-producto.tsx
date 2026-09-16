import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/cn";

export type EstadoVisualProducto = "disponible" | "sin-stock";

export interface PropiedadesTarjetaProducto {
  nombre: string;
  banda?: string;
  precio: string;
  rutaImagen: string;
  textoAlternativoImagen: string;
  estado: EstadoVisualProducto;
  destacado?: boolean;
  tonoVisual?: "dorado" | "carbon" | "crema";
}

const toneClasses = {
  dorado: "from-accent/25 via-surface-raised to-background-secondary",
  carbon: "from-border via-surface to-background",
  crema: "from-[#584c27] via-surface-raised to-background-secondary",
} as const;

export function TarjetaProducto({
  banda,
  destacado = false,
  estado,
  nombre,
  precio,
  rutaImagen,
  textoAlternativoImagen,
  tonoVisual = "carbon",
}: PropiedadesTarjetaProducto) {
  const estaDisponible = estado === "disponible";

  return (
    <Card className="group min-w-0 overflow-hidden transition duration-300 hover:-translate-y-1 hover:border-border-strong hover:shadow-elevated">
      <div
        className={cn(
          "relative aspect-[4/5] overflow-hidden bg-gradient-to-br",
          toneClasses[tonoVisual],
        )}
      >
        <div className="absolute inset-0 bg-grain opacity-30" />
        <Image
          src={rutaImagen}
          alt={textoAlternativoImagen}
          fill
          sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 25vw"
          className={cn(
            "object-contain p-8 transition duration-500 group-hover:scale-105 sm:p-10",
            !estaDisponible && "grayscale",
          )}
        />
        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          {destacado && <Badge variant="accent">Destacado</Badge>}
          <Badge variant={estaDisponible ? "success" : "error"}>
            {estaDisponible ? "Disponible" : "Sin stock"}
          </Badge>
        </div>
      </div>
      <CardContent className="grid gap-3">
        <div className="min-w-0">
          {banda && (
            <p className="mb-1 text-xs font-bold uppercase tracking-[0.14em] text-accent">
              {banda}
            </p>
          )}
          <h3 className="font-display text-xl font-bold uppercase leading-tight tracking-wide text-foreground">
            {nombre}
          </h3>
        </div>
        <p className="text-lg font-bold tabular-nums text-foreground">
          {precio}
        </p>
      </CardContent>
    </Card>
  );
}
