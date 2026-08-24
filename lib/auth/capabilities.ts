export {
  ADMIN_CAPABILITIES,
  DEFAULT_CAPABILITIES,
  hasCapability,
  roleForCapabilities,
  sanitizeCapabilities,
} from "./capabilities-pure"
export type { Capability, UserRole } from "./capabilities-pure"
import {
  hasCapability,
  sanitizeCapabilities,
  type Capability,
} from "./capabilities-pure"

export async function getUserCapabilities(userId: string): Promise<Capability[]> {
  const [{ db }, { users }, { eq }] = await Promise.all([
    import("@/lib/db"),
    import("@/lib/db/schema"),
    import("drizzle-orm"),
  ])
  const rows = await db
    .select({ capabilities: users.capabilities })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1)

  return sanitizeCapabilities(rows[0]?.capabilities)
}

export async function checkCapability(
  userId: string,
  capability: Capability,
): Promise<boolean> {
  const caps = await getUserCapabilities(userId)
  return hasCapability(caps, capability)
}
