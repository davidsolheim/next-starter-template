import { describe, expect, test } from "bun:test"
import { isReservedSlug, isValidSlug, routeForEntry, slugFromTitle } from "@/lib/cms/slugs"
import { sanitizeCmsHtml } from "@/lib/cms/sanitize"

describe("cms slugs", () => {
  test("slugFromTitle normalizes titles", () => {
    expect(slugFromTitle("Hello World!")).toBe("hello-world")
  })

  test("reserved slugs cannot be CMS pages", () => {
    expect(isReservedSlug("admin")).toBe(true)
    expect(isReservedSlug("about")).toBe(false)
    expect(isValidSlug("about-us")).toBe(true)
    expect(isValidSlug("Nope")).toBe(false)
  })

  test("routeForEntry prefixes articles", () => {
    expect(routeForEntry("page", "about")).toBe("/about")
    expect(routeForEntry("article", "hello")).toBe("/articles/hello")
  })
})

describe("cms html sanitizer", () => {
  test("strips script tags", () => {
    expect(sanitizeCmsHtml('<p>Hi</p><script>alert(1)</script>')).toBe("<p>Hi</p>")
  })
})
