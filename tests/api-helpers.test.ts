process.env.DATABASE_URL ??= "postgresql://ci:ci@localhost:5432/ci"
process.env.AUTH_SECRET ??= "ci-placeholder-secret-minimum-32-characters"

import { describe, expect, test } from "bun:test"
import { z } from "zod"
import { parseJson } from "@/lib/api/helpers"
import { rateLimit, resetRateLimitBuckets } from "@/lib/api/rate-limit"
import { parsePagination } from "@/lib/api/pagination"
import { hasCapability, sanitizeCapabilities } from "@/lib/auth/capabilities-pure"

describe("parseJson", () => {
  test("returns 422 on invalid bodies", async () => {
    const request = new Request("http://localhost/api", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email: 12 }),
    })
    const result = await parseJson(request, z.object({ email: z.string() }))
    expect(result).toBeInstanceOf(Response)
    const response = result as Response
    expect(response.status).toBe(422)
    const body = await response.json()
    expect(body.error).toBeTruthy()
  })

  test("returns parsed data on valid bodies", async () => {
    const request = new Request("http://localhost/api", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email: "you@example.com" }),
    })
    const result = await parseJson(request, z.object({ email: z.string().email() }))
    expect(result).toEqual({ email: "you@example.com" })
  })
})

describe("rateLimit", () => {
  test("returns 429 after the limit and sets Retry-After", () => {
    resetRateLimitBuckets()
    expect(rateLimit("unit", "client-a", { limit: 2, windowMs: 60_000 })).toBeNull()
    expect(rateLimit("unit", "client-a", { limit: 2, windowMs: 60_000 })).toBeNull()
    const blocked = rateLimit("unit", "client-a", { limit: 2, windowMs: 60_000 })
    expect(blocked).toBeInstanceOf(Response)
    expect(blocked!.status).toBe(429)
    expect(blocked!.headers.get("Retry-After")).toBeTruthy()
    const other = rateLimit("unit", "client-b", { limit: 2, windowMs: 60_000 })
    expect(other).toBeNull()
  })
})

describe("capabilities", () => {
  test("admin implies moderate", () => {
    expect(hasCapability(["admin"], "moderate")).toBe(true)
    expect(hasCapability(["admin"], "admin")).toBe(true)
    expect(hasCapability(["moderate"], "admin")).toBe(false)
    expect(hasCapability(["moderate"], "moderate")).toBe(true)
    expect(hasCapability([], "moderate")).toBe(false)
  })

  test("sanitizeCapabilities drops unknown values", () => {
    expect(sanitizeCapabilities(["admin", "narnia", 3])).toEqual(["admin"])
    expect(sanitizeCapabilities(null)).toEqual([])
  })
})

describe("parsePagination", () => {
  test("clamps limit and floors offset", () => {
    expect(parsePagination(new URLSearchParams("limit=9999"), { maxLimit: 100 }).limit).toBe(100)
    expect(parsePagination(new URLSearchParams("limit=-5&offset=-10"))).toEqual({
      limit: 20,
      offset: 0,
    })
  })
})
