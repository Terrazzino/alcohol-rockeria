import "server-only";

import type {
  ConfiguracionTiendaEditable,
  DatosConfiguracionTienda,
} from "@/domain/configuracion-tienda";
import { obtenerNumeroWhatsappValido } from "@/domain/configuracion-tienda";
import { normalizarConfiguracionPublica } from "@/domain/inicio";
import { clientePrisma } from "@/lib/prisma";

const ID_CONFIGURACION_TIENDA = 1;

const seleccionConfiguracion = {
  nombreTienda: true,
  tituloPrincipal: true,
  subtituloPrincipal: true,
  numeroWhatsapp: true,
  urlInstagram: true,
  direccion: true,
  urlMaps: true,
  horarios: true,
  textoHistoria: true,
  textoContacto: true,
  actualizadoEn: true,
} as const;

export function obtenerConfiguracionTienda(): Promise<ConfiguracionTiendaEditable | null> {
  return clientePrisma.configuracionTienda.findUnique({
    where: { id: ID_CONFIGURACION_TIENDA },
    select: seleccionConfiguracion,
  });
}

export async function obtenerNumeroWhatsappPublico(): Promise<string | null> {
  const configuracion = await clientePrisma.configuracionTienda.findUnique({
    where: { id: ID_CONFIGURACION_TIENDA },
    select: { numeroWhatsapp: true },
  });

  return obtenerNumeroWhatsappValido(configuracion?.numeroWhatsapp);
}

export async function obtenerConfiguracionPublica() {
  const configuracion = await clientePrisma.configuracionTienda.findUnique({
    where: { id: ID_CONFIGURACION_TIENDA },
    select: {
      nombreTienda: true,
      tituloPrincipal: true,
      subtituloPrincipal: true,
      numeroWhatsapp: true,
      urlInstagram: true,
      direccion: true,
      urlMaps: true,
      horarios: true,
      textoHistoria: true,
      textoContacto: true,
    },
  });

  return normalizarConfiguracionPublica(configuracion);
}

export function guardarConfiguracionTienda(datos: DatosConfiguracionTienda) {
  return clientePrisma.configuracionTienda.upsert({
    where: { id: ID_CONFIGURACION_TIENDA },
    create: { id: ID_CONFIGURACION_TIENDA, ...datos },
    update: datos,
    select: seleccionConfiguracion,
  });
}
