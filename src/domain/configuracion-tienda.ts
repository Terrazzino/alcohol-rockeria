import { z } from "zod";

export interface ConfiguracionTiendaEditable {
  nombreTienda: string;
  tituloPrincipal: string;
  subtituloPrincipal: string;
  numeroWhatsapp: string;
  urlInstagram: string;
  direccion: string;
  urlMaps: string;
  horarios: string;
  textoHistoria: string;
  textoContacto: string;
  actualizadoEn: Date;
}

export function normalizarNumeroWhatsapp(valor: string) {
  return valor.trim().replace(/[\s()+-]/g, "");
}

const esquemaNumeroWhatsapp = z
  .string()
  .transform(normalizarNumeroWhatsapp)
  .pipe(z.string().regex(/^\d{8,15}$/));

export function obtenerNumeroWhatsappValido(valor: unknown): string | null {
  const resultado = esquemaNumeroWhatsapp.safeParse(valor);
  return resultado.success ? resultado.data : null;
}

function obtenerUrl(valor: string) {
  try {
    return new URL(valor);
  } catch {
    return null;
  }
}

const esquemaTexto = (campo: string, maximo: number) =>
  z
    .string({ error: `Ingresá ${campo}.` })
    .trim()
    .min(1, `Ingresá ${campo}.`)
    .max(maximo, `${campo} no puede superar ${maximo} caracteres.`);

const esquemaUrlHttp = (campo: string) =>
  z
    .string({ error: `Ingresá ${campo}.` })
    .trim()
    .min(1, `Ingresá ${campo}.`)
    .max(2048, `${campo} no puede superar 2048 caracteres.`)
    .url(`Ingresá una URL válida para ${campo}.`)
    .refine((valor) => {
      const protocolo = obtenerUrl(valor)?.protocol;
      return protocolo === "https:" || protocolo === "http:";
    }, `${campo} debe usar http:// o https://.`);

const esquemaInstagram = esquemaUrlHttp("la URL de Instagram").refine(
  (valor) => {
    const host = obtenerUrl(valor)?.hostname.toLowerCase();
    if (!host) return false;
    return host === "instagram.com" || host.endsWith(".instagram.com");
  },
  "Ingresá una URL perteneciente a Instagram.",
);

export const esquemaConfiguracionTienda = z.object({
  nombreTienda: esquemaTexto("el nombre del comercio", 100),
  tituloPrincipal: esquemaTexto("el título principal", 160),
  subtituloPrincipal: esquemaTexto("el subtítulo principal", 300),
  numeroWhatsapp: z
    .string({ error: "Ingresá el número de WhatsApp." })
    .transform(normalizarNumeroWhatsapp)
    .pipe(
      z
        .string()
        .regex(
          /^\d{8,15}$/,
          "Ingresá entre 8 y 15 dígitos, incluyendo el código de país.",
        ),
    ),
  urlInstagram: esquemaInstagram,
  direccion: esquemaTexto("la dirección", 300),
  urlMaps: esquemaUrlHttp("la URL de Maps"),
  horarios: esquemaTexto("los horarios", 1000),
  textoHistoria: esquemaTexto("el texto de historia", 5000),
  textoContacto: esquemaTexto("el texto de contacto", 2000),
});

export type DatosConfiguracionTienda = z.infer<
  typeof esquemaConfiguracionTienda
>;
export type CampoConfiguracionTienda = keyof DatosConfiguracionTienda;
export type ErroresConfiguracionTienda = Partial<
  Record<CampoConfiguracionTienda, string>
>;

const camposConfiguracion = new Set<CampoConfiguracionTienda>([
  "nombreTienda",
  "tituloPrincipal",
  "subtituloPrincipal",
  "numeroWhatsapp",
  "urlInstagram",
  "direccion",
  "urlMaps",
  "horarios",
  "textoHistoria",
  "textoContacto",
]);

export function validarConfiguracionTienda(entrada: unknown) {
  return esquemaConfiguracionTienda.safeParse(entrada);
}

export function mapearErroresConfiguracionTienda(
  error: z.ZodError,
): ErroresConfiguracionTienda {
  return error.issues.reduce<ErroresConfiguracionTienda>((errores, issue) => {
    const campo = issue.path[0];
    if (
      typeof campo === "string" &&
      camposConfiguracion.has(campo as CampoConfiguracionTienda) &&
      !errores[campo as CampoConfiguracionTienda]
    ) {
      errores[campo as CampoConfiguracionTienda] = issue.message;
    }
    return errores;
  }, {});
}
