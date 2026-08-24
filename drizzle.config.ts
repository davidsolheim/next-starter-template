import { defineConfig } from "drizzle-kit"

export default defineConfig({
  schema: "./lib/db/schema",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL || process.env.NEON_DATABASE_URL!,
  },
  verbose: true,
  strict: true,
})
