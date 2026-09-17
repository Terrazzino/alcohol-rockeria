import { describe, expect, it } from "vitest";

import {
  normalizarCorreo,
  validarCredenciales,
  validarNuevoAdministrador,
} from "./validaciones";

describe("normalizarCorreo", () => {
  it("quita espacios exteriores y convierte a minúsculas", () => {
    expect(normalizarCorreo("  ADMIN@Alcohol.COM  ")).toBe("admin@alcohol.com");
  });
});

describe("validarCredenciales", () => {
  it("devuelve mensajes en español cuando faltan datos", () => {
    const resultado = validarCredenciales({});

    expect(resultado).toEqual({
      exito: false,
      errores: {
        correo: "Ingresá el correo.",
        contrasena: "Ingresá la contraseña.",
      },
    });
  });

  it("rechaza un correo inválido", () => {
    const resultado = validarCredenciales({
      correo: "correo-invalido",
      contrasena: "una-contrasena-segura",
    });

    expect(resultado.exito).toBe(false);
    if (!resultado.exito) {
      expect(resultado.errores.correo).toBe("Ingresá un correo válido.");
    }
  });

  it("rechaza una contraseña corta", () => {
    const resultado = validarCredenciales({
      correo: "admin@alcohol.com",
      contrasena: "corta",
    });

    expect(resultado.exito).toBe(false);
    if (!resultado.exito) {
      expect(resultado.errores.contrasena).toContain("12 caracteres");
    }
  });

  it("acepta credenciales válidas y normaliza el correo", () => {
    const resultado = validarCredenciales({
      correo: " Admin@Alcohol.com ",
      contrasena: "una-contrasena-segura",
    });

    expect(resultado).toEqual({
      exito: true,
      datos: {
        correo: "admin@alcohol.com",
        contrasena: "una-contrasena-segura",
      },
    });
  });
});

describe("validarNuevoAdministrador", () => {
  it("convierte un nombre vacío en null", () => {
    const resultado = validarNuevoAdministrador({
      correo: "admin@alcohol.com",
      contrasena: "una-contrasena-segura",
      nombre: "   ",
    });

    expect(resultado.exito && resultado.datos.nombre).toBeNull();
  });

  it("rechaza contraseñas que exceden el límite en bytes de bcrypt", () => {
    const resultado = validarNuevoAdministrador({
      correo: "admin@alcohol.com",
      contrasena: "á".repeat(40),
      nombre: "Admin",
    });

    expect(resultado.exito).toBe(false);
    if (!resultado.exito) {
      expect(resultado.errores.contrasena).toContain("72 bytes");
    }
  });
});
