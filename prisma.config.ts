import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  earlyAccess: true,
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "npx tsx prisma/seed.ts",
  },
  datasource: {
    url: process.env.DATABASE_URL!,
    // @ts-expect-error -- directUrl is supported by Prisma but not in the type definitions yet
    directUrl: process.env.DIRECT_URL,
  },
});
