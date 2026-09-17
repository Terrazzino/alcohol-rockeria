import type { SVGProps } from "react";

import type { NombreIconoAdmin } from "@/features/admin/navegacion-admin";

const trazos: Record<NombreIconoAdmin, React.ReactNode> = {
  dashboard: <path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z" />,
  categorias: <path d="m4 7 8-4 8 4-8 4zM4 12l8 4 8-4M4 17l8 4 8-4" />,
  bandas: (
    <path d="M9 18V5l10-2v13M9 9l10-2M6 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm10-2a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
  ),
  productos: <path d="M5 7h14l-1 14H6zM9 7a3 3 0 0 1 6 0" />,
  variantes: <path d="M4 7h10M18 7h2M14 4v6M4 17h2M10 17h10M7 14v6" />,
  imagenes: (
    <path d="M4 5h16v14H4zM8 11a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm-4 6 5-5 3 3 2-2 6 6" />
  ),
  precios: (
    <path d="M12 3v18M16 7.5c0-1.4-1.8-2.5-4-2.5S8 6.1 8 7.5s1.8 2.5 4 2.5 4 1.1 4 2.5-1.8 2.5-4 2.5-4-1.1-4-2.5" />
  ),
  configuracion: (
    <path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm7.4-3.5a7.5 7.5 0 0 0-.1-1l2-1.6-2-3.4-2.5 1a8 8 0 0 0-1.7-1L14.7 3h-4l-.4 3a8 8 0 0 0-1.7 1L6.1 6 4 9.4 6.1 11a7.5 7.5 0 0 0 0 2L4 14.6 6.1 18l2.5-1a8 8 0 0 0 1.7 1l.4 3h4l.4-3a8 8 0 0 0 1.7-1l2.5 1 2-3.4-2-1.6a7.5 7.5 0 0 0 .1-1Z" />
  ),
};

export interface IconoAdminProps extends SVGProps<SVGSVGElement> {
  nombre: NombreIconoAdmin;
}

export function IconoAdmin({ nombre, ...props }: IconoAdminProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {trazos[nombre]}
    </svg>
  );
}
