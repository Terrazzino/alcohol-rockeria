"use server";

import { Prisma } from "@/generated/prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  aplicarActualizacionPrecios,
  ConflictoActualizacionPrecios,
  obtenerProductosParaPreview,
} from "@/data/precios";
import {
  crearVistaPreviaPrecios,
  mapearErroresSolicitudPrecios,
  validarSolicitudPrecios,
  vistaPreviaCoincideConCalculo,
  type ErroresSolicitudPrecios,
  type VistaPreviaPrecios,
} from "@/domain/precios";
import { exigirAdministradorActivo } from "@/features/autenticacion/sesion";

export interface EstadoPreviewPrecios {
  mensaje?: string;
  errores?: ErroresSolicitudPrecios;
  preview?: VistaPreviaPrecios;
}

export interface EstadoConfirmacionPrecios {
  mensaje?: string;
}

function leerSolicitud(formulario: FormData) {
  return {
    alcance: formulario.get("alcance"),
    referenciaId: formulario.get("referenciaId"),
    productoIds: formulario.getAll("productoIds"),
    incluirOcultos: formulario.get("incluirOcultos") === "on",
    porcentaje: formulario.get("porcentaje"),
  };
}

function esErrorPrisma(
  error: unknown,
): error is Prisma.PrismaClientKnownRequestError {
  return error instanceof Prisma.PrismaClientKnownRequestError;
}

export async function accionGenerarPreviewPrecios(
  _estadoAnterior: EstadoPreviewPrecios,
  formulario: FormData,
): Promise<EstadoPreviewPrecios> {
  await exigirAdministradorActivo();

  const resultadoSolicitud = validarSolicitudPrecios(leerSolicitud(formulario));
  if (!resultadoSolicitud.success) {
    return {
      mensaje: "Revisá los campos señalados.",
      errores: mapearErroresSolicitudPrecios(resultadoSolicitud.error),
    };
  }

  try {
    const productos = await obtenerProductosParaPreview(
      resultadoSolicitud.data,
    );
    if (productos.length === 0) {
      return {
        mensaje:
          "El alcance elegido no contiene productos para actualizar. Revisá la selección y la inclusión de productos ocultos.",
      };
    }

    const resultadoPreview = crearVistaPreviaPrecios(
      resultadoSolicitud.data,
      productos,
    );
    if (!resultadoPreview.success) {
      return { mensaje: resultadoPreview.mensaje };
    }

    return { preview: resultadoPreview.data };
  } catch (error) {
    console.error("Error al generar el preview de precios", error);
    return {
      mensaje: "No se pudo calcular el preview. Intentá nuevamente.",
    };
  }
}

export async function accionConfirmarPrecios(
  preview: VistaPreviaPrecios,
  _estadoAnterior: EstadoConfirmacionPrecios,
): Promise<EstadoConfirmacionPrecios> {
  void _estadoAnterior;
  await exigirAdministradorActivo();

  if (!preview.productos.length || !vistaPreviaCoincideConCalculo(preview)) {
    return {
      mensaje:
        "El preview no es válido o quedó incompleto. Recalculalo antes de confirmar.",
    };
  }

  let cantidad: number;

  try {
    cantidad = await aplicarActualizacionPrecios(preview);
  } catch (error) {
    if (error instanceof ConflictoActualizacionPrecios) {
      return {
        mensaje:
          "Los precios, variantes o estados cambiaron desde el preview. No se modificó nada; recalculá antes de confirmar.",
      };
    }
    if (esErrorPrisma(error) && error.code === "P2034") {
      return {
        mensaje:
          "Otra operación modificó los precios al mismo tiempo. No se aplicó el cambio; recalculá el preview.",
      };
    }

    console.error("Error al confirmar la actualización de precios", error);
    return {
      mensaje: "No se pudieron actualizar los precios. No se aplicó el cambio.",
    };
  }

  revalidatePath("/admin/precios");
  revalidatePath("/admin/productos");
  revalidatePath("/admin/variantes");
  for (const producto of preview.productos) {
    revalidatePath(`/admin/productos/${producto.id}/variantes`);
  }

  redirect(`/admin/precios?resultado=actualizados&cantidad=${cantidad}`);
}
