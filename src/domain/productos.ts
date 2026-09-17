import { z } from "zod";

import { PATRON_SLUG } from "./slug";

export const ESTADOS_PRODUCTO = ["ACTIVO", "SIN_STOCK", "OCULTO"] as const;
export type EstadoProductoDominio = (typeof ESTADOS_PRODUCTO)[number];

export const ETIQUETAS_ESTADO_PRODUCTO: Record<EstadoProductoDominio, string> =
  {
    ACTIVO: "Activo",
    SIN_STOCK: "Sin stock",
    OCULTO: "Oculto",
  };

const PRECIO_MAXIMO_CENTAVOS = 999_999_999_999;

export function normalizarPrecio(valor: string) {
  return valor.trim().replace(",", ".");
}

export function precioACentavos(valor: string): number | null {
  const normalizado = normalizarPrecio(valor);

  if (!/^\d+(?:\.\d{1,2})?$/.test(normalizado)) return null;

  const [enteros, decimales = ""] = normalizado.split(".");
  return Number(enteros) * 100 + Number(decimales.padEnd(2, "0"));
}

export function formatearPrecioArgentino(valor: string) {
  const centavos = precioACentavos(valor);
  if (centavos === null) return "Precio inválido";

  const enteros = Math.trunc(centavos / 100);
  const decimales = centavos % 100;
  const parteEntera = new Intl.NumberFormat("es-AR").format(enteros);

  return decimales === 0
    ? `$ ${parteEntera}`
    : `$ ${parteEntera},${decimales.toString().padStart(2, "0")}`;
}

const esquemaPrecio = z
  .string({ error: "Ingresá el precio base." })
  .transform(normalizarPrecio)
  .superRefine((valor, contexto) => {
    const centavos = precioACentavos(valor);

    if (centavos === null) {
      contexto.addIssue({
        code: "custom",
        message: "Ingresá un precio válido con hasta 2 decimales.",
      });
      return;
    }

    if (centavos > PRECIO_MAXIMO_CENTAVOS) {
      contexto.addIssue({
        code: "custom",
        message: "El precio no puede superar $ 9.999.999.999,99.",
      });
    }
  });

const esquemaOrdenOpcional = z.preprocess(
  (valor) => (typeof valor === "string" && valor.trim() === "" ? null : valor),
  z.coerce
    .number({ error: "Ingresá un número de orden válido." })
    .int("El orden debe ser un número entero.")
    .min(0, "El orden no puede ser negativo.")
    .max(999999, "El orden es demasiado alto.")
    .nullable(),
);

const esquemaBandaOpcional = z.preprocess(
  (valor) => (typeof valor === "string" && valor.trim() === "" ? null : valor),
  z.uuid("Seleccioná una banda válida.").nullable(),
);

export const esquemaProducto = z.object({
  nombre: z
    .string({ error: "Ingresá el nombre." })
    .trim()
    .min(2, "El nombre debe tener al menos 2 caracteres.")
    .max(150, "El nombre no puede superar 150 caracteres."),
  slug: z
    .string({ error: "Ingresá el slug." })
    .trim()
    .min(1, "Ingresá el slug.")
    .max(160, "El slug no puede superar 160 caracteres.")
    .regex(
      PATRON_SLUG,
      "Usá solamente letras minúsculas, números y guiones simples.",
    ),
  descripcion: z
    .string({ error: "Ingresá la descripción." })
    .trim()
    .min(1, "Ingresá la descripción.")
    .max(5000, "La descripción no puede superar 5000 caracteres."),
  precioBase: esquemaPrecio,
  categoriaId: z.uuid("Seleccioná una categoría válida."),
  bandaId: esquemaBandaOpcional,
  estado: z.enum(ESTADOS_PRODUCTO, {
    error: "Seleccioná un estado válido.",
  }),
  destacado: z.boolean({ error: "El estado destacado no es válido." }),
  orden: esquemaOrdenOpcional,
});

export type DatosProducto = z.infer<typeof esquemaProducto>;
export type CampoProducto = keyof DatosProducto;
export type ErroresProducto = Partial<Record<CampoProducto, string>>;

export interface OpcionRelacionProducto {
  id: string;
  nombre: string;
  estaVisible: boolean;
}

export interface ProductoListado {
  id: string;
  nombre: string;
  slug: string;
  precioBase: string;
  estado: EstadoProductoDominio;
  destacado: boolean;
  orden: number | null;
  categoria: Omit<OpcionRelacionProducto, "estaVisible">;
  banda: Omit<OpcionRelacionProducto, "estaVisible"> | null;
}

export interface ProductoEditable {
  id: string;
  nombre: string;
  slug: string;
  descripcion: string;
  precioBase: string;
  categoriaId: string;
  bandaId: string | null;
  estado: EstadoProductoDominio;
  destacado: boolean;
  orden: number | null;
}

export function validarProducto(entrada: unknown) {
  return esquemaProducto.safeParse(entrada);
}

export function mapearErroresProducto(error: z.ZodError): ErroresProducto {
  return error.issues.reduce<ErroresProducto>((errores, issue) => {
    const campo = issue.path[0];

    if (
      (campo === "nombre" ||
        campo === "slug" ||
        campo === "descripcion" ||
        campo === "precioBase" ||
        campo === "categoriaId" ||
        campo === "bandaId" ||
        campo === "estado" ||
        campo === "destacado" ||
        campo === "orden") &&
      !errores[campo]
    ) {
      errores[campo] = issue.message;
    }

    return errores;
  }, {});
}
