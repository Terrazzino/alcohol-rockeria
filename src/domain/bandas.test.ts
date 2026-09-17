import { describe, expect, it } from "vitest";

import { validarBanda } from "./bandas";

describe("validarBanda", () => {
  const bandaValida = {
    nombre: "Motörhead",
    slug: "motorhead",
    descripcion: "Banda británica",
    urlImagen: "https://ejemplo.com/motorhead.webp",
    orden: "0",
    estaVisible: true,
  };

  it("normaliza campos opcionales y convierte el orden", () => {
    const resultado = validarBanda({
      ...bandaValida,
      descripcion: "  ",
      urlImagen: "",
      orden: "4",
    });

    expect(resultado).toEqual({
      success: true,
      data: {
        ...bandaValida,
        descripcion: null,
        urlImagen: null,
        orden: 4,
      },
    });
  });

  it("rechaza nombre vacío, slug inválido y orden negativo", () => {
    const resultado = validarBanda({
      ...bandaValida,
      nombre: " ",
      slug: "La Renga",
      orden: "-1",
    });

    expect(resultado.success).toBe(false);
    if (!resultado.success) {
      expect(resultado.error.issues.map((issue) => issue.path[0])).toEqual(
        expect.arrayContaining(["nombre", "slug", "orden"]),
      );
    }
  });

  it("rechaza una URL de imagen inválida", () => {
    expect(
      validarBanda({ ...bandaValida, urlImagen: "archivo-local" }).success,
    ).toBe(false);
  });
});
