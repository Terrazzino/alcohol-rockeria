import { describe, expect, it } from "vitest";

import {
  formatearPrecioArgentino,
  precioACentavos,
  validarProducto,
} from "./productos";

const productoValido = {
  nombre: "Remera Metallica",
  slug: "remera-metallica",
  descripcion: "Remera negra estampada",
  precioBase: "25000.50",
  categoriaId: "5feb85d5-e815-4ac8-b670-b1969728667a",
  bandaId: "e39bbd58-271c-4e9f-8bc2-8ee94255a675",
  estado: "ACTIVO",
  destacado: false,
  orden: "1",
};

describe("precio de producto", () => {
  it("convierte entradas con punto o coma a centavos exactos", () => {
    expect(precioACentavos("25000.50")).toBe(2_500_050);
    expect(precioACentavos("25000,5")).toBe(2_500_050);
  });

  it("formatea pesos argentinos sin decimales innecesarios", () => {
    expect(formatearPrecioArgentino("25000")).toBe("$ 25.000");
    expect(formatearPrecioArgentino("25000.50")).toBe("$ 25.000,50");
  });

  it("rechaza más de dos decimales y entradas no numéricas", () => {
    expect(precioACentavos("10.999")).toBeNull();
    expect(precioACentavos("gratis")).toBeNull();
  });
});

describe("validarProducto", () => {
  it("normaliza precio, banda vacía y orden vacío", () => {
    const resultado = validarProducto({
      ...productoValido,
      precioBase: " 25000,50 ",
      bandaId: "",
      orden: "",
    });

    expect(resultado).toEqual({
      success: true,
      data: {
        ...productoValido,
        precioBase: "25000.50",
        bandaId: null,
        orden: null,
      },
    });
  });

  it("acepta todos los estados definidos", () => {
    for (const estado of ["ACTIVO", "SIN_STOCK", "OCULTO"]) {
      expect(validarProducto({ ...productoValido, estado }).success).toBe(true);
    }
  });

  it("rechaza precio, referencias, estado y orden inválidos", () => {
    const resultado = validarProducto({
      ...productoValido,
      precioBase: "-1",
      categoriaId: "inexistente",
      bandaId: "inexistente",
      estado: "PUBLICADO",
      orden: "1.5",
    });

    expect(resultado.success).toBe(false);
    if (!resultado.success) {
      expect(resultado.error.issues.map((issue) => issue.path[0])).toEqual(
        expect.arrayContaining([
          "precioBase",
          "categoriaId",
          "bandaId",
          "estado",
          "orden",
        ]),
      );
    }
  });
});
