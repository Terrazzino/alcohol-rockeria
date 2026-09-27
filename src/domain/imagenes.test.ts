import { describe, expect, it } from "vitest";

import {
  TAMANO_MAXIMO_IMAGEN,
  validarArchivoImagen,
  validarDatosImagen,
} from "./imagenes";

describe("validarArchivoImagen", () => {
  it("acepta los formatos configurados dentro del límite", () => {
    expect(
      validarArchivoImagen({ size: TAMANO_MAXIMO_IMAGEN, type: "image/webp" }),
    ).toBeNull();
  });

  it("rechaza formatos no permitidos", () => {
    expect(validarArchivoImagen({ size: 100, type: "image/svg+xml" })).toMatch(
      /JPEG, PNG, WebP o AVIF/,
    );
  });

  it("rechaza archivos vacíos y demasiado grandes", () => {
    expect(validarArchivoImagen({ size: 0, type: "image/jpeg" })).toBeTruthy();
    expect(
      validarArchivoImagen({
        size: TAMANO_MAXIMO_IMAGEN + 1,
        type: "image/jpeg",
      }),
    ).toMatch(/4 MB/);
  });
});

describe("validarDatosImagen", () => {
  it("normaliza los datos editables", () => {
    const resultado = validarDatosImagen({
      textoAlternativo: "  Remera negra de frente  ",
      orden: "2",
      esPrincipal: false,
    });

    expect(resultado.success).toBe(true);
    if (resultado.success) {
      expect(resultado.data).toEqual({
        textoAlternativo: "Remera negra de frente",
        orden: 2,
        esPrincipal: false,
      });
    }
  });

  it("rechaza alt vacío y orden negativo", () => {
    expect(
      validarDatosImagen({
        textoAlternativo: " ",
        orden: -1,
        esPrincipal: false,
      }).success,
    ).toBe(false);
  });
});
