"use server";

import { Prisma } from "@/generated/prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import {
  actualizarVariante,
  cambiarDisponibilidadVariante,
  crearVariante,
  eliminarVariante,
  obtenerProductoParaVariantes,
  obtenerVariantePorId,
} from "@/data/variantes";
import {
  mapearErroresVariante,
  validarVariante,
  type ErroresVariante,
} from "@/domain/variantes";
import { exigirAdministradorActivo } from "@/features/autenticacion/sesion";

export interface EstadoFormularioVariante {
  mensaje?: string;
  errores?: ErroresVariante;
}

export interface EstadoAccionVariante {
  exito?: boolean;
  mensaje?: string;
}

const esquemaId = z.uuid();

function leerFormulario(formulario: FormData) {
  return {
    nombre: formulario.get("nombre"),
    sku: formulario.get("sku"),
    precioEspecifico: formulario.get("precioEspecifico"),
    estaDisponible: formulario.get("estaDisponible") === "on",
    orden: formulario.get("orden"),
  };
}

function esErrorPrisma(
  error: unknown,
): error is Prisma.PrismaClientKnownRequestError {
  return error instanceof Prisma.PrismaClientKnownRequestError;
}

function revalidarVariantes(productoId: string) {
  revalidatePath(`/admin/productos/${productoId}/variantes`);
  revalidatePath("/admin/productos");
  revalidatePath("/admin/variantes");
}

async function verificarContexto(
  productoId: string,
  varianteId?: string,
): Promise<EstadoFormularioVariante | null> {
  try {
    const producto = await obtenerProductoParaVariantes(productoId);
    if (!producto) return { mensaje: "El producto ya no existe." };

    if (varianteId) {
      const variante = await obtenerVariantePorId(productoId, varianteId);
      if (!variante) {
        return {
          mensaje: "La variante no existe o no pertenece al producto indicado.",
        };
      }
    }

    return null;
  } catch (error) {
    console.error("Error al verificar el contexto de la variante", error);
    return { mensaje: "No se pudo verificar el producto. Intentá nuevamente." };
  }
}

function errorFormulario(error: unknown): EstadoFormularioVariante {
  if (esErrorPrisma(error) && error.code === "P2002") {
    return {
      mensaje: "No se pudo guardar la variante.",
      errores: { sku: "Ya existe una variante con este SKU." },
    };
  }

  if (esErrorPrisma(error) && error.code === "P2003") {
    return { mensaje: "El producto ya no existe." };
  }

  if (esErrorPrisma(error) && error.code === "P2025") {
    return { mensaje: "La variante ya no existe." };
  }

  console.error("Error al guardar la variante", error);
  return { mensaje: "Ocurrió un error al guardar. Intentá nuevamente." };
}

export async function accionCrearVariante(
  productoId: string,
  _estadoAnterior: EstadoFormularioVariante,
  formulario: FormData,
): Promise<EstadoFormularioVariante> {
  await exigirAdministradorActivo();

  if (!esquemaId.safeParse(productoId).success) {
    return { mensaje: "El identificador del producto no es válido." };
  }

  const resultado = validarVariante(leerFormulario(formulario));
  if (!resultado.success) {
    return {
      mensaje: "Revisá los campos señalados.",
      errores: mapearErroresVariante(resultado.error),
    };
  }

  const errorContexto = await verificarContexto(productoId);
  if (errorContexto) return errorContexto;

  try {
    await crearVariante(productoId, resultado.data);
  } catch (error) {
    return errorFormulario(error);
  }

  revalidarVariantes(productoId);
  redirect(`/admin/productos/${productoId}/variantes?resultado=creada`);
}

export async function accionActualizarVariante(
  productoId: string,
  varianteId: string,
  _estadoAnterior: EstadoFormularioVariante,
  formulario: FormData,
): Promise<EstadoFormularioVariante> {
  await exigirAdministradorActivo();

  if (
    !esquemaId.safeParse(productoId).success ||
    !esquemaId.safeParse(varianteId).success
  ) {
    return { mensaje: "El identificador de la variante no es válido." };
  }

  const resultado = validarVariante(leerFormulario(formulario));
  if (!resultado.success) {
    return {
      mensaje: "Revisá los campos señalados.",
      errores: mapearErroresVariante(resultado.error),
    };
  }

  const errorContexto = await verificarContexto(productoId, varianteId);
  if (errorContexto) return errorContexto;

  try {
    await actualizarVariante(productoId, varianteId, resultado.data);
  } catch (error) {
    return errorFormulario(error);
  }

  revalidarVariantes(productoId);
  redirect(`/admin/productos/${productoId}/variantes?resultado=actualizada`);
}

export async function accionCambiarDisponibilidadVariante(
  productoId: string,
  varianteId: string,
  estaDisponible: boolean,
  estadoAnterior: EstadoAccionVariante,
): Promise<EstadoAccionVariante> {
  void estadoAnterior;
  await exigirAdministradorActivo();

  if (
    !esquemaId.safeParse(productoId).success ||
    !esquemaId.safeParse(varianteId).success
  ) {
    return { mensaje: "El identificador de la variante no es válido." };
  }

  const errorContexto = await verificarContexto(productoId, varianteId);
  if (errorContexto) return errorContexto;

  try {
    await cambiarDisponibilidadVariante(productoId, varianteId, estaDisponible);
    revalidarVariantes(productoId);
    return {
      exito: true,
      mensaje: estaDisponible
        ? "Variante disponible."
        : "Variante no disponible.",
    };
  } catch (error) {
    if (esErrorPrisma(error) && error.code === "P2025") {
      return { mensaje: "La variante ya no existe." };
    }

    console.error("Error al cambiar la disponibilidad de la variante", error);
    return { mensaje: "No se pudo cambiar la disponibilidad." };
  }
}

export async function accionEliminarVariante(
  productoId: string,
  varianteId: string,
  estadoAnterior: EstadoAccionVariante,
): Promise<EstadoAccionVariante> {
  void estadoAnterior;
  await exigirAdministradorActivo();

  if (
    !esquemaId.safeParse(productoId).success ||
    !esquemaId.safeParse(varianteId).success
  ) {
    return { mensaje: "El identificador de la variante no es válido." };
  }

  const errorContexto = await verificarContexto(productoId, varianteId);
  if (errorContexto) return errorContexto;

  try {
    await eliminarVariante(productoId, varianteId);
    revalidarVariantes(productoId);
    return { exito: true, mensaje: "Variante eliminada." };
  } catch (error) {
    if (esErrorPrisma(error) && error.code === "P2025") {
      return { mensaje: "La variante ya no existe." };
    }

    console.error("Error al eliminar la variante", error);
    return { mensaje: "No se pudo eliminar la variante." };
  }
}
