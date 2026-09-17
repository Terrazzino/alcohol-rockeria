import type { ReactNode } from "react";

import { NavegacionAdmin } from "@/components/admin/navegacion-admin";
import { exigirAdministradorActivo } from "@/features/autenticacion/sesion";

export const dynamic = "force-dynamic";

export default async function LayoutAdministracionProtegida({
  children,
}: Readonly<{ children: ReactNode }>) {
  const administrador = await exigirAdministradorActivo();

  return (
    <div className="min-h-svh bg-background-secondary lg:flex">
      <NavegacionAdmin administrador={administrador} />
      <main
        id="contenido-principal"
        className="min-w-0 flex-1 bg-background-secondary"
      >
        <div className="mx-auto w-full max-w-[96rem] px-4 py-7 sm:px-6 sm:py-9 lg:px-8 lg:py-10">
          {children}
        </div>
      </main>
    </div>
  );
}
