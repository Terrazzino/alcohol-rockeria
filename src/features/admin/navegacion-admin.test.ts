import { describe, expect, it } from "vitest";

import { esRutaAdminActiva } from "./navegacion-admin";

describe("esRutaAdminActiva", () => {
  it("activa el dashboard solamente en la raíz administrativa", () => {
    expect(esRutaAdminActiva("/admin", "/admin")).toBe(true);
    expect(esRutaAdminActiva("/admin/productos", "/admin")).toBe(false);
  });

  it("activa una sección en su ruta y en rutas descendientes", () => {
    expect(esRutaAdminActiva("/admin/categorias", "/admin/categorias")).toBe(
      true,
    );
    expect(
      esRutaAdminActiva("/admin/categorias/nueva", "/admin/categorias"),
    ).toBe(true);
  });

  it("no confunde rutas que comparten un prefijo parcial", () => {
    expect(
      esRutaAdminActiva("/admin/productos-archivados", "/admin/productos"),
    ).toBe(false);
  });
});
