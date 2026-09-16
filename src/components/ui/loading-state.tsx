interface LoadingStateProps {
  label?: string;
}

export function LoadingState({
  label = "Cargando contenido",
}: LoadingStateProps) {
  return (
    <div
      className="flex min-h-40 items-center justify-center gap-3 rounded-sm border border-border bg-surface px-5 py-8 text-sm font-semibold text-foreground-secondary"
      role="status"
    >
      <span
        aria-hidden="true"
        className="size-5 animate-spin rounded-full border-2 border-border-strong border-t-accent motion-reduce:animate-none"
      />
      {label}
    </div>
  );
}
