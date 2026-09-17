"use server";

import { Prisma } from "@/generated/prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import {
  actualizarCategoria,
  cambiarVisibilidadCategoria,
  crearCategoria,
  eliminarCategoria,
} from "@/data/categorias";
import {
  mapearErroresCategoria,
  validarCategoria,
  type ErroresCategoria,
} from "@/domain/categorias";
import { exigirAdministradorActivo } from "@/features/autenticacion/sesion";

export interface EstadoFormularioCategoria {
  mensaje?: string;
  errores?: ErroresCategoria;
}

export interface EstadoAccionCategoria {
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

function errorFormulario(error: unknown): EstadoFormularioCategoria {
  if (esErrorPrisma(error) && error.code === "P2002") {
    return {
      mensaje: "No se pudo guardar la categoría.",
      errores: { slug: "Ya existe una categoría con este slug." },
    };
  }

  if (esErrorPrisma(error) && error.code === "P2025") {
    return { mensaje: "La categoría ya no existe." };
  }

  console.error("Error al guardar la categoría", error);
  return { mensaje: "Ocurrió un error al guardar. Intentá nuevamente." };
}

export async function accionCrearCategoria(
  _estadoAnterior: EstadoFormularioCategoria,
  formulario: FormData,
): Promise<EstadoFormularioCategoria> {
  await exigirAdministradorActivo();
  const resultado = validarCategoria(leerFormulario(formulario));

  if (!resultado.success) {
    return {
      mensaje: "Revisá los campos señalados.",
      errores: mapearErroresCategoria(resultado.error),
    };
  }

  try {
    await crearCategoria(resultado.data);
  } catch (error) {
    return errorFormulario(error);
  }

  revalidatePath("/admin/categorias");
  redirect("/admin/categorias?resultado=creada");
}

export async function accionActualizarCategoria(
  id: string,
  _estadoAnterior: EstadoFormularioCategoria,
  formulario: FormData,
): Promise<EstadoFormularioCategoria> {
  await exigirAdministradorActivo();

  if (!esquemaId.safeParse(id).success) {
    return { mensaje: "El identificador de la categoría no es válido." };
  }

  const resultado = validarCategoria(leerFormulario(formulario));

  if (!resultado.success) {
    return {
      mensaje: "Revisá los campos señalados.",
      errores: mapearErroresCategoria(resultado.error),
    };
  }

  try {
    await actualizarCategoria(id, resultado.data);
  } catch (error) {
    return errorFormulario(error);
  }

  revalidatePath("/admin/categorias");
  redirect("/admin/categorias?resultado=actualizada");
}

export async function accionCambiarVisibilidadCategoria(
  id: string,
  estaVisible: boolean,
  estadoAnterior: EstadoAccionCategoria,
): Promise<EstadoAccionCategoria> {
  void estadoAnterior;
  await exigirAdministradorActivo();

  if (!esquemaId.safeParse(id).success) {
    return { mensaje: "El identificador de la categoría no es válido." };
  }

  try {
    await cambiarVisibilidadCategoria(id, estaVisible);
    revalidatePath("/admin/categorias");
    return {
      exito: true,
      mensaje: estaVisible ? "Categoría visible." : "Categoría oculta.",
    };
  } catch (error) {
    if (esErrorPrisma(error) && error.code === "P2025") {
      return { mensaje: "La categoría ya no existe." };
    }

    console.error("Error al cambiar la visibilidad de la categoría", error);
    return { mensaje: "No se pudo cambiar la visibilidad." };
  }
}

export async function accionEliminarCategoria(
  id: string,
  estadoAnterior: EstadoAccionCategoria,
): Promise<EstadoAccionCategoria> {
  void estadoAnterior;
  await exigirAdministradorActivo();

  if (!esquemaId.safeParse(id).success) {
    return { mensaje: "El identificador de la categoría no es válido." };
  }

  try {
    await eliminarCategoria(id);
    revalidatePath("/admin/categorias");
    return { exito: true, mensaje: "Categoría eliminada." };
  } catch (error) {
    if (esErrorPrisma(error) && error.code === "P2003") {
      return {
        mensaje:
          "No se puede eliminar la categoría porque tiene productos asociados.",
      };
    }

    if (esErrorPrisma(error) && error.code === "P2025") {
      return { mensaje: "La categoría ya no existe." };
    }

    console.error("Error al eliminar la categoría", error);
    return { mensaje: "No se pudo eliminar la categoría." };
  }
}
