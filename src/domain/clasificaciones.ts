import { z } from "zod";

import { PATRON_SLUG } from "./slug";

const textoOpcional = (maximo: number, mensaje: string) =>
  z.preprocess(
    (valor) =>
      typeof valor === "string" && valor.trim() === ""
        ? null
        : typeof valor === "string"
          ? valor.trim()
          : valor,
    z.string().max(maximo, mensaje).nullable(),
  );

export const esquemaClasificacion = z.object({
  nombre: z
    .string({ error: "Ingresá el nombre." })
    .trim()
    .min(2, "El nombre debe tener al menos 2 caracteres.")
    .max(100, "El nombre no puede superar 100 caracteres."),
  slug: z
    .string({ error: "Ingresá el slug." })
    .trim()
    .min(1, "Ingresá el slug.")
    .max(120, "El slug no puede superar 120 caracteres.")
    .regex(
      PATRON_SLUG,
      "Usá solamente letras minúsculas, números y guiones simples.",
    ),
  descripcion: textoOpcional(
    1000,
    "La descripción no puede superar 1000 caracteres.",
  ),
  urlImagen: z.preprocess(
    (valor) =>
      typeof valor === "string" && valor.trim() === ""
        ? null
        : typeof valor === "string"
          ? valor.trim()
          : valor,
    z
      .url("Ingresá una URL de imagen válida.")
      .max(2048, "La URL de imagen es demasiado larga.")
      .nullable(),
  ),
  orden: z.coerce
    .number({ error: "Ingresá un número de orden válido." })
    .int("El orden debe ser un número entero.")
    .min(0, "El orden no puede ser negativo.")
    .max(999999, "El orden es demasiado alto."),
  estaVisible: z.boolean({ error: "El estado de visibilidad no es válido." }),
});

export type DatosClasificacion = z.infer<typeof esquemaClasificacion>;
export type CampoClasificacion = keyof DatosClasificacion;
export type ErroresClasificacion = Partial<Record<CampoClasificacion, string>>;

export function mapearErroresClasificacion(
  error: z.ZodError,
): ErroresClasificacion {
  return error.issues.reduce<ErroresClasificacion>((errores, issue) => {
    const campo = issue.path[0];

    if (
      (campo === "nombre" ||
        campo === "slug" ||
        campo === "descripcion" ||
        campo === "urlImagen" ||
        campo === "orden" ||
        campo === "estaVisible") &&
      !errores[campo]
    ) {
      errores[campo] = issue.message;
    }

    return errores;
  }, {});
}
