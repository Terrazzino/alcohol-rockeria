import "server-only";

import { compare } from "bcryptjs";

import { buscarAdministradorParaAcceso } from "@/data/administradores";
import { validarCredenciales } from "@/features/autenticacion/validaciones";

const HASH_FICTICIO =
  "$2b$12$/JaE8wF5P1XdqdrAmig3B.qj0LqLsBK5O1x1LRMM5OMqs29PWTXAa";

export async function autenticarAdministrador(entrada: unknown) {
  const resultado = validarCredenciales(entrada);

  if (!resultado.exito) {
    return null;
  }

  const administrador = await buscarAdministradorParaAcceso(
    resultado.datos.correo,
  );
  const hash = administrador?.hashContrasena ?? HASH_FICTICIO;
  const contrasenaValida = await compare(resultado.datos.contrasena, hash);

  if (!administrador || !administrador.activo || !contrasenaValida) {
    return null;
  }

  return {
    id: administrador.id,
    email: administrador.correo,
    name: administrador.nombre,
  };
}
