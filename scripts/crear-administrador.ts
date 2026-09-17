import { hash } from "bcryptjs";
import { config } from "dotenv";

import { validarNuevoAdministrador } from "../src/features/autenticacion/validaciones";

config({ path: ".env.local", quiet: true });
config({ quiet: true });

async function crearAdministrador() {
  const entrada = {
    correo: process.env.ADMIN_CORREO,
    nombre: process.env.ADMIN_NOMBRE ?? "",
    contrasena: process.env.ADMIN_CONTRASENA,
  };

  delete process.env.ADMIN_CONTRASENA;

  const resultado = validarNuevoAdministrador(entrada);

  if (!resultado.exito) {
    const detalle = Object.values(resultado.errores).join(" ");
    throw new Error(
      `Datos de administrador inválidos. ${detalle} Configurá ADMIN_CORREO, ADMIN_CONTRASENA y, opcionalmente, ADMIN_NOMBRE.`,
    );
  }

  const urlBaseDeDatos = process.env.DIRECT_URL ?? process.env.DATABASE_URL;

  if (!urlBaseDeDatos) {
    throw new Error(
      "Falta DIRECT_URL o DATABASE_URL para conectar con PostgreSQL.",
    );
  }

  const { crearClientePrisma } =
    await import("../src/lib/crear-cliente-prisma");
  const clientePrisma = crearClientePrisma(urlBaseDeDatos);

  try {
    const existente = await clientePrisma.administrador.findUnique({
      where: { correo: resultado.datos.correo },
      select: { id: true },
    });

    if (existente) {
      throw new Error("Ya existe un administrador con ese correo.");
    }

    const hashContrasena = await hash(resultado.datos.contrasena, 12);
    const administrador = await clientePrisma.administrador.create({
      data: {
        correo: resultado.datos.correo,
        hashContrasena,
        nombre: resultado.datos.nombre,
      },
      select: {
        correo: true,
        nombre: true,
      },
    });

    console.info(
      `Administrador creado: ${administrador.nombre ?? administrador.correo}.`,
    );
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2002"
    ) {
      throw new Error("Ya existe un administrador con ese correo.");
    }

    throw error;
  } finally {
    await clientePrisma.$disconnect();
  }
}

crearAdministrador().catch((error: unknown) => {
  const mensaje =
    error instanceof Error ? error.message : "Ocurrió un error desconocido.";

  console.error(`No se pudo crear el administrador: ${mensaje}`);
  process.exitCode = 1;
});
