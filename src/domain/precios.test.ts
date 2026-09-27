import { describe, expect, it } from "vitest";

import { PRECIO_MAXIMO_CENTAVOS } from "./productos";
import {
  calcularPrecioResultante,
  centavosAPrecio,
  crearVistaPreviaPrecios,
  formatearPorcentaje,
  porcentajeACentesimas,
  validarSolicitudPrecios,
  vistaPreviaCoincideConCalculo,
  type ProductoPrecioFuente,
  type SolicitudActualizacionPrecios,
} from "./precios";

describe("porcentajes", () => {
  it("convierte enteros y decimales con punto o coma sin usar floats", () => {
    expect(porcentajeACentesimas("10")).toBe(1_000);
    expect(porcentajeACentesimas(" 1,6 ")).toBe(160);
    expect(porcentajeACentesimas("-5.25")).toBe(-525);
    expect(porcentajeACentesimas("+0,01")).toBe(1);
  });

  it("rechaza sintaxis ambigua y más de dos decimales", () => {
    expect(porcentajeACentesimas("1.234")).toBeNull();
    expect(porcentajeACentesimas("1,2,3")).toBeNull();
    expect(porcentajeACentesimas("Infinity")).toBeNull();
    expect(porcentajeACentesimas("")).toBeNull();
  });

  it("formatea aumentos, disminuciones y decimales", () => {
    expect(formatearPorcentaje(1_000)).toBe("+10 %");
    expect(formatearPorcentaje(-525)).toBe("-5,25 %");
    expect(formatearPorcentaje(160)).toBe("+1,6 %");
  });
});

describe("cálculo monetario", () => {
  it("calcula aumentos y disminuciones en centavos", () => {
    expect(calcularPrecioResultante(2_500_000, 580)).toBe(2_645_000);
    expect(calcularPrecioResultante(2_500_000, -1_000)).toBe(2_250_000);
  });

  it("redondea al centavo más cercano y los empates hacia arriba", () => {
    expect(calcularPrecioResultante(100, 50)).toBe(101);
    expect(calcularPrecioResultante(100, -50)).toBe(100);
    expect(calcularPrecioResultante(101, 50)).toBe(102);
  });

  it("acepta una disminución del 100 % y produce cero", () => {
    expect(calcularPrecioResultante(12_345, -10_000)).toBe(0);
  });

  it("rechaza porcentajes fuera de rango y resultados demasiado altos", () => {
    expect(calcularPrecioResultante(100, -10_001)).toBeNull();
    expect(calcularPrecioResultante(100, 1_000_001)).toBeNull();
    expect(calcularPrecioResultante(PRECIO_MAXIMO_CENTAVOS, 1)).toBeNull();
  });

  it("rechaza centavos o porcentajes no enteros", () => {
    expect(calcularPrecioResultante(10.5, 100)).toBeNull();
    expect(calcularPrecioResultante(100, 1.5)).toBeNull();
    expect(calcularPrecioResultante(-1, 100)).toBeNull();
  });

  it("convierte centavos a decimal exacto", () => {
    expect(centavosAPrecio(0)).toBe("0.00");
    expect(centavosAPrecio(2_500_050)).toBe("25000.50");
  });
});

describe("validación de solicitud", () => {
  const base = {
    alcance: "TODOS",
    referenciaId: "",
    productoIds: [],
    incluirOcultos: false,
    porcentaje: "1,6",
  };

  it("normaliza una solicitud válida", () => {
    expect(validarSolicitudPrecios(base)).toEqual({
      success: true,
      data: {
        alcance: "TODOS",
        referenciaId: null,
        productoIds: [],
        incluirOcultos: false,
        porcentajeCentesimas: 160,
      },
    });
  });

  it("requiere referencia para categoría y banda", () => {
    expect(
      validarSolicitudPrecios({ ...base, alcance: "CATEGORIA" }).success,
    ).toBe(false);
    expect(validarSolicitudPrecios({ ...base, alcance: "BANDA" }).success).toBe(
      false,
    );
  });

  it("requiere productos para selección manual", () => {
    expect(
      validarSolicitudPrecios({ ...base, alcance: "SELECCION" }).success,
    ).toBe(false);
  });

  it("rechaza cero, disminuciones mayores al 100 y aumentos extremos", () => {
    for (const porcentaje of ["0", "-100.01", "10000.01"]) {
      expect(validarSolicitudPrecios({ ...base, porcentaje }).success).toBe(
        false,
      );
    }
  });
});

describe("preview", () => {
  const solicitud: SolicitudActualizacionPrecios = {
    alcance: "TODOS",
    referenciaId: null,
    productoIds: [],
    incluirOcultos: true,
    porcentajeCentesimas: 1_000,
  };
  const productos: ProductoPrecioFuente[] = [
    {
      id: "producto-1",
      nombre: "Remera",
      estado: "OCULTO",
      precioBase: "1000.00",
      categoria: { id: "categoria-1", nombre: "Remeras" },
      banda: null,
      variantes: [
        {
          id: "variante-1",
          nombre: "Premium",
          precioEspecifico: "1200.00",
        },
      ],
    },
  ];

  it("calcula bases y variantes e informa cantidades", () => {
    const resultado = crearVistaPreviaPrecios(solicitud, productos);
    expect(resultado).toEqual({
      success: true,
      data: {
        solicitud,
        cantidadVariantes: 1,
        cantidadOcultos: 1,
        productos: [
          {
            id: productos[0].id,
            nombre: productos[0].nombre,
            estado: productos[0].estado,
            categoria: productos[0].categoria,
            banda: productos[0].banda,
            precioActual: "1000.00",
            precioResultante: "1100.00",
            variantes: [
              {
                ...productos[0].variantes[0],
                precioEspecifico: "1200.00",
                precioResultante: "1320.00",
              },
            ],
          },
        ],
      },
    });
  });

  it("rechaza atómicamente si un resultado excede el máximo", () => {
    const resultado = crearVistaPreviaPrecios(solicitud, [
      { ...productos[0], precioBase: "9999999999.99" },
    ]);
    expect(resultado.success).toBe(false);
  });

  it("detecta un precio resultante alterado después del preview", () => {
    const resultado = crearVistaPreviaPrecios(solicitud, productos);
    expect(resultado.success).toBe(true);
    if (!resultado.success) return;

    expect(vistaPreviaCoincideConCalculo(resultado.data)).toBe(true);
    expect(
      vistaPreviaCoincideConCalculo({
        ...resultado.data,
        productos: [
          { ...resultado.data.productos[0], precioResultante: "1.00" },
        ],
      }),
    ).toBe(false);
  });
});
