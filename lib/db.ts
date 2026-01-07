import { db as drizzleDb, sql } from "@/lib/db/index"

export { sql }
export { drizzleDb }

// Database helper functions
// Add your custom database helpers here as needed

// Export as 'db' for backward compatibility
export const db = {
  // Add your database helpers here
}
