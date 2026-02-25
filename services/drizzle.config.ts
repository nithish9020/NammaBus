import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema/index.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.NEON_DATABASE_URL!,
  },
  schemaFilter: ["public"],
  migrations: {
    schema: "public",
  },
});
