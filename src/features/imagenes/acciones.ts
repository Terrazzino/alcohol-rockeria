"use server";

import { Prisma } from "@/generated/prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import {
  actualizarImagen,
  crearImagen,
  definirImagenPrincipal,
  eliminarImagen,
  obtenerImagenPorId,
  obtenerProductoParaImagenes,
} from "@/data/imagenes";
import {
  mapearErroresImagen,
  validarArchivoImagen,
  validarDatosImagen,
  type ErroresImagen,
} from "@/domain/imagenes";
import { exigirAdministradorActivo } from "@/features/autenticacion/sesion";
import {
  eliminarImagenAlmacenada,
  subirImagenProducto,
} from "@/lib/almacenamiento-imagenes";

export interface EstadoFormularioImagen {
  mensaje?: string;
  errores?: ErroresImagen;
}

export interface EstadoAccionImagen {
  exito?: boolean;
  mensaje?: string;
}

const esquemaId = z.uuid();

function leerDatos(formulario: FormData) {
  return {
    textoAlternativo: formulario.get("textoAlternativo"),
    orden: formulario.get("orden"),
    esPrincipal: formulario.get("esPrincipal") === "on",
  };
}

function esErrorPrisma(
  error: unknown,
): error is Prisma.PrismaClientKnownRequestError {
  return error instanceof Prisma.PrismaClientKnownRequestError;
}

function revalidarImagenes(productoId: string) {
  revalidatePath(`/admin/productos/${productoId}/imagenes`);
  revalidatePath("/admin/imagenes");
  revalidatePath("/admin/productos");
}

async function verificarContexto(productoId: string, imagenId?: string) {
  const producto = await obtenerProductoParaImagenes(productoId);
  if (!producto) return "El producto ya no existe.";

  if (imagenId) {
    const imagen = await obtenerImagenPorId(productoId, imagenId);
    if (!imagen) return "La imagen no existe o no pertenece al producto.";
  }

  return null;
}

function mensajeErrorPersistencia(error: unknown) {
  if (esErrorPrisma(error) && error.code === "P2002") {
    return "No se pudo guardar la imagen porque la referencia ya existe.";
  }
  if (esErrorPrisma(error) && error.code === "P2003") {
    return "El producto ya no existe.";
  }
  if (esErrorPrisma(error) && error.code === "P2025") {
    return "La imagen ya no existe.";
  }

  console.error("Error al persistir la imagen", error);
  return "No se pudo guardar la imagen. Intentá nuevamente.";
}

export async function accionSubirImagen(
  productoId: string,
  _estadoAnterior: EstadoFormularioImagen,
  formulario: FormData,
): Promise<EstadoFormularioImagen> {
  await exigirAdministradorActivo();

  if (!esquemaId.safeParse(productoId).success) {
    return { mensaje: "El identificador del producto no es válido." };
  }

  const resultadoDatos = validarDatosImagen(leerDatos(formulario));
  const archivo = formulario.get("archivo");
  const errores = resultadoDatos.success
    ? {}
    : mapearErroresImagen(resultadoDatos.error);

  if (!(archivo instanceof File)) {
    errores.archivo = "Seleccioná una imagen.";
  } else {
    const errorArchivo = validarArchivoImagen(archivo);
    if (errorArchivo) errores.archivo = errorArchivo;
  }

  if (
    !resultadoDatos.success ||
    errores.archivo ||
    !(archivo instanceof File)
  ) {
    return { mensaje: "Revisá los campos señalados.", errores };
  }

  try {
    const errorContexto = await verificarContexto(productoId);
    if (errorContexto) return { mensaje: errorContexto };
  } catch (error) {
    console.error("Error al verificar el producto de la imagen", error);
    return { mensaje: "No se pudo verificar el producto. Intentá nuevamente." };
  }

  let rutaSubida: string | null = null;

  try {
    const blob = await subirImagenProducto(productoId, archivo);
    rutaSubida = blob.url;
    await crearImagen(productoId, blob.url, resultadoDatos.data);
  } catch (error) {
    if (rutaSubida) {
      try {
        await eliminarImagenAlmacenada(rutaSubida);
      } catch (errorLimpieza) {
        console.error("No se pudo compensar el Blob subido", errorLimpieza);
      }
    }

    if (!rutaSubida) {
      console.error("Error al subir la imagen a Vercel Blob", error);
      return {
        mensaje:
          "No se pudo subir la imagen. Verificá la configuración de Vercel Blob e intentá nuevamente.",
      };
    }

    return { mensaje: mensajeErrorPersistencia(error) };
  }

  revalidarImagenes(productoId);
  redirect(`/admin/productos/${productoId}/imagenes?resultado=subida`);
}

export async function accionActualizarImagen(
  productoId: string,
  imagenId: string,
  _estadoAnterior: EstadoFormularioImagen,
  formulario: FormData,
): Promise<EstadoFormularioImagen> {
  await exigirAdministradorActivo();

  if (
    !esquemaId.safeParse(productoId).success ||
    !esquemaId.safeParse(imagenId).success
  ) {
    return { mensaje: "El identificador de la imagen no es válido." };
  }

  const resultado = validarDatosImagen({
    ...leerDatos(formulario),
    esPrincipal: false,
  });
  if (!resultado.success) {
    return {
      mensaje: "Revisá los campos señalados.",
      errores: mapearErroresImagen(resultado.error),
    };
  }

  try {
    const errorContexto = await verificarContexto(productoId, imagenId);
    if (errorContexto) return { mensaje: errorContexto };

    await actualizarImagen(productoId, imagenId, {
      textoAlternativo: resultado.data.textoAlternativo,
      orden: resultado.data.orden,
    });
    revalidarImagenes(productoId);
    return { mensaje: "Datos de la imagen actualizados." };
  } catch (error) {
    return { mensaje: mensajeErrorPersistencia(error) };
  }
}

export async function accionDefinirImagenPrincipal(
  productoId: string,
  imagenId: string,
  estadoAnterior: EstadoAccionImagen,
): Promise<EstadoAccionImagen> {
  void estadoAnterior;
  await exigirAdministradorActivo();

  if (
    !esquemaId.safeParse(productoId).success ||
    !esquemaId.safeParse(imagenId).success
  ) {
    return { mensaje: "El identificador de la imagen no es válido." };
  }

  try {
    const imagen = await definirImagenPrincipal(productoId, imagenId);
    if (!imagen) return { mensaje: "La imagen ya no existe." };

    revalidarImagenes(productoId);
    return { exito: true, mensaje: "Imagen principal actualizada." };
  } catch (error) {
    console.error("Error al definir la imagen principal", error);
    return { mensaje: "No se pudo definir la imagen principal." };
  }
}

export async function accionEliminarImagen(
  productoId: string,
  imagenId: string,
  estadoAnterior: EstadoAccionImagen,
): Promise<EstadoAccionImagen> {
  void estadoAnterior;
  await exigirAdministradorActivo();

  if (
    !esquemaId.safeParse(productoId).success ||
    !esquemaId.safeParse(imagenId).success
  ) {
    return { mensaje: "El identificador de la imagen no es válido." };
  }

  try {
    const imagen = await eliminarImagen(productoId, imagenId);
    if (!imagen) return { mensaje: "La imagen ya no existe." };

    let mensaje = "Imagen eliminada.";
    try {
      await eliminarImagenAlmacenada(imagen.rutaImagen);
    } catch (errorBlob) {
      console.error("No se pudo eliminar el archivo de Vercel Blob", errorBlob);
      mensaje =
        "La imagen se quitó del producto, pero el archivo remoto no pudo limpiarse.";
    }

    revalidarImagenes(productoId);
    return { exito: true, mensaje };
  } catch (error) {
    console.error("Error al eliminar la imagen", error);
    return { mensaje: "No se pudo eliminar la imagen." };
  }
}
