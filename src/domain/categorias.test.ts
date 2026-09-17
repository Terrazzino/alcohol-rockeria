import { describe, expect, it } from "vitest";

import { generarSlug, validarCategoria } from "./categorias";

describe("generarSlug", () => {
  it("normaliza mayúsculas, espacios y tildes", () => {
    expect(generarSlug("Remeras Rock Nacional")).toBe("remeras-rock-nacional");
    expect(generarSlug("  Música y Más  ")).toBe("musica-y-mas");
  });

  it("elimina caracteres especiales y guiones repetidos", () => {
    expect(generarSlug("Rock & Roll --- Rosario!!!")).toBe("rock-roll-rosario");
  });

  it("convierte la eñe a ene", () => {
    expect(generarSlug("Diseños de España")).toBe("disenos-de-espana");
  });
});

describe("validarCategoria", () => {
  const categoriaValida = {
    nombre: "Remeras",
    slug: "remeras",
    descripcion: "Indumentaria rockera",
    urlImagen: "https://ejemplo.com/remeras.webp",
    orden: "0",
    estaVisible: true,
  };

  it("normaliza opcionales vacíos y convierte el orden", () => {
    const resultado = validarCategoria({
      ...categoriaValida,
      descripcion: "   ",
      urlImagen: "",
      orden: "3",
    });

    expect(resultado).toEqual({
      success: true,
      data: {
        ...categoriaValida,
        descripcion: null,
        urlImagen: null,
        orden: 3,
      },
    });
  });

  it("rechaza slugs inválidos", () => {
    const resultado = validarCategoria({
      ...categoriaValida,
      slug: "Remeras--Rock",
    });

    expect(resultado.success).toBe(false);
  });

  it("rechaza orden negativo y decimal", () => {
    expect(validarCategoria({ ...categoriaValida, orden: "-1" }).success).toBe(
      false,
    );
    expect(validarCategoria({ ...categoriaValida, orden: "1.5" }).success).toBe(
      false,
    );
  });

  it("rechaza una URL de imagen inválida", () => {
    const resultado = validarCategoria({
      ...categoriaValida,
      urlImagen: "imagen-local",
    });

    expect(resultado.success).toBe(false);
  });
});
