import type { ReactNode } from "react";

interface EmptyStateProps {
  title?: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({
  action,
  description = "Todavía no hay contenido para mostrar.",
  title = "Sin resultados",
}: EmptyStateProps) {
  return (
    <div className="flex min-h-56 flex-col items-center justify-center rounded-sm border border-dashed border-border-strong bg-surface/70 px-5 py-10 text-center">
      <span
        aria-hidden="true"
        className="mb-4 grid size-11 place-items-center rounded-full border border-border bg-surface-raised text-xl text-accent"
      >
        —
      </span>
      <h3 className="font-display text-xl font-bold uppercase tracking-wide text-foreground">
        {title}
      </h3>
      <p className="mt-2 max-w-sm text-sm leading-6 text-foreground-secondary">
        {description}
      </p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
