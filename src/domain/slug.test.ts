import { describe, expect, it } from "vitest";

import { generarSlug } from "./slug";

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

  it("sirve para nombres de bandas con símbolos", () => {
    expect(generarSlug("AC/DC & Motörhead")).toBe("ac-dc-motorhead");
  });
});
