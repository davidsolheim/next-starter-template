import { jsonError } from "@/lib/api/helpers"

/**
 * Lightweight in-memory sliding-window rate limiter for sensitive public routes.
 * Best-effort per instance; pair with platform WAF for global limits.
 */

type Bucket = { count: number; resetAt: number }

const buckets = new Map<string, Bucket>()

function sweep(now: number) {
  if (buckets.size < 5000) return
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key)
  }
}

export function clientKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")
  if (forwarded) return forwarded.split(",")[0]!.trim()
  return (
    request.headers.get("x-real-ip") ??
    request.headers.get("cf-connecting-ip") ??
    "unknown"
  )
}

/**
 * Returns `null` when the request is within the limit, or a 429 `Response` when
 * the limit is exceeded.
 */
export function rateLimit(
  name: string,
  key: string,
  { limit, windowMs }: { limit: number; windowMs: number },
): Response | null {
  const now = Date.now()
  sweep(now)
  const id = `${name}:${key}`
  const bucket = buckets.get(id)

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(id, { count: 1, resetAt: now + windowMs })
    return null
  }

  if (bucket.count >= limit) {
    const retryAfter = Math.max(1, Math.ceil((bucket.resetAt - now) / 1000))
    const response = jsonError("Too many requests. Please try again shortly.", 429)
    response.headers.set("Retry-After", String(retryAfter))
    return response
  }

  bucket.count += 1
  return null
}

export function rateLimitRequest(
  request: Request,
  name: string,
  options: { limit: number; windowMs: number },
): Response | null {
  return rateLimit(name, clientKey(request), options)
}

/** Test helper: drop all in-memory buckets. */
export function resetRateLimitBuckets() {
  buckets.clear()
}
