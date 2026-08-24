import { createHash } from "crypto"
import { sql } from "drizzle-orm"
import { db } from "@/lib/db"

type LimitInput = { key: string; max: number; windowMs: number }

export type RateLimitResult = {
  allowed: boolean
  remaining: number
  retryAfterMs?: number
}

const memoryStore = new Map<string, { count: number; resetAt: number }>()

function storageKey(key: string) {
  return createHash("sha256").update(key).digest("hex")
}

export function checkMemoryRateLimit(input: LimitInput): RateLimitResult {
  const now = Date.now()
  const key = storageKey(input.key)
  const current = memoryStore.get(key)

  if (!current || current.resetAt <= now) {
    memoryStore.set(key, { count: 1, resetAt: now + input.windowMs })
    return { allowed: true, remaining: input.max - 1 }
  }

  if (current.count >= input.max) {
    return { allowed: false, remaining: 0, retryAfterMs: current.resetAt - now }
  }

  current.count += 1
  return { allowed: true, remaining: input.max - current.count }
}

export function resetMemoryRateLimits() {
  memoryStore.clear()
}

export async function checkRateLimit(input: LimitInput): Promise<RateLimitResult> {
  const resetAt = new Date(Date.now() + input.windowMs)
  const key = storageKey(input.key)

  try {
    const result = await db.execute(sql`
      insert into rate_limit_buckets ("key", request_count, reset_at, created_at, updated_at)
      values (${key}, 1, ${resetAt}, now(), now())
      on conflict ("key") do update set
        request_count = case
          when rate_limit_buckets.reset_at <= now() then 1
          else rate_limit_buckets.request_count + 1
        end,
        reset_at = case
          when rate_limit_buckets.reset_at <= now() then ${resetAt}
          else rate_limit_buckets.reset_at
        end,
        updated_at = now()
      returning request_count, reset_at
    `)
    const rows = Array.isArray(result) ? result : (result as { rows?: unknown[] }).rows
    const row = Array.isArray(rows) ? (rows[0] as { request_count: number; reset_at: Date | string } | undefined) : undefined
    if (!row) return checkMemoryRateLimit(input)

    const requestCount = Number(row.request_count)
    const rowResetAt = new Date(row.reset_at).getTime()
    if (requestCount > input.max) {
      return { allowed: false, remaining: 0, retryAfterMs: Math.max(1, rowResetAt - Date.now()) }
    }
    return { allowed: true, remaining: Math.max(0, input.max - requestCount) }
  } catch {
    return checkMemoryRateLimit(input)
  }
}
