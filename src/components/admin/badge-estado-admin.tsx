import type { ComponentProps } from "react";

import { Badge } from "@/components/ui/badge";

type EstadoAdmin = "activo" | "inactivo" | "error";

const configuracionEstado: Record<
  EstadoAdmin,
  { texto: string; variante: ComponentProps<typeof Badge>["variant"] }
> = {
  activo: { texto: "Activo", variante: "success" },
  inactivo: { texto: "Inactivo", variante: "neutral" },
  error: { texto: "Revisar", variante: "error" },
};

interface BadgeEstadoAdminProps {
  estado: EstadoAdmin;
}

export function BadgeEstadoAdmin({ estado }: BadgeEstadoAdminProps) {
  const configuracion = configuracionEstado[estado];

  return <Badge variant={configuracion.variante}>{configuracion.texto}</Badge>;
}
