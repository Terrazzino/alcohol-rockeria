import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

interface EncabezadoPaginaAdminProps {
  titulo: string;
  descripcion: string;
  etiqueta?: string;
  acciones?: ReactNode;
  className?: string;
}

export function EncabezadoPaginaAdmin({
  titulo,
  descripcion,
  etiqueta = "Administración",
  acciones,
  className,
}: EncabezadoPaginaAdminProps) {
  return (
    <header
      className={cn(
        "flex flex-col gap-5 border-b border-border pb-7 sm:flex-row sm:items-end sm:justify-between",
        className,
      )}
    >
      <div className="min-w-0 max-w-3xl">
        <p className="eyebrow">{etiqueta}</p>
        <h1 className="mt-3 font-display text-4xl font-bold uppercase leading-[0.95] tracking-wide text-foreground sm:text-5xl">
          {titulo}
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-foreground-secondary sm:text-base sm:leading-7">
          {descripcion}
        </p>
      </div>
      {acciones ? <div className="shrink-0">{acciones}</div> : null}
    </header>
  );
}
