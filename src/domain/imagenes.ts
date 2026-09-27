import { z } from "zod";

export const TAMANO_MAXIMO_IMAGEN = 4 * 1024 * 1024;
export const TAMANO_MAXIMO_IMAGEN_MB = 4;

export const TIPOS_IMAGEN_PERMITIDOS = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
] as const;

type TipoImagenPermitido = (typeof TIPOS_IMAGEN_PERMITIDOS)[number];

export interface MetadatosArchivoImagen {
  size: number;
  type: string;
}

export interface ProductoParaImagenes {
  id: string;
  nombre: string;
  slug: string;
}

export interface ImagenProductoListado {
  id: string;
  rutaImagen: string;
  textoAlternativo: string;
  orden: number;
  esPrincipal: boolean;
  creadoEn: Date;
}

export interface ProductoResumenImagenes extends ProductoParaImagenes {
  cantidadImagenes: number;
  imagenPrincipal: {
    rutaImagen: string;
    textoAlternativo: string;
  } | null;
}

export const esquemaDatosImagen = z.object({
  textoAlternativo: z
    .string({ error: "Ingresá el texto alternativo." })
    .trim()
    .min(1, "Ingresá el texto alternativo.")
    .max(240, "El texto alternativo no puede superar 240 caracteres."),
  orden: z.coerce
    .number({ error: "Ingresá un número de orden válido." })
    .int("El orden debe ser un número entero.")
    .min(0, "El orden no puede ser negativo.")
    .max(999999, "El orden es demasiado alto."),
  esPrincipal: z.boolean({
    error: "La selección de imagen principal no es válida.",
  }),
});

export type DatosImagen = z.infer<typeof esquemaDatosImagen>;
export type CampoImagen = "archivo" | "textoAlternativo" | "orden";
export type ErroresImagen = Partial<Record<CampoImagen, string>>;

export function validarDatosImagen(entrada: unknown) {
  return esquemaDatosImagen.safeParse(entrada);
}

export function validarArchivoImagen({
  size,
  type,
}: MetadatosArchivoImagen): string | null {
  if (!TIPOS_IMAGEN_PERMITIDOS.includes(type as TipoImagenPermitido)) {
    return "Usá una imagen JPEG, PNG, WebP o AVIF.";
  }

  if (size <= 0) return "Seleccioná una imagen.";

  if (size > TAMANO_MAXIMO_IMAGEN) {
    return `La imagen no puede superar ${TAMANO_MAXIMO_IMAGEN_MB} MB.`;
  }

  return null;
}

export function mapearErroresImagen(error: z.ZodError): ErroresImagen {
  return error.issues.reduce<ErroresImagen>((errores, issue) => {
    const campo = issue.path[0];

    if (
      (campo === "textoAlternativo" || campo === "orden") &&
      !errores[campo]
    ) {
      errores[campo] = issue.message;
    }

    return errores;
  }, {});
}
