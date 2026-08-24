export type Capability = "admin" | "moderate"

export const DEFAULT_CAPABILITIES: Capability[] = []

export const ADMIN_CAPABILITIES: Capability[] = ["admin", "moderate"]

const ALLOWED_CAPABILITIES = new Set<string>(ADMIN_CAPABILITIES)

/**
 * Coerce an untrusted `capabilities` value (from JSON storage) into a clean list
 * of known capabilities, dropping anything unrecognized. Pure — safe to unit test.
 */
export function sanitizeCapabilities(raw: unknown): Capability[] {
  if (!raw || !Array.isArray(raw)) return [...DEFAULT_CAPABILITIES]
  return raw.filter(
    (c): c is Capability => typeof c === "string" && ALLOWED_CAPABILITIES.has(c),
  )
}

export type UserRole = "admin" | "moderator" | "member"

export function roleForCapabilities(caps: Capability[]): UserRole {
  if (caps.includes("admin")) return "admin"
  return caps.length > 0 ? "moderator" : "member"
}

/** Whether a capability set grants `capability`. `admin` implies all. Pure. */
export function hasCapability(
  caps: Capability[],
  capability: Capability,
): boolean {
  if (caps.includes("admin")) return true
  return caps.includes(capability)
}
