import type { ReactNode } from "react";

interface ContenedorFormularioAdminProps {
  titulo: string;
  descripcion?: string;
  children: ReactNode;
  acciones: ReactNode;
}

export function ContenedorFormularioAdmin({
  titulo,
  descripcion,
  children,
  acciones,
}: ContenedorFormularioAdminProps) {
  return (
    <section className="rounded-sm border border-border bg-surface shadow-card">
      <header className="border-b border-border p-5 sm:p-6">
        <h2 className="font-display text-2xl font-bold uppercase tracking-wide text-foreground">
          {titulo}
        </h2>
        {descripcion ? (
          <p className="mt-2 max-w-2xl text-sm leading-6 text-foreground-secondary">
            {descripcion}
          </p>
        ) : null}
      </header>
      <div className="grid gap-5 p-5 sm:p-6">{children}</div>
      <footer className="flex flex-col-reverse gap-3 border-t border-border p-5 sm:flex-row sm:justify-end sm:p-6">
        {acciones}
      </footer>
    </section>
  );
}
