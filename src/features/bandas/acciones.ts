"use server";

import { Prisma } from "@/generated/prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import {
  actualizarBanda,
  cambiarVisibilidadBanda,
  crearBanda,
  eliminarBanda,
} from "@/data/bandas";
import {
  mapearErroresBanda,
  validarBanda,
  type ErroresBanda,
} from "@/domain/bandas";
import { exigirAdministradorActivo } from "@/features/autenticacion/sesion";

export interface EstadoFormularioBanda {
  mensaje?: string;
  errores?: ErroresBanda;
}

export interface EstadoAccionBanda {
  exito?: boolean;
  mensaje?: string;
}

const esquemaId = z.uuid();

function leerFormulario(formulario: FormData) {
  return {
    nombre: formulario.get("nombre"),
    slug: formulario.get("slug"),
    descripcion: formulario.get("descripcion"),
    urlImagen: formulario.get("urlImagen"),
    orden: formulario.get("orden"),
    estaVisible: formulario.get("estaVisible") === "on",
  };
}

function esErrorPrisma(
  error: unknown,
): error is Prisma.PrismaClientKnownRequestError {
  return error instanceof Prisma.PrismaClientKnownRequestError;
}

function errorFormulario(error: unknown): EstadoFormularioBanda {
  if (esErrorPrisma(error) && error.code === "P2002") {
    return {
      mensaje: "No se pudo guardar la banda.",
      errores: { slug: "Ya existe una banda con este slug." },
    };
  }

  if (esErrorPrisma(error) && error.code === "P2025") {
    return { mensaje: "La banda ya no existe." };
  }

  console.error("Error al guardar la banda", error);
  return { mensaje: "Ocurrió un error al guardar. Intentá nuevamente." };
}

export async function accionCrearBanda(
  _estadoAnterior: EstadoFormularioBanda,
  formulario: FormData,
): Promise<EstadoFormularioBanda> {
  await exigirAdministradorActivo();
  const resultado = validarBanda(leerFormulario(formulario));

  if (!resultado.success) {
    return {
      mensaje: "Revisá los campos señalados.",
      errores: mapearErroresBanda(resultado.error),
    };
  }

  try {
    await crearBanda(resultado.data);
  } catch (error) {
    return errorFormulario(error);
  }

  revalidatePath("/admin/bandas");
  redirect("/admin/bandas?resultado=creada");
}

export async function accionActualizarBanda(
  id: string,
  _estadoAnterior: EstadoFormularioBanda,
  formulario: FormData,
): Promise<EstadoFormularioBanda> {
  await exigirAdministradorActivo();

  if (!esquemaId.safeParse(id).success) {
    return { mensaje: "El identificador de la banda no es válido." };
  }

  const resultado = validarBanda(leerFormulario(formulario));

  if (!resultado.success) {
    return {
      mensaje: "Revisá los campos señalados.",
      errores: mapearErroresBanda(resultado.error),
    };
  }

  try {
    await actualizarBanda(id, resultado.data);
  } catch (error) {
    return errorFormulario(error);
  }

  revalidatePath("/admin/bandas");
  redirect("/admin/bandas?resultado=actualizada");
}

export async function accionCambiarVisibilidadBanda(
  id: string,
  estaVisible: boolean,
  estadoAnterior: EstadoAccionBanda,
): Promise<EstadoAccionBanda> {
  void estadoAnterior;
  await exigirAdministradorActivo();

  if (!esquemaId.safeParse(id).success) {
    return { mensaje: "El identificador de la banda no es válido." };
  }

  try {
    await cambiarVisibilidadBanda(id, estaVisible);
    revalidatePath("/admin/bandas");
    return {
      exito: true,
      mensaje: estaVisible ? "Banda visible." : "Banda oculta.",
    };
  } catch (error) {
    if (esErrorPrisma(error) && error.code === "P2025") {
      return { mensaje: "La banda ya no existe." };
    }

    console.error("Error al cambiar la visibilidad de la banda", error);
    return { mensaje: "No se pudo cambiar la visibilidad." };
  }
}

export async function accionEliminarBanda(
  id: string,
  estadoAnterior: EstadoAccionBanda,
): Promise<EstadoAccionBanda> {
  void estadoAnterior;
  await exigirAdministradorActivo();

  if (!esquemaId.safeParse(id).success) {
    return { mensaje: "El identificador de la banda no es válido." };
  }

  try {
    await eliminarBanda(id);
    revalidatePath("/admin/bandas");
    return { exito: true, mensaje: "Banda eliminada." };
  } catch (error) {
    if (esErrorPrisma(error) && error.code === "P2025") {
      return { mensaje: "La banda ya no existe." };
    }

    console.error("Error al eliminar la banda", error);
    return { mensaje: "No se pudo eliminar la banda." };
  }
}
