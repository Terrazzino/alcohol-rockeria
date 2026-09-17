import { z } from "zod";

const LONGITUD_MINIMA_CONTRASENA = 12;
const LONGITUD_MAXIMA_BCRYPT_BYTES = 72;

const esquemaCorreo = z
  .string({ error: "Ingresá el correo." })
  .trim()
  .min(1, "Ingresá el correo.")
  .max(254, "El correo es demasiado largo.")
  .email("Ingresá un correo válido.")
  .transform(normalizarCorreo);

const esquemaContrasena = z
  .string({ error: "Ingresá la contraseña." })
  .min(
    LONGITUD_MINIMA_CONTRASENA,
    `La contraseña debe tener al menos ${LONGITUD_MINIMA_CONTRASENA} caracteres.`,
  )
  .refine(
    (contrasena) =>
      new TextEncoder().encode(contrasena).length <=
      LONGITUD_MAXIMA_BCRYPT_BYTES,
    "La contraseña no puede superar 72 bytes.",
  );

const esquemaCredenciales = z.object({
  correo: esquemaCorreo,
  contrasena: esquemaContrasena,
});

const esquemaNuevoAdministrador = esquemaCredenciales.extend({
  nombre: z
    .string({ error: "El nombre debe ser texto." })
    .trim()
    .max(120, "El nombre no puede superar 120 caracteres.")
    .transform((nombre) => nombre || null),
});

export interface ErroresCredenciales {
  correo?: string;
  contrasena?: string;
  nombre?: string;
}

type ResultadoValidacion<T> =
  { exito: true; datos: T } | { exito: false; errores: ErroresCredenciales };

export function normalizarCorreo(correo: string) {
  return correo.trim().toLowerCase();
}

function mapearErrores(error: z.ZodError): ErroresCredenciales {
  return error.issues.reduce<ErroresCredenciales>((errores, issue) => {
    const campo = issue.path[0];

    if (
      (campo === "correo" || campo === "contrasena" || campo === "nombre") &&
      !errores[campo]
    ) {
      errores[campo] = issue.message;
    }

    return errores;
  }, {});
}

export function validarCredenciales(
  entrada: unknown,
): ResultadoValidacion<z.infer<typeof esquemaCredenciales>> {
  const resultado = esquemaCredenciales.safeParse(entrada);

  return resultado.success
    ? { exito: true, datos: resultado.data }
    : { exito: false, errores: mapearErrores(resultado.error) };
}

export function validarNuevoAdministrador(
  entrada: unknown,
): ResultadoValidacion<z.infer<typeof esquemaNuevoAdministrador>> {
  const resultado = esquemaNuevoAdministrador.safeParse(entrada);

  return resultado.success
    ? { exito: true, datos: resultado.data }
    : { exito: false, errores: mapearErrores(resultado.error) };
}
