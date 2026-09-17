import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

interface BarraAccionesAdminProps {
  accionPrincipal?: ReactNode;
  filtros?: ReactNode;
  className?: string;
}

export function BarraAccionesAdmin({
  accionPrincipal,
  filtros,
  className,
}: BarraAccionesAdminProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-sm border border-border bg-surface p-3 sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
    >
      <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row">
        <label className="min-w-0 flex-1">
          <span className="sr-only">Buscar en la sección</span>
          <input
            type="search"
            disabled
            placeholder="Búsqueda disponible próximamente"
            className="min-h-11 w-full rounded-sm border border-border bg-background-secondary px-3.5 text-base text-muted placeholder:text-muted focus:outline-2 focus:outline-offset-2 focus:outline-accent disabled:cursor-not-allowed disabled:opacity-70"
          />
        </label>
        {filtros}
      </div>
      {accionPrincipal ? (
        <div className="shrink-0">{accionPrincipal}</div>
      ) : null}
    </div>
  );
}
