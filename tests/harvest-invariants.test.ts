import { describe, expect, test } from "bun:test"
import { readFileSync } from "node:fs"
import { join } from "node:path"
import { sanitizeAnalyticsProps } from "@/lib/analytics"
import { checkMemoryRateLimit, resetMemoryRateLimits } from "@/lib/services/rate-limit"

const root = join(import.meta.dir, "..")

function read(rel: string) {
  return readFileSync(join(root, rel), "utf8")
}

describe("harvest invariants", () => {
  test("typecheck script and packageManager are declared", () => {
    const pkg = JSON.parse(read("package.json")) as { scripts: Record<string, string>; packageManager?: string }
    expect(pkg.scripts.typecheck).toContain("tsc")
    expect(pkg.packageManager).toContain("bun")
  })

  test("next.config noindexes admin/api/auth and supports preview noindex", () => {
    const config = read("next.config.mjs")
    expect(config).toContain("/admin/:path*")
    expect(config).toContain("noindex, nofollow")
    expect(config).toContain("SEARCH_INDEXING_ENABLED")
  })

  test("llms.txt and legal/contact routes exist", () => {
    expect(read("app/llms.txt/route.ts")).toContain("text/plain")
    expect(read("app/(public)/privacy/page.tsx")).toContain("Privacy")
    expect(read("app/(public)/terms/page.tsx")).toContain("Terms")
    expect(read("app/(public)/contact/page.tsx")).toContain("/api/contact")
  })

  test("cms and media schema are committed", () => {
    const sql = read("drizzle/0001_cms_media_contact.sql")
    expect(sql).toContain("media_assets")
    expect(sql).toContain("media_usages")
    expect(sql).toContain("cms_entries")
    expect(sql).toContain("cms_revisions")
  })
})

describe("analytics allow-list", () => {
  test("drops unknown keys", () => {
    expect(sanitizeAnalyticsProps({ destination: "/x", email: "a@b.c", token: "nope" })).toEqual({
      destination: "/x",
    })
  })
})

describe("memory rate limit fallback", () => {
  test("blocks after max", () => {
    resetMemoryRateLimits()
    expect(checkMemoryRateLimit({ key: "k", max: 1, windowMs: 60_000 }).allowed).toBe(true)
    expect(checkMemoryRateLimit({ key: "k", max: 1, windowMs: 60_000 }).allowed).toBe(false)
  })
})
