import { MetadataRoute } from "next"
import { getCanonicalSiteUrl, isSearchIndexingAllowed } from "@/lib/site-visibility"

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getCanonicalSiteUrl()
  if (!isSearchIndexingAllowed()) {
    return {
      rules: [{ userAgent: "*", disallow: "/" }],
    }
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/", "/login", "/forgot-password", "/reset-password"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
