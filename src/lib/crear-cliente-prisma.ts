import { PrismaNeon } from "@prisma/adapter-neon";

import { PrismaClient } from "@/generated/prisma/client";

export function crearClientePrisma(urlBaseDeDatos: string) {
  const adaptador = new PrismaNeon({ connectionString: urlBaseDeDatos });

  return new PrismaClient({ adapter: adaptador });
}
