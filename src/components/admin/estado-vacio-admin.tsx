import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

interface EstadoVacioAdminProps {
  titulo: string;
  descripcion: string;
  accion?: ReactNode;
  className?: string;
}

export function EstadoVacioAdmin({
  titulo,
  descripcion,
  accion,
  className,
}: EstadoVacioAdminProps) {
  return (
    <div
      className={cn(
        "flex min-h-72 flex-col items-center justify-center rounded-sm border border-dashed border-border-strong bg-surface/55 px-5 py-10 text-center",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="flex size-12 items-center justify-center rounded-full border border-accent/30 bg-accent-soft font-display text-xl font-bold text-accent"
      >
        AR
      </span>
      <h2 className="mt-5 font-display text-2xl font-bold uppercase tracking-wide text-foreground">
        {titulo}
      </h2>
      <p className="mt-3 max-w-md text-sm leading-6 text-foreground-secondary">
        {descripcion}
      </p>
      {accion ? <div className="mt-6">{accion}</div> : null}
    </div>
  );
}
