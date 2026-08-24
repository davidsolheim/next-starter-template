import { Pool } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-serverless"
import * as schema from "./schema"

const connectionString = process.env.DATABASE_URL || process.env.NEON_DATABASE_URL!

const pool = new Pool({ connectionString })
export const db = drizzle(pool, { schema })
