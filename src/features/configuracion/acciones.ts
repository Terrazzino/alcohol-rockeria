"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { guardarConfiguracionTienda } from "@/data/configuracion-tienda";
import {
  mapearErroresConfiguracionTienda,
  validarConfiguracionTienda,
  type ErroresConfiguracionTienda,
} from "@/domain/configuracion-tienda";
import { exigirAdministradorActivo } from "@/features/autenticacion/sesion";

export interface EstadoFormularioConfiguracion {
  mensaje?: string;
  errores?: ErroresConfiguracionTienda;
}

function leerFormulario(formulario: FormData) {
  return {
    nombreTienda: formulario.get("nombreTienda"),
    tituloPrincipal: formulario.get("tituloPrincipal"),
    subtituloPrincipal: formulario.get("subtituloPrincipal"),
    numeroWhatsapp: formulario.get("numeroWhatsapp"),
    urlInstagram: formulario.get("urlInstagram"),
    direccion: formulario.get("direccion"),
    urlMaps: formulario.get("urlMaps"),
    horarios: formulario.get("horarios"),
    textoHistoria: formulario.get("textoHistoria"),
    textoContacto: formulario.get("textoContacto"),
  };
}

export async function accionGuardarConfiguracion(
  _estadoAnterior: EstadoFormularioConfiguracion,
  formulario: FormData,
): Promise<EstadoFormularioConfiguracion> {
  await exigirAdministradorActivo();

  const resultado = validarConfiguracionTienda(leerFormulario(formulario));
  if (!resultado.success) {
    return {
      mensaje: "Revisá los campos señalados.",
      errores: mapearErroresConfiguracionTienda(resultado.error),
    };
  }

  try {
    await guardarConfiguracionTienda(resultado.data);
  } catch (error) {
    console.error("Error al guardar la configuración de la tienda", error);
    return {
      mensaje: "No se pudo guardar la configuración. Intentá nuevamente.",
    };
  }

  revalidatePath("/admin/configuracion");
  redirect("/admin/configuracion?resultado=guardada");
}
