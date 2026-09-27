import "server-only";

import { Prisma } from "@/generated/prisma/client";

import type {
  OpcionesGestionPrecios,
  ProductoPrecioFuente,
  SolicitudActualizacionPrecios,
  VistaPreviaPrecios,
} from "@/domain/precios";
import { precioACentavos } from "@/domain/productos";
import { clientePrisma } from "@/lib/prisma";

export class ConflictoActualizacionPrecios extends Error {
  constructor() {
    super("Los precios o productos cambiaron desde que se generó el preview.");
    this.name = "ConflictoActualizacionPrecios";
  }
}

export async function obtenerOpcionesGestionPrecios(): Promise<OpcionesGestionPrecios> {
  const [categorias, bandas, productos] = await Promise.all([
    clientePrisma.categoria.findMany({
      select: { id: true, nombre: true, estaVisible: true },
      orderBy: [{ orden: "asc" }, { nombre: "asc" }],
    }),
    clientePrisma.banda.findMany({
      select: { id: true, nombre: true, estaVisible: true },
      orderBy: [{ orden: "asc" }, { nombre: "asc" }],
    }),
    clientePrisma.producto.findMany({
      select: {
        id: true,
        nombre: true,
        precioBase: true,
        estado: true,
        categoria: { select: { nombre: true } },
        banda: { select: { nombre: true } },
      },
      orderBy: [{ orden: "asc" }, { nombre: "asc" }],
    }),
  ]);

  return {
    categorias,
    bandas,
    productos: productos.map((producto) => ({
      ...producto,
      precioBase: producto.precioBase.toString(),
    })),
  };
}

function crearFiltroProductos(
  solicitud: SolicitudActualizacionPrecios,
): Prisma.ProductoWhereInput {
  const filtro: Prisma.ProductoWhereInput = solicitud.incluirOcultos
    ? {}
    : { estado: { not: "OCULTO" } };

  if (solicitud.alcance === "CATEGORIA") {
    filtro.categoriaId = solicitud.referenciaId ?? undefined;
  } else if (solicitud.alcance === "BANDA") {
    filtro.bandaId = solicitud.referenciaId ?? undefined;
  } else if (solicitud.alcance === "SELECCION") {
    filtro.id = { in: solicitud.productoIds };
  }

  return filtro;
}

export async function obtenerProductosParaPreview(
  solicitud: SolicitudActualizacionPrecios,
): Promise<ProductoPrecioFuente[]> {
  const productos = await clientePrisma.producto.findMany({
    where: crearFiltroProductos(solicitud),
    select: {
      id: true,
      nombre: true,
      estado: true,
      precioBase: true,
      categoria: { select: { id: true, nombre: true } },
      banda: { select: { id: true, nombre: true } },
      variantes: {
        where: { precioEspecifico: { not: null } },
        select: { id: true, nombre: true, precioEspecifico: true },
        orderBy: [{ orden: "asc" }, { nombre: "asc" }],
      },
    },
    orderBy: [{ orden: "asc" }, { nombre: "asc" }],
  });

  return productos.map((producto) => ({
    ...producto,
    precioBase: producto.precioBase.toString(),
    variantes: producto.variantes.map((variante) => ({
      id: variante.id,
      nombre: variante.nombre,
      precioEspecifico: variante.precioEspecifico!.toString(),
    })),
  }));
}

function precioCoincide(actual: Prisma.Decimal, esperado: string) {
  return precioACentavos(actual.toString()) === precioACentavos(esperado);
}

export async function aplicarActualizacionPrecios(preview: VistaPreviaPrecios) {
  return clientePrisma.$transaction(
    async (transaccion) => {
      for (const esperado of preview.productos) {
        const actual = await transaccion.producto.findUnique({
          where: { id: esperado.id },
          select: {
            estado: true,
            precioBase: true,
            variantes: {
              where: { precioEspecifico: { not: null } },
              select: { id: true, precioEspecifico: true },
            },
          },
        });

        if (
          !actual ||
          actual.estado !== esperado.estado ||
          !precioCoincide(actual.precioBase, esperado.precioActual) ||
          actual.variantes.length !== esperado.variantes.length
        ) {
          throw new ConflictoActualizacionPrecios();
        }

        const variantesActuales = new Map(
          actual.variantes.map((variante) => [variante.id, variante]),
        );
        for (const varianteEsperada of esperado.variantes) {
          const varianteActual = variantesActuales.get(varianteEsperada.id);
          if (
            !varianteActual?.precioEspecifico ||
            !precioCoincide(
              varianteActual.precioEspecifico,
              varianteEsperada.precioEspecifico,
            )
          ) {
            throw new ConflictoActualizacionPrecios();
          }
        }

        await transaccion.producto.update({
          where: { id: esperado.id },
          data: { precioBase: new Prisma.Decimal(esperado.precioResultante) },
        });

        for (const variante of esperado.variantes) {
          await transaccion.varianteProducto.update({
            where: { id: variante.id, productoId: esperado.id },
            data: {
              precioEspecifico: new Prisma.Decimal(variante.precioResultante),
            },
          });
        }
      }

      return preview.productos.length;
    },
    { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
  );
}
