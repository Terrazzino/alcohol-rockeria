import type { ComponentProps } from "react";

import { cn } from "@/lib/cn";

type BadgeVariant = "accent" | "neutral" | "success" | "error";

const variantClasses: Record<BadgeVariant, string> = {
  accent: "border-accent/40 bg-accent-soft text-accent",
  neutral: "border-border bg-surface-raised text-foreground-secondary",
  success: "border-success/40 bg-success-soft text-success",
  error: "border-error/40 bg-error-soft text-error-light",
};

export interface BadgeProps extends ComponentProps<"span"> {
  variant?: BadgeVariant;
}

export function Badge({
  className,
  variant = "neutral",
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex min-h-6 items-center rounded-full border px-2.5 py-1 text-[0.6875rem] font-bold uppercase leading-none tracking-[0.12em]",
        variantClasses[variant],
        className,
      )}
      {...props}
    />
  );
}
