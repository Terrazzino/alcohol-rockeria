import { describe, expect, it } from "vitest";

import { normalizarConfiguracionPublica } from "./inicio";

const configuracion = {
  nombreTienda: "  Alcohol Rockería  ",
  tituloPrincipal: "  Desde 1990 junto al Rock  ",
  subtituloPrincipal: "La primer rockería de Rosario",
  numeroWhatsapp: "+54 9 341 555-1234",
  urlInstagram: "https://instagram.com/alcoholrockeria",
  direccion: "Córdoba 1234, Rosario",
  urlMaps: "https://maps.app.goo.gl/ejemplo",
  horarios: "Lunes a sábados de 10 a 19",
  textoHistoria: "Más de tres décadas junto al rock.",
  textoContacto: "Consultanos por disponibilidad.",
};

describe("normalizarConfiguracionPublica", () => {
  it("valida y normaliza la configuración administrada", () => {
    expect(normalizarConfiguracionPublica(configuracion)).toEqual({
      ...configuracion,
      nombreTienda: "Alcohol Rockería",
      tituloPrincipal: "Desde 1990 junto al Rock",
      numeroWhatsapp: "5493415551234",
    });
  });

  it("descarta configuraciones ausentes o inválidas", () => {
    expect(normalizarConfiguracionPublica(null)).toBeNull();
    expect(
      normalizarConfiguracionPublica({
        ...configuracion,
        urlInstagram: "javascript:alert(1)",
      }),
    ).toBeNull();
  });
});
