import { NeonDatabase } from "drizzle-orm/neon-serverless"
import { sql } from "drizzle-orm"
import { db } from "./index"
import * as schema from "./schema"

/**
 * Context for Row Level Security operations
 */
export type RLSContext = {
  role: 'admin' | 'anon'
  userId?: string
  session?: any
}

/**
 * Executes database operations within a transaction that sets the RLS context.
 * This is the reliable way to use RLS with Neon.
 * 
 * @param context The RLS context (role, userId)
 * @param operation The database operations to perform
 */
export async function withRLS<T>(
  context: RLSContext,
  operation: (db: NeonDatabase<typeof schema>) => Promise<T>
): Promise<T> {
  const claims = {
    role: context.role,
    user_id: context.userId,
    sub: context.userId,
  }

  const claimsJson = JSON.stringify(claims).replace(/'/g, "''")

  // Use Drizzle's transaction to ensure SET LOCAL and queries are sent in the same session
  return await db.transaction(async (tx) => {
    // Use sql.raw to avoid parameterization - SET LOCAL doesn't support $1 params
    await tx.execute(sql.raw(`SET LOCAL request.jwt.claims = '${claimsJson}'`))
    return await operation(tx as any)
  })
}

/**
 * Creates an authenticated database context for admin operations
 */
export async function withAdmin<T>(
  session: any,
  operation: (db: NeonDatabase<typeof schema>) => Promise<T>
): Promise<T> {
  if (!session?.user?.id) {
    throw new Error('Invalid session: no user ID found')
  }

  return withRLS(
    {
      role: 'admin',
      userId: session.user.id,
      session,
    },
    operation
  )
}

/**
 * Creates an anonymous database context for public operations
 */
export async function withAnon<T>(
  operation: (db: NeonDatabase<typeof schema>) => Promise<T>
): Promise<T> {
  return withRLS(
    {
      role: 'anon',
    },
    operation
  )
}

/**
 * Wrapper for executing database operations with proper RLS context
 */
export const rlsHelpers = {
  withAdmin,
  withAnon,
}