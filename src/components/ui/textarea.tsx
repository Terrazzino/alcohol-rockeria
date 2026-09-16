import type { TextareaHTMLAttributes } from "react";

import { cn } from "@/lib/cn";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  id: string;
  label: string;
  hint?: string;
  error?: string;
}

export function Textarea({
  className,
  error,
  hint,
  id,
  label,
  ...props
}: TextareaProps) {
  const descriptionId = error ? `${id}-error` : hint ? `${id}-hint` : undefined;

  return (
    <div className="grid gap-2">
      <label className="text-sm font-semibold text-foreground" htmlFor={id}>
        {label}
      </label>
      <textarea
        id={id}
        aria-describedby={descriptionId}
        aria-invalid={Boolean(error)}
        className={cn(
          "min-h-28 w-full resize-y rounded-sm border border-border bg-surface px-3.5 py-3 text-base text-foreground placeholder:text-muted transition-colors focus:border-accent focus:outline-2 focus:outline-offset-2 focus:outline-accent disabled:cursor-not-allowed disabled:opacity-50",
          error && "border-error",
          className,
        )}
        {...props}
      />
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
