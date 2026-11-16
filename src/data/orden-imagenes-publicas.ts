import "server-only";

import type { Prisma } from "@/generated/prisma/client";

export const ordenImagenesProductoPublicas = [
  { esPrincipal: "desc" },
  { orden: "asc" },
  { creadoEn: "asc" },
  { id: "asc" },
] satisfies Prisma.ImagenProductoOrderByWithRelationInput[];
