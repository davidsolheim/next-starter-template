process.env.DATABASE_URL ??= "postgresql://ci:ci@localhost:5432/ci"
process.env.AUTH_SECRET ??= "ci-placeholder-secret-minimum-32-characters"

import { describe, expect, test } from "bun:test"
import { z } from "zod"
import { parseJson } from "@/lib/api/helpers"
import { parsePagination } from "@/lib/api/pagination"
import { hasCapability, sanitizeCapabilities } from "@/lib/auth/capabilities-pure"
import {
  isAdminPagePath,
  isAccountPagePath,
  shouldRedirectForMustChangePassword,
  shouldRejectApiForMustChangePassword,
} from "@/lib/auth/must-change-password-pure"
import { passwordChangeRequiredResponse } from "@/lib/api/helpers"

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

describe("mustChangePassword path gates", () => {
  test("HTML redirect is /admin pages except /admin/account, not /api/admin", () => {
    expect(isAdminPagePath("/admin")).toBe(true)
    expect(isAdminPagePath("/admin/content")).toBe(true)
    expect(isAdminPagePath("/api/admin/cms")).toBe(false)
    expect(isAccountPagePath("/admin/account")).toBe(true)
    expect(shouldRedirectForMustChangePassword("/admin")).toBe(true)
    expect(shouldRedirectForMustChangePassword("/admin/content")).toBe(true)
    expect(shouldRedirectForMustChangePassword("/admin/account")).toBe(false)
    expect(shouldRedirectForMustChangePassword("/admin/account/security")).toBe(false)
    expect(shouldRedirectForMustChangePassword("/api/admin/cms")).toBe(false)
    expect(shouldRedirectForMustChangePassword("/api/admin/change-password")).toBe(false)
  })

  test("CMS APIs except change-password are blocked", () => {
    expect(shouldRejectApiForMustChangePassword("/api/admin/cms")).toBe(true)
    expect(shouldRejectApiForMustChangePassword("/api/admin/media")).toBe(true)
    expect(shouldRejectApiForMustChangePassword("/api/upload")).toBe(true)
    expect(shouldRejectApiForMustChangePassword("/api/admin/change-password")).toBe(false)
    expect(shouldRejectApiForMustChangePassword("/admin/content")).toBe(false)
    expect(shouldRejectApiForMustChangePassword("/admin/account")).toBe(false)
  })

  test("passwordChangeRequiredResponse is 403", async () => {
    const response = passwordChangeRequiredResponse()
    expect(response.status).toBe(403)
    const body = await response.json()
    expect(body.error).toBe("Password change required.")
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
