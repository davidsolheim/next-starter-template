import { describe, expect, test } from "bun:test"
import { existsSync, readFileSync } from "node:fs"
import { join } from "node:path"

const root = join(import.meta.dir, "..")

function read(rel: string) {
  return readFileSync(join(root, rel), "utf8")
}

describe("source invariants", () => {
  test("proxy sends unauthenticated admin users to /login with callbackUrl", () => {
    const proxy = read("proxy.ts")
    expect(proxy).toContain('new URL("/login", request.url)')
    expect(proxy).not.toContain('new URL("/admin/login"')
    expect(proxy).toContain('searchParams.set("callbackUrl"')
  })

  test("auth client uses same-origin relative /api URLs", () => {
    const client = read("lib/auth-client.ts")
    expect(client).toContain('fetch("/api/auth/forgot-password"')
    expect(client).toContain('fetch("/api/auth/reset-password"')
    expect(client).toContain('fetch("/api/admin/change-password"')
    expect(client).not.toContain("localhost:3000")
    expect(client).not.toContain("NEXT_PUBLIC_BASE_URL")
  })

  test("package.json pins versions and drops crypto packages", () => {
    const pkg = JSON.parse(read("package.json")) as {
      dependencies: Record<string, string>
      devDependencies: Record<string, string>
    }
    const versions = [...Object.values(pkg.dependencies), ...Object.values(pkg.devDependencies)]
    expect(versions.some((v) => v === "latest" || v === "beta")).toBe(false)
    expect(pkg.dependencies.crypto).toBeUndefined()
    expect(pkg.dependencies.webcrypto).toBeUndefined()
    expect(pkg.dependencies.stripe).toBeUndefined()
  })

  test("gitignore does not ignore .env.example", () => {
    const gitignore = read(".gitignore")
    expect(gitignore).toContain(".env*")
    expect(gitignore).toContain("!.env.example")
    expect(existsSync(join(root, ".env.example"))).toBe(true)
  })

  test("error pages exist and global-error owns html/body", () => {
    expect(existsSync(join(root, "app/error.tsx"))).toBe(true)
    expect(existsSync(join(root, "app/not-found.tsx"))).toBe(true)
    const globalError = read("app/global-error.tsx")
    expect(globalError).toContain("<html")
    expect(globalError).toContain("<body")
  })

  test("upload route requires a session", () => {
    const upload = read("app/api/upload/route.ts")
    const media = read("app/api/admin/media/route.ts")
    expect(upload).toContain("api/admin/media")
    expect(media).toContain("requireUserId")
  })

  test("sitemap does not advertise /admin", () => {
    expect(read("app/sitemap.ts")).not.toContain("/admin")
  })

  test("hardcoded personal admin email is gone", () => {
    const forgot = read("app/(auth)/forgot-password/page.tsx")
    expect(forgot).not.toContain("admin@davidsolheim.com")
  })

  test("package is MIT licensed with a LICENSE file", () => {
    const pkg = JSON.parse(read("package.json")) as { license?: string }
    expect(pkg.license).toBe("MIT")
    const license = read("LICENSE")
    expect(license).toContain("MIT License")
    expect(license).toContain("David Solheim")
  })

  test("seed script exists", () => {
    expect(existsSync(join(root, "scripts/seed-admin.ts"))).toBe(true)
  })

  test("seed script upserts default en locale", () => {
    const seed = read("scripts/seed-admin.ts")
    expect(seed).toContain("locales")
    expect(seed).toContain('code: "en"')
    expect(seed).toContain('name: "English"')
    expect(seed).toContain("isDefault: true")
    expect(seed).toContain(".select")
    expect(seed).toContain(".from(locales)")
    expect(seed).toContain(".insert(locales)")
    expect(seed).toContain(".update(locales)")
    expect(seed).toContain("eq(locales.isDefault, true)")
    expect(seed).toContain('eq(locales.code, "en")')
    expect(seed).toContain("await seedDefaultLocale()")
    expect(seed).toContain('console.log("Default locale already present")')
    expect(seed).toContain('console.log("Default locale en already present")')
    expect(seed).toContain('console.log("Created default locale en")')
  })
})
