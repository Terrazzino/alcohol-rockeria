import "server-only";

import { obtenerConfiguracionPublica } from "@/data/configuracion-tienda";
import {
  mapearProductoPublico,
  ordenProductosPublicos,
  seleccionProductoPublico,
} from "@/data/productos-publicos";
import type { ProductoPublico } from "@/domain/catalogo-publico";
import type { ConfiguracionPublica } from "@/domain/inicio";
import { clientePrisma } from "@/lib/prisma";

export const LIMITE_DESTACADOS_INICIO = 4;

export interface InicioPublico {
  configuracion: ConfiguracionPublica | null;
  destacados: ProductoPublico[];
}

export async function obtenerInicioPublico(): Promise<InicioPublico> {
  const [configuracion, destacados] = await Promise.all([
    obtenerConfiguracionPublica(),
    clientePrisma.producto.findMany({
      where: {
        destacado: true,
        estado: { in: ["ACTIVO", "SIN_STOCK"] },
      },
      select: seleccionProductoPublico,
      orderBy: ordenProductosPublicos,
      take: LIMITE_DESTACADOS_INICIO,
    }),
  ]);

  return {
    configuracion,
    destacados: destacados.map(mapearProductoPublico),
  };
}
