import { afterEach, describe, expect, test } from "bun:test"
import {
  createSiteGateCookieValue,
  isSiteGateEnabled,
  safeSiteGateNext,
  verifySiteGateCookie,
} from "@/lib/site-gate"

const originalVercelEnv = process.env.VERCEL_ENV

afterEach(() => {
  if (originalVercelEnv === undefined) {
    delete process.env.VERCEL_ENV
  } else {
    process.env.VERCEL_ENV = originalVercelEnv
  }
})

describe("site gate", () => {
  test("is disabled when VERCEL_ENV is unset", () => {
    delete process.env.VERCEL_ENV
    expect(isSiteGateEnabled()).toBe(false)
  })

  test("is enabled on Vercel preview and production", () => {
    process.env.VERCEL_ENV = "preview"
    expect(isSiteGateEnabled()).toBe(true)
    process.env.VERCEL_ENV = "production"
    expect(isSiteGateEnabled()).toBe(true)
    process.env.VERCEL_ENV = "development"
    expect(isSiteGateEnabled()).toBe(false)
  })

  test("cookie sign/verify round-trip and rejects tampered values", async () => {
    const secret = "review-password-secret"
    const cookie = await createSiteGateCookieValue(secret)
    expect(await verifySiteGateCookie(cookie, secret)).toBe(true)
    expect(await verifySiteGateCookie(`${cookie}x`, secret)).toBe(false)
    expect(await verifySiteGateCookie(cookie.replace("v1", "v2"), secret)).toBe(false)
    expect(await verifySiteGateCookie(cookie, "other-secret")).toBe(false)
    expect(await verifySiteGateCookie(undefined, secret)).toBe(false)
  })

  test("safeSiteGateNext rejects open redirects", () => {
    expect(safeSiteGateNext("/admin")).toBe("/admin")
    expect(safeSiteGateNext("/admin?tab=users")).toBe("/admin?tab=users")
    expect(safeSiteGateNext("https://evil.example")).toBe("/")
    expect(safeSiteGateNext("//evil.example")).toBe("/")
    expect(safeSiteGateNext(null)).toBe("/")
  })
})
