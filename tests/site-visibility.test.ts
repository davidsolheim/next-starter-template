import { describe, expect, test } from "bun:test"
import {
  isPreviewDeployment,
  isSearchIndexingAllowed,
  isSearchIndexingEnabled,
  getCanonicalSiteUrl,
} from "@/lib/site-visibility"

describe("site visibility", () => {
  test("indexing is off unless SEARCH_INDEXING_ENABLED=true", () => {
    expect(isSearchIndexingEnabled({ SEARCH_INDEXING_ENABLED: "false" })).toBe(false)
    expect(isSearchIndexingEnabled({ SEARCH_INDEXING_ENABLED: "true" })).toBe(true)
  })

  test("preview deployments are never indexable", () => {
    expect(isPreviewDeployment({ VERCEL_ENV: "preview" })).toBe(true)
    expect(
      isSearchIndexingAllowed({ VERCEL_ENV: "preview", SEARCH_INDEXING_ENABLED: "true" }),
    ).toBe(false)
  })

  test("canonical URL trims trailing slashes", () => {
    expect(getCanonicalSiteUrl({ NEXT_PUBLIC_SITE_URL: "https://example.com/" })).toBe(
      "https://example.com",
    )
  })
})
