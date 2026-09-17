"use server";

import { AuthError } from "next-auth";

import { signIn, signOut } from "@/auth";
import {
  type ErroresCredenciales,
  validarCredenciales,
} from "@/features/autenticacion/validaciones";

export interface EstadoInicioSesion {
  mensaje?: string;
  errores?: ErroresCredenciales;
}

export async function iniciarSesion(
  _estadoAnterior: EstadoInicioSesion,
  formulario: FormData,
): Promise<EstadoInicioSesion> {
  const entrada = {
    correo: formulario.get("correo"),
    contrasena: formulario.get("contrasena"),
  };
  const resultado = validarCredenciales(entrada);

  if (!resultado.exito) {
    return { errores: resultado.errores };
  }

  try {
    await signIn("credentials", {
      ...resultado.datos,
      redirectTo: "/admin",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { mensaje: "Correo o contraseña incorrectos." };
    }

    throw error;
  }

  return {};
}

export async function cerrarSesion() {
  await signOut({ redirectTo: "/admin/login" });
}
