import {
  esquemaClasificacion,
  mapearErroresClasificacion,
  type DatosClasificacion,
  type ErroresClasificacion,
} from "./clasificaciones";

export const esquemaBanda = esquemaClasificacion;
export type DatosBanda = DatosClasificacion;
export type ErroresBanda = ErroresClasificacion;

export interface BandaListado {
  id: string;
  nombre: string;
  slug: string;
  descripcion: string | null;
  urlImagen: string | null;
  orden: number;
  estaVisible: boolean;
  cantidadProductos: number;
}

export type BandaEditable = Omit<BandaListado, "cantidadProductos">;

export function validarBanda(entrada: unknown) {
  return esquemaBanda.safeParse(entrada);
}

export const mapearErroresBanda = mapearErroresClasificacion;
