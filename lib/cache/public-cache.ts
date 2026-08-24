import { revalidateTag } from "next/cache"

export const PUBLIC_CACHE_TAGS = {
  pages: "public:pages",
  articles: "public:articles",
  media: "public:media",
  sitemap: "public:sitemap",
  robots: "public:robots",
} as const

export const PUBLIC_INVALIDATION_SCOPES = {
  pages: [PUBLIC_CACHE_TAGS.pages, PUBLIC_CACHE_TAGS.sitemap, PUBLIC_CACHE_TAGS.robots],
  articles: [PUBLIC_CACHE_TAGS.articles, PUBLIC_CACHE_TAGS.sitemap, PUBLIC_CACHE_TAGS.robots],
  media: [PUBLIC_CACHE_TAGS.media, PUBLIC_CACHE_TAGS.pages, PUBLIC_CACHE_TAGS.articles],
} as const

export type PublicInvalidationScope = keyof typeof PUBLIC_INVALIDATION_SCOPES

export function revalidatePublic(scope: PublicInvalidationScope) {
  for (const tag of PUBLIC_INVALIDATION_SCOPES[scope]) {
    revalidateTag(tag, "max")
  }
}
