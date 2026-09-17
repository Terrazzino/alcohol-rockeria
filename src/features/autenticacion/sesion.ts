import "server-only";

import { redirect } from "next/navigation";
import { cache } from "react";

import { auth } from "@/auth";
import { buscarAdministradorActivoPorId } from "@/data/administradores";

export const obtenerAdministradorActual = cache(async () => {
  const sesion = await auth();
  const idAdministrador = sesion?.user?.id;

  if (!idAdministrador) {
    return null;
  }

  return buscarAdministradorActivoPorId(idAdministrador);
});

export async function exigirAdministradorActivo() {
  const administrador = await obtenerAdministradorActual();

  if (!administrador) {
    redirect("/admin/login");
  }

  return administrador;
}
