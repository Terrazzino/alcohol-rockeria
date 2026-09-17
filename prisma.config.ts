import { config } from "dotenv";
import { defineConfig } from "prisma/config";

config({ path: ".env.local", quiet: true });
config({ quiet: true });

const urlMigraciones =
  process.env.DIRECT_URL ??
  process.env.DATABASE_URL ??
  "postgresql://usuario:clave@localhost:5432/alcohol_rockeria";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: urlMigraciones,
  },
});
