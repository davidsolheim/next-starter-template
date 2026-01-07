import { defineConfig } from "drizzle-kit"
import { config } from "dotenv"

// Load environment variables from .env.local or .env
config({ path: ".env.local" })
config({ path: ".env" })

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

