import type { ReactNode } from "react";

interface ErrorStateProps {
  title?: string;
  description?: string;
  action?: ReactNode;
}

export function ErrorState({
  action,
  description = "No pudimos cargar el contenido. Intentá nuevamente.",
  title = "Algo salió mal",
}: ErrorStateProps) {
  return (
    <div
      className="rounded-sm border border-error/50 bg-error-soft px-5 py-6"
      role="alert"
    >
      <p className="font-display text-xl font-bold uppercase tracking-wide text-error-light">
        {title}
      </p>
      <p className="mt-2 text-sm leading-6 text-foreground-secondary">
        {description}
      </p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
