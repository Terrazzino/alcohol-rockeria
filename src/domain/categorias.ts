import {
  esquemaClasificacion,
  mapearErroresClasificacion,
  type DatosClasificacion,
  type ErroresClasificacion,
} from "./clasificaciones";

export const esquemaCategoria = esquemaClasificacion;
export type DatosCategoria = DatosClasificacion;
export type ErroresCategoria = ErroresClasificacion;

export interface CategoriaListado {
  id: string;
  nombre: string;
  slug: string;
  descripcion: string | null;
  urlImagen: string | null;
  orden: number;
  estaVisible: boolean;
  cantidadProductos: number;
}

export type CategoriaEditable = Omit<CategoriaListado, "cantidadProductos">;

export function validarCategoria(entrada: unknown) {
  return esquemaCategoria.safeParse(entrada);
}

export const mapearErroresCategoria = mapearErroresClasificacion;
