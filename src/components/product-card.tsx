import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/cn";

export type ProductCardStatus = "available" | "out-of-stock";

export interface ProductCardProps {
  name: string;
  band?: string;
  price: string;
  imageSrc: string;
  imageAlt: string;
  status: ProductCardStatus;
  featured?: boolean;
  artworkTone?: "gold" | "charcoal" | "cream";
}

const toneClasses = {
  gold: "from-accent/25 via-surface-raised to-background-secondary",
  charcoal: "from-border via-surface to-background",
  cream: "from-[#584c27] via-surface-raised to-background-secondary",
} as const;

export function ProductCard({
  artworkTone = "charcoal",
  band,
  featured = false,
  imageAlt,
  imageSrc,
  name,
  price,
  status,
}: ProductCardProps) {
  const isAvailable = status === "available";

  return (
    <Card className="group min-w-0 overflow-hidden transition duration-300 hover:-translate-y-1 hover:border-border-strong hover:shadow-elevated">
      <div
        className={cn(
          "relative aspect-[4/5] overflow-hidden bg-gradient-to-br",
          toneClasses[artworkTone],
        )}
      >
        <div className="absolute inset-0 bg-grain opacity-30" />
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 25vw"
          className={cn(
            "object-contain p-8 transition duration-500 group-hover:scale-105 sm:p-10",
            !isAvailable && "grayscale",
          )}
        />
        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          {featured && <Badge variant="accent">Destacado</Badge>}
          <Badge variant={isAvailable ? "success" : "error"}>
            {isAvailable ? "Disponible" : "Sin stock"}
          </Badge>
        </div>
      </div>
      <CardContent className="grid gap-3">
        <div className="min-w-0">
          {band && (
            <p className="mb-1 text-xs font-bold uppercase tracking-[0.14em] text-accent">
              {band}
            </p>
          )}
          <h3 className="font-display text-xl font-bold uppercase leading-tight tracking-wide text-foreground">
            {name}
          </h3>
        </div>
        <p className="text-lg font-bold tabular-nums text-foreground">
          {price}
        </p>
      </CardContent>
    </Card>
  );
}
