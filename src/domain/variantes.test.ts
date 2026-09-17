import { describe, expect, it } from "vitest";

import { obtenerPrecioEfectivo, validarVariante } from "./variantes";

describe("obtenerPrecioEfectivo", () => {
  it("usa el precio base cuando la variante no tiene precio específico", () => {
    expect(obtenerPrecioEfectivo("25000", null)).toEqual({
      precio: "25000",
      usaPrecioBase: true,
    });
  });

  it("prioriza el precio específico, incluso cuando es cero", () => {
    expect(obtenerPrecioEfectivo("25000", "28000")).toEqual({
      precio: "28000",
      usaPrecioBase: false,
    });
    expect(obtenerPrecioEfectivo("25000", "0")).toEqual({
      precio: "0",
      usaPrecioBase: false,
    });
  });
});

describe("validarVariante", () => {
  const varianteValida = {
    nombre: "Talle XL",
    sku: "REM-XL-001",
    precioEspecifico: "28000,50",
    estaDisponible: true,
    orden: "40",
  };

  it("normaliza SKU, precio y orden", () => {
    const resultado = validarVariante({
      ...varianteValida,
      sku: "  REM-XL-001  ",
    });

    expect(resultado).toEqual({
      success: true,
      data: {
        ...varianteValida,
        sku: "REM-XL-001",
        precioEspecifico: "28000.50",
        orden: 40,
      },
    });
  });

  it("convierte SKU y precio vacíos a null", () => {
    const resultado = validarVariante({
      ...varianteValida,
      sku: "",
      precioEspecifico: " ",
      estaDisponible: false,
    });

    expect(resultado).toEqual({
      success: true,
      data: {
        ...varianteValida,
        sku: null,
        precioEspecifico: null,
        estaDisponible: false,
        orden: 40,
      },
    });
  });

  it("rechaza SKU inseguro, precio y orden inválidos", () => {
    const resultado = validarVariante({
      ...varianteValida,
      sku: "SKU con espacios",
      precioEspecifico: "10.999",
      orden: "-1",
    });

    expect(resultado.success).toBe(false);
    if (!resultado.success) {
      expect(resultado.error.issues.map((issue) => issue.path[0])).toEqual(
        expect.arrayContaining(["sku", "precioEspecifico", "orden"]),
      );
    }
  });
});
