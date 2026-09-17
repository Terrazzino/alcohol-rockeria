import "server-only";

import { clientePrisma } from "@/lib/prisma";

export function buscarAdministradorParaAcceso(correo: string) {
  return clientePrisma.administrador.findUnique({
    where: { correo },
    select: {
      id: true,
      correo: true,
      hashContrasena: true,
      nombre: true,
      activo: true,
    },
  });
}

export function buscarAdministradorActivoPorId(id: string) {
  return clientePrisma.administrador.findFirst({
    where: { id, activo: true },
    select: {
      id: true,
      correo: true,
      nombre: true,
    },
  });
}
