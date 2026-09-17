import { z } from "zod";

import { crearEsquemaPrecio } from "./productos";

const esquemaTextoOpcional = z.preprocess(
  (valor) =>
    typeof valor === "string" && valor.trim() === ""
      ? null
      : typeof valor === "string"
        ? valor.trim()
        : valor,
  z
    .string()
    .max(64, "El SKU no puede superar 64 caracteres.")
    .regex(
      /^[A-Za-z0-9][A-Za-z0-9._/-]*$/,
      "Usá letras, números, puntos, guiones, barras o guion bajo.",
    )
    .nullable(),
);

const esquemaPrecioOpcional = z.preprocess(
  (valor) => (typeof valor === "string" && valor.trim() === "" ? null : valor),
  crearEsquemaPrecio("Ingresá un precio específico válido.").nullable(),
);

export const esquemaVariante = z.object({
  nombre: z
    .string({ error: "Ingresá el nombre." })
    .trim()
    .min(1, "Ingresá el nombre de la variante.")
    .max(100, "El nombre no puede superar 100 caracteres."),
  sku: esquemaTextoOpcional,
  precioEspecifico: esquemaPrecioOpcional,
  estaDisponible: z.boolean({ error: "La disponibilidad no es válida." }),
  orden: z.coerce
    .number({ error: "Ingresá un número de orden válido." })
    .int("El orden debe ser un número entero.")
    .min(0, "El orden no puede ser negativo.")
    .max(999999, "El orden es demasiado alto."),
});

export type DatosVariante = z.infer<typeof esquemaVariante>;
export type CampoVariante = keyof DatosVariante;
export type ErroresVariante = Partial<Record<CampoVariante, string>>;

export interface ProductoConVariantes {
  id: string;
  nombre: string;
  precioBase: string;
  categoria: { nombre: string };
  banda: { nombre: string } | null;
}

export interface VarianteListado {
  id: string;
  nombre: string;
  sku: string | null;
  precioEspecifico: string | null;
  estaDisponible: boolean;
  orden: number;
}

export type VarianteEditable = VarianteListado;

export function obtenerPrecioEfectivo(
  precioBase: string,
  precioEspecifico: string | null,
) {
  return precioEspecifico === null
    ? { precio: precioBase, usaPrecioBase: true }
    : { precio: precioEspecifico, usaPrecioBase: false };
}

export function validarVariante(entrada: unknown) {
  return esquemaVariante.safeParse(entrada);
}

export function mapearErroresVariante(error: z.ZodError): ErroresVariante {
  return error.issues.reduce<ErroresVariante>((errores, issue) => {
    const campo = issue.path[0];

    if (
      (campo === "nombre" ||
        campo === "sku" ||
        campo === "precioEspecifico" ||
        campo === "estaDisponible" ||
        campo === "orden") &&
      !errores[campo]
    ) {
      errores[campo] = issue.message;
    }

    return errores;
  }, {});
}
