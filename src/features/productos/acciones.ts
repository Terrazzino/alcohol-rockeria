"use server";

import { Prisma } from "@/generated/prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import {
  actualizarProducto,
  cambiarDestacadoProducto,
  cambiarEstadoProducto,
  crearProducto,
  eliminarProducto,
  verificarReferenciasProducto,
} from "@/data/productos";
import {
  ESTADOS_PRODUCTO,
  mapearErroresProducto,
  validarProducto,
  type ErroresProducto,
} from "@/domain/productos";
import { exigirAdministradorActivo } from "@/features/autenticacion/sesion";

export interface EstadoFormularioProducto {
  mensaje?: string;
  errores?: ErroresProducto;
}

export interface EstadoAccionProducto {
  exito?: boolean;
  mensaje?: string;
}

const esquemaId = z.uuid();
const esquemaEstado = z.enum(ESTADOS_PRODUCTO);

function leerFormulario(formulario: FormData) {
  return {
    nombre: formulario.get("nombre"),
    slug: formulario.get("slug"),
    descripcion: formulario.get("descripcion"),
    precioBase: formulario.get("precioBase"),
    categoriaId: formulario.get("categoriaId"),
    bandaId: formulario.get("bandaId"),
    estado: formulario.get("estado"),
    destacado: formulario.get("destacado") === "on",
    orden: formulario.get("orden"),
  };
}

function esErrorPrisma(
  error: unknown,
): error is Prisma.PrismaClientKnownRequestError {
  return error instanceof Prisma.PrismaClientKnownRequestError;
}

function errorFormulario(error: unknown): EstadoFormularioProducto {
  if (esErrorPrisma(error) && error.code === "P2002") {
    return {
      mensaje: "No se pudo guardar el producto.",
      errores: { slug: "Ya existe un producto con este slug." },
    };
  }

  if (esErrorPrisma(error) && error.code === "P2003") {
    return {
      mensaje:
        "La categoría o banda seleccionada ya no existe. Actualizá la página e intentá nuevamente.",
    };
  }

  if (esErrorPrisma(error) && error.code === "P2025") {
    return { mensaje: "El producto ya no existe." };
  }

  console.error("Error al guardar el producto", error);
  return { mensaje: "Ocurrió un error al guardar. Intentá nuevamente." };
}

async function validarReferencias(
  categoriaId: string,
  bandaId: string | null,
): Promise<EstadoFormularioProducto | null> {
  let referencias: Awaited<ReturnType<typeof verificarReferenciasProducto>>;

  try {
    referencias = await verificarReferenciasProducto(categoriaId, bandaId);
  } catch (error) {
    console.error("Error al validar las relaciones del producto", error);
    return {
      mensaje: "No se pudieron validar las relaciones. Intentá nuevamente.",
    };
  }

  const errores: ErroresProducto = {};

  if (!referencias.categoriaExiste) {
    errores.categoriaId = "La categoría seleccionada ya no existe.";
  }

  if (!referencias.bandaExiste) {
    errores.bandaId = "La banda seleccionada ya no existe.";
  }

  return Object.keys(errores).length > 0
    ? { mensaje: "Revisá las relaciones seleccionadas.", errores }
    : null;
}

export async function accionCrearProducto(
  _estadoAnterior: EstadoFormularioProducto,
  formulario: FormData,
): Promise<EstadoFormularioProducto> {
  await exigirAdministradorActivo();
  const resultado = validarProducto(leerFormulario(formulario));

  if (!resultado.success) {
    return {
      mensaje: "Revisá los campos señalados.",
      errores: mapearErroresProducto(resultado.error),
    };
  }

  const errorReferencias = await validarReferencias(
    resultado.data.categoriaId,
    resultado.data.bandaId,
  );
  if (errorReferencias) return errorReferencias;

  try {
    await crearProducto(resultado.data);
  } catch (error) {
    return errorFormulario(error);
  }

  revalidatePath("/admin/productos");
  redirect("/admin/productos?resultado=creado");
}

export async function accionActualizarProducto(
  id: string,
  _estadoAnterior: EstadoFormularioProducto,
  formulario: FormData,
): Promise<EstadoFormularioProducto> {
  await exigirAdministradorActivo();

  if (!esquemaId.safeParse(id).success) {
    return { mensaje: "El identificador del producto no es válido." };
  }

  const resultado = validarProducto(leerFormulario(formulario));
  if (!resultado.success) {
    return {
      mensaje: "Revisá los campos señalados.",
      errores: mapearErroresProducto(resultado.error),
    };
  }

  const errorReferencias = await validarReferencias(
    resultado.data.categoriaId,
    resultado.data.bandaId,
  );
  if (errorReferencias) return errorReferencias;

  try {
    await actualizarProducto(id, resultado.data);
  } catch (error) {
    return errorFormulario(error);
  }

  revalidatePath("/admin/productos");
  redirect("/admin/productos?resultado=actualizado");
}

export async function accionCambiarEstadoProducto(
  id: string,
  estadoAnterior: EstadoAccionProducto,
  formulario: FormData,
): Promise<EstadoAccionProducto> {
  void estadoAnterior;
  await exigirAdministradorActivo();

  if (!esquemaId.safeParse(id).success) {
    return { mensaje: "El identificador del producto no es válido." };
  }

  const resultadoEstado = esquemaEstado.safeParse(formulario.get("estado"));
  if (!resultadoEstado.success) {
    return { mensaje: "Seleccioná un estado válido." };
  }

  try {
    await cambiarEstadoProducto(id, resultadoEstado.data);
    revalidatePath("/admin/productos");
    return { exito: true, mensaje: "Estado actualizado." };
  } catch (error) {
    if (esErrorPrisma(error) && error.code === "P2025") {
      return { mensaje: "El producto ya no existe." };
    }

    console.error("Error al cambiar el estado del producto", error);
    return { mensaje: "No se pudo cambiar el estado." };
  }
}

export async function accionCambiarDestacadoProducto(
  id: string,
  destacado: boolean,
  estadoAnterior: EstadoAccionProducto,
): Promise<EstadoAccionProducto> {
  void estadoAnterior;
  await exigirAdministradorActivo();

  if (!esquemaId.safeParse(id).success) {
    return { mensaje: "El identificador del producto no es válido." };
  }

  try {
    await cambiarDestacadoProducto(id, destacado);
    revalidatePath("/admin/productos");
    return {
      exito: true,
      mensaje: destacado ? "Producto destacado." : "Destacado quitado.",
    };
  } catch (error) {
    if (esErrorPrisma(error) && error.code === "P2025") {
      return { mensaje: "El producto ya no existe." };
    }

    console.error("Error al cambiar el destacado del producto", error);
    return { mensaje: "No se pudo cambiar el destacado." };
  }
}

export async function accionEliminarProducto(
  id: string,
  estadoAnterior: EstadoAccionProducto,
): Promise<EstadoAccionProducto> {
  void estadoAnterior;
  await exigirAdministradorActivo();

  if (!esquemaId.safeParse(id).success) {
    return { mensaje: "El identificador del producto no es válido." };
  }

  try {
    await eliminarProducto(id);
    revalidatePath("/admin/productos");
    return { exito: true, mensaje: "Producto eliminado." };
  } catch (error) {
    if (esErrorPrisma(error) && error.code === "P2025") {
      return { mensaje: "El producto ya no existe." };
    }

    console.error("Error al eliminar el producto", error);
    return { mensaje: "No se pudo eliminar el producto." };
  }
}
