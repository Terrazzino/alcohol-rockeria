import Link from "next/link";

import { BadgeEstadoAdmin } from "@/components/admin/badge-estado-admin";
import { IconoAdmin } from "@/components/admin/icono-admin";
import type { NombreIconoAdmin } from "@/features/admin/navegacion-admin";

interface TarjetaResumenAdminProps {
  titulo: string;
  descripcion: string;
  href: string;
  icono: NombreIconoAdmin;
}

export function TarjetaResumenAdmin({
  titulo,
  descripcion,
  href,
  icono,
}: TarjetaResumenAdminProps) {
  return (
    <Link
      href={href}
      className="group flex min-h-48 flex-col rounded-sm border border-border bg-surface p-5 shadow-card transition duration-200 hover:-translate-y-0.5 hover:border-border-strong hover:bg-surface-raised focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
    >
      <div className="flex items-start justify-between gap-4">
        <span className="flex size-11 items-center justify-center rounded-sm border border-accent/30 bg-accent-soft text-accent">
          <IconoAdmin nombre={icono} className="size-6" />
        </span>
        <BadgeEstadoAdmin estado="proximamente" />
      </div>
      <div className="mt-auto pt-7">
        <h2 className="font-display text-2xl font-bold uppercase tracking-wide text-foreground group-hover:text-accent">
          {titulo}
        </h2>
        <p className="mt-2 text-sm leading-6 text-foreground-secondary">
          {descripcion}
        </p>
      </div>
    </Link>
  );
}
