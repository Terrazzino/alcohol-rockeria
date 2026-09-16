import type { SelectHTMLAttributes } from "react";

import { cn } from "@/lib/cn";

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  id: string;
  label: string;
  hint?: string;
  error?: string;
}

export function Select({
  children,
  className,
  error,
  hint,
  id,
  label,
  ...props
}: SelectProps) {
  const descriptionId = error ? `${id}-error` : hint ? `${id}-hint` : undefined;

  return (
    <div className="grid gap-2">
      <label className="text-sm font-semibold text-foreground" htmlFor={id}>
        {label}
      </label>
      <select
        id={id}
        aria-describedby={descriptionId}
        aria-invalid={Boolean(error)}
        className={cn(
          "min-h-11 w-full rounded-sm border border-border bg-surface px-3.5 text-base text-foreground transition-colors focus:border-accent focus:outline-2 focus:outline-offset-2 focus:outline-accent disabled:cursor-not-allowed disabled:opacity-50",
          error && "border-error",
          className,
        )}
        {...props}
      >
        {children}
      </select>
      {error ? (
        <p id={descriptionId} className="text-sm text-error">
          {error}
        </p>
      ) : hint ? (
        <p id={descriptionId} className="text-sm text-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
