import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/lib/cn";
import { Container } from "@/components/ui/container";

interface SectionProps extends ComponentProps<"section"> {
  eyebrow?: string;
  title?: string;
  description?: string;
  action?: ReactNode;
  contentClassName?: string;
}

export function Section({
  action,
  children,
  className,
  contentClassName,
  description,
  eyebrow,
  title,
  ...props
}: SectionProps) {
  return (
    <section className={cn("py-14 sm:py-18 lg:py-24", className)} {...props}>
      <Container className={contentClassName}>
        {(eyebrow || title || description || action) && (
          <div className="mb-8 flex flex-col gap-5 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              {eyebrow && <p className="eyebrow">{eyebrow}</p>}
              {title && (
                <h2 className="mt-2 font-display text-3xl font-bold uppercase leading-none tracking-[0.025em] text-foreground sm:text-4xl lg:text-5xl">
                  {title}
                </h2>
              )}
              {description && (
                <p className="mt-4 max-w-xl text-base leading-7 text-foreground-secondary">
                  {description}
                </p>
              )}
            </div>
            {action}
          </div>
        )}
        {children}
      </Container>
    </section>
  );
}
