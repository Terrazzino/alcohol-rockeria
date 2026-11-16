import { describe, expect, it } from "vitest";

import {
  normalizarNumeroWhatsapp,
  validarConfiguracionTienda,
} from "./configuracion-tienda";

const configuracionValida = {
  nombreTienda: "Alcohol Rockería",
  tituloPrincipal: "Desde 1990 junto al Rock",
  subtituloPrincipal: "La primer rockería de Rosario",
  numeroWhatsapp: "+54 9 341 555-1234",
  urlInstagram: "https://www.instagram.com/alcoholrockeria/",
  direccion: "Córdoba 1234, Rosario",
  urlMaps: "https://maps.app.goo.gl/ejemplo",
  horarios: "Lunes a sábados de 10 a 19 hs.",
  textoHistoria: "Más de tres décadas acompañando al rock.",
  textoContacto: "Escribinos para consultar disponibilidad.",
};

describe("normalizarNumeroWhatsapp", () => {
  it("elimina formato visual y conserva los dígitos internacionales", () => {
    expect(normalizarNumeroWhatsapp(" +54 (9) 341-555-1234 ")).toBe(
      "5493415551234",
    );
  });
});

describe("validarConfiguracionTienda", () => {
  it("normaliza textos y WhatsApp", () => {
    const resultado = validarConfiguracionTienda({
      ...configuracionValida,
      nombreTienda: "  Alcohol Rockería  ",
      tituloPrincipal: "  Desde 1990 junto al Rock  ",
    });

    expect(resultado.success).toBe(true);
    if (resultado.success) {
      expect(resultado.data.nombreTienda).toBe("Alcohol Rockería");
      expect(resultado.data.tituloPrincipal).toBe("Desde 1990 junto al Rock");
      expect(resultado.data.numeroWhatsapp).toBe("5493415551234");
    }
  });

  it("acepta Instagram y Maps con HTTPS", () => {
    expect(validarConfiguracionTienda(configuracionValida).success).toBe(true);
  });

  it("rechaza campos obligatorios vacíos", () => {
    const resultado = validarConfiguracionTienda({
      ...configuracionValida,
      nombreTienda: " ",
      horarios: "",
      textoHistoria: "  ",
    });

    expect(resultado.success).toBe(false);
    if (!resultado.success) {
      expect(resultado.error.issues.map((issue) => issue.path[0])).toEqual(
        expect.arrayContaining(["nombreTienda", "horarios", "textoHistoria"]),
      );
    }
  });

  it("rechaza WhatsApp corto, largo o con letras", () => {
    for (const numeroWhatsapp of [
      "1234567",
      "1234567890123456",
      "+54 341 ROCK",
    ]) {
      expect(
        validarConfiguracionTienda({
          ...configuracionValida,
          numeroWhatsapp,
        }).success,
      ).toBe(false);
    }
  });

  it("rechaza protocolos no web y URLs ajenas a Instagram", () => {
    expect(
      validarConfiguracionTienda({
        ...configuracionValida,
        urlMaps: "no-es-una-url",
      }).success,
    ).toBe(false);
    expect(
      validarConfiguracionTienda({
        ...configuracionValida,
        urlMaps: "javascript:alert(1)",
      }).success,
    ).toBe(false);
    expect(
      validarConfiguracionTienda({
        ...configuracionValida,
        urlInstagram: "https://ejemplo.com/alcoholrockeria",
      }).success,
    ).toBe(false);
  });

  it("aplica los límites de longitud definidos", () => {
    expect(
      validarConfiguracionTienda({
        ...configuracionValida,
        nombreTienda: "a".repeat(101),
        textoContacto: "a".repeat(2001),
      }).success,
    ).toBe(false);
  });
});
