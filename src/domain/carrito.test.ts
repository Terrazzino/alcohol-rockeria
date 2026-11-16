import { describe, expect, it } from "vitest";

import {
  CANTIDAD_MAXIMA_ITEM_CARRITO,
  ITEMS_MAXIMOS_CARRITO,
  actualizarCantidadItemCarrito,
  agregarItemCarrito,
  calcularSubtotalItemCarrito,
  calcularTotalCarrito,
  centavosAPrecioCarrito,
  contarUnidadesCarrito,
  crearClaveItemCarrito,
  deserializarCarrito,
  eliminarItemCarrito,
  esCantidadCarritoValida,
  serializarCarrito,
  vaciarCarrito,
  type SeleccionCarrito,
} from "./carrito";

const PRODUCTO_ID = "11111111-1111-4111-8111-111111111111";
const VARIANTE_M_ID = "22222222-2222-4222-8222-222222222222";
const VARIANTE_L_ID = "33333333-3333-4333-8333-333333333333";

function crearSeleccion(
  variante: SeleccionCarrito["variante"] = null,
  precioUnitario = "25000",
): SeleccionCarrito {
  return {
    productoId: PRODUCTO_ID,
    slug: "remera-metallica",
    nombre: "Remera Metallica",
    variante,
    precioUnitario,
    imagen: null,
  };
}

describe("operaciones del carrito", () => {
  it("agrega un producto sin variante", () => {
    expect(agregarItemCarrito([], crearSeleccion(), 2)).toEqual([
      { ...crearSeleccion(), cantidad: 2 },
    ]);
  });

  it("acumula la misma combinación y actualiza su instantánea", () => {
    const inicial = agregarItemCarrito(
      [],
      crearSeleccion({ id: VARIANTE_M_ID, nombre: "Talle M" }),
      1,
    );
    const actualizada = crearSeleccion(
      { id: VARIANTE_M_ID, nombre: "Talle M" },
      "27000",
    );

    expect(agregarItemCarrito(inicial, actualizada, 2)).toEqual([
      { ...actualizada, cantidad: 3 },
    ]);
  });

  it("mantiene variantes distintas como ítems separados", () => {
    const talleM = crearSeleccion({ id: VARIANTE_M_ID, nombre: "Talle M" });
    const talleL = crearSeleccion({ id: VARIANTE_L_ID, nombre: "Talle L" });
    const items = agregarItemCarrito(
      agregarItemCarrito([], talleM, 1),
      talleL,
      1,
    );

    expect(items).toHaveLength(2);
    expect(items.map((item) => item.variante?.nombre)).toEqual([
      "Talle M",
      "Talle L",
    ]);
  });

  it("actualiza y elimina una combinación por su clave", () => {
    const item = { ...crearSeleccion(), cantidad: 1 };
    const clave = crearClaveItemCarrito(PRODUCTO_ID, null);

    expect(actualizarCantidadItemCarrito([item], clave, 4)[0].cantidad).toBe(4);
    expect(eliminarItemCarrito([item], clave)).toEqual([]);
    expect(vaciarCarrito()).toEqual([]);
  });

  it("rechaza cantidades inválidas y desbordes al acumular", () => {
    for (const cantidad of [0, -1, 1.5, Number.NaN, 100]) {
      expect(esCantidadCarritoValida(cantidad)).toBe(false);
      expect(agregarItemCarrito([], crearSeleccion(), cantidad)).toEqual([]);
    }

    const maximo = [
      { ...crearSeleccion(), cantidad: CANTIDAD_MAXIMA_ITEM_CARRITO },
    ];
    expect(agregarItemCarrito(maximo, crearSeleccion(), 1)).toBe(maximo);
  });

  it("limita las combinaciones distintas y cuenta sus unidades", () => {
    const items = Array.from(
      { length: ITEMS_MAXIMOS_CARRITO },
      (_, indice) => ({
        ...crearSeleccion(),
        productoId: `producto-${indice}`,
        cantidad: 2,
      }),
    );

    expect(contarUnidadesCarrito(items)).toBe(ITEMS_MAXIMOS_CARRITO * 2);
    expect(
      agregarItemCarrito(
        items,
        { ...crearSeleccion(), productoId: "producto-adicional" },
        1,
      ),
    ).toBe(items);
  });
});

describe("cálculos informativos", () => {
  it("calcula subtotal y total usando centavos", () => {
    const primero = { ...crearSeleccion(null, "25000.50"), cantidad: 2 };
    const segundo = {
      ...crearSeleccion({ id: VARIANTE_M_ID, nombre: "Talle M" }, "1000"),
      cantidad: 3,
    };

    expect(calcularSubtotalItemCarrito(primero)).toBe(5_000_100);
    expect(calcularTotalCarrito([primero, segundo])).toBe(5_300_100);
    expect(centavosAPrecioCarrito(5_300_100)).toBe("53001.00");
  });
});

describe("persistencia del carrito", () => {
  it("serializa y recupera una estructura versionada válida", () => {
    const items = [{ ...crearSeleccion(), cantidad: 2 }];
    expect(deserializarCarrito(serializarCarrito(items))).toEqual(items);
  });

  it("descarta JSON corrupto, versiones incompatibles y datos manipulados", () => {
    expect(deserializarCarrito("{")).toEqual([]);
    expect(
      deserializarCarrito(JSON.stringify({ version: 2, items: [] })),
    ).toEqual([]);
    expect(
      deserializarCarrito(
        JSON.stringify({
          version: 1,
          items: [{ ...crearSeleccion(), cantidad: -5 }],
        }),
      ),
    ).toEqual([]);
    expect(
      deserializarCarrito(
        JSON.stringify({
          version: 1,
          items: [
            { ...crearSeleccion(), cantidad: 1 },
            { ...crearSeleccion(), cantidad: 2 },
          ],
        }),
      ),
    ).toEqual([]);
  });

  it("rechaza protocolos no web en imágenes persistidas", () => {
    for (const rutaImagen of [
      "javascript:alert(1)",
      "data:image/svg+xml,<svg></svg>",
      "file:///producto.jpg",
    ]) {
      expect(
        deserializarCarrito(
          JSON.stringify({
            version: 1,
            items: [
              {
                ...crearSeleccion(),
                cantidad: 1,
                imagen: { rutaImagen, textoAlternativo: "Producto" },
              },
            ],
          }),
        ),
      ).toEqual([]);
    }
  });
});
