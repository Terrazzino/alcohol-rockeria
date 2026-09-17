import "server-only";

import { crearClientePrisma } from "@/lib/crear-cliente-prisma";

const urlBaseDeDatos = process.env.DATABASE_URL;

if (!urlBaseDeDatos) {
  throw new Error("Falta la variable de entorno DATABASE_URL.");
}

const globalPrisma = globalThis as unknown as {
  clientePrisma?: ReturnType<typeof crearClientePrisma>;
};

export const clientePrisma =
  globalPrisma.clientePrisma ?? crearClientePrisma(urlBaseDeDatos);

if (process.env.NODE_ENV !== "production") {
  globalPrisma.clientePrisma = clientePrisma;
}
