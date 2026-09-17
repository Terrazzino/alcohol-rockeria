import type { ReactNode } from "react";

import { exigirAdministradorActivo } from "@/features/autenticacion/sesion";

export const dynamic = "force-dynamic";

export default async function LayoutAdministracionProtegida({
  children,
}: Readonly<{ children: ReactNode }>) {
  await exigirAdministradorActivo();

  return children;
}
