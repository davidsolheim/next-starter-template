import { config } from "dotenv"
import { Pool } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-serverless"
import * as schema from "./schema"

// Load environment variables
config({ path: ".env.local" })
config({ path: ".env" })

const connectionString = process.env.DATABASE_URL || process.env.NEON_DATABASE_URL!

// Use WebSocket-based pool for transaction and session support (required for RLS)
const pool = new Pool({ connectionString })
export const db = drizzle(pool, { schema })

// For raw SQL if needed
export const sql = (strings: TemplateStringsArray, ...params: any[]) => {
  return pool.query(strings.join('?'), params)
}

// RLS-aware database helpers
export { rlsHelpers } from "./rls-context"

