import {
  validarConfiguracionTienda,
  type DatosConfiguracionTienda,
} from "./configuracion-tienda";

export type ConfiguracionPublica = DatosConfiguracionTienda;

export function normalizarConfiguracionPublica(
  valor: unknown,
): ConfiguracionPublica | null {
  const resultado = validarConfiguracionTienda(valor);
  return resultado.success ? resultado.data : null;
}
