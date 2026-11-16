import { describe, expect, it } from "vitest";

import { normalizarSlugProductoPublico } from "./detalle-producto";

describe("normalizarSlugProductoPublico", () => {
  it("normaliza un slug público válido", () => {
    expect(normalizarSlugProductoPublico("  REMERA-METALLICA  ")).toBe(
      "remera-metallica",
    );
  });

  it("rechaza slugs vacíos, inseguros o demasiado largos", () => {
    expect(normalizarSlugProductoPublico(" ")).toBeNull();
    expect(normalizarSlugProductoPublico("../producto")).toBeNull();
    expect(normalizarSlugProductoPublico("a".repeat(161))).toBeNull();
  });
});
