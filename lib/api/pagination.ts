/**
 * Parse `limit`/`offset` query params with sane bounds so list endpoints never
 * return an unbounded result set. `limit` is clamped to [1, maxLimit].
 */
export function parsePagination(
  searchParams: URLSearchParams,
  { defaultLimit = 20, maxLimit = 100 }: { defaultLimit?: number; maxLimit?: number } = {},
): { limit: number; offset: number } {
  const rawLimit = Number(searchParams.get("limit"))
  const rawOffset = Number(searchParams.get("offset"))
  const limit = Number.isFinite(rawLimit) && rawLimit > 0 ? Math.min(rawLimit, maxLimit) : defaultLimit
  const offset = Number.isFinite(rawOffset) && rawOffset > 0 ? Math.floor(rawOffset) : 0
  return { limit, offset }
}
