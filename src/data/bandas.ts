import "server-only";

import type { BandaEditable, BandaListado, DatosBanda } from "@/domain/bandas";
import { clientePrisma } from "@/lib/prisma";

const seleccionBanda = {
  id: true,
  nombre: true,
  slug: true,
  descripcion: true,
  urlImagen: true,
  orden: true,
  estaVisible: true,
} as const;

export async function obtenerBandas(): Promise<BandaListado[]> {
  const bandas = await clientePrisma.banda.findMany({
    select: {
      ...seleccionBanda,
      _count: { select: { productos: true } },
    },
    orderBy: [{ orden: "asc" }, { nombre: "asc" }],
  });

  return bandas.map(({ _count, ...banda }) => ({
    ...banda,
    cantidadProductos: _count.productos,
  }));
}

export function obtenerBandaPorId(id: string): Promise<BandaEditable | null> {
  return clientePrisma.banda.findUnique({
    where: { id },
    select: seleccionBanda,
  });
}

export function crearBanda(datos: DatosBanda) {
  return clientePrisma.banda.create({ data: datos });
}

export function actualizarBanda(id: string, datos: DatosBanda) {
  return clientePrisma.banda.update({ where: { id }, data: datos });
}

export function eliminarBanda(id: string) {
  return clientePrisma.banda.delete({ where: { id } });
}

export function cambiarVisibilidadBanda(id: string, estaVisible: boolean) {
  return clientePrisma.banda.update({
    where: { id },
    data: { estaVisible },
  });
}
