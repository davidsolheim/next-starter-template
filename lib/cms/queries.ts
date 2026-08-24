import { and, desc, eq } from "drizzle-orm"
import { db } from "@/lib/db"
import { cmsEntries, locales, mediaAssets } from "@/lib/db/schema"

export async function getDefaultLocaleId() {
  const rows = await db.select().from(locales).where(eq(locales.isDefault, true)).limit(1)
  if (rows[0]) return rows[0].id
  const any = await db.select().from(locales).limit(1)
  return any[0]?.id ?? null
}

export async function getPublishedEntryByPath(routePath: string) {
  const rows = await db
    .select({
      entry: cmsEntries,
      heroUrl: mediaAssets.storageUrl,
      heroAlt: mediaAssets.altText,
    })
    .from(cmsEntries)
    .leftJoin(mediaAssets, eq(cmsEntries.heroMediaId, mediaAssets.id))
    .where(and(eq(cmsEntries.routePath, routePath), eq(cmsEntries.status, "published")))
    .limit(1)
  if (!rows.length) return null
  return rows[0]
}

export type PublishedCmsRow = NonNullable<Awaited<ReturnType<typeof getPublishedEntryByPath>>>

export async function listPublishedEntries(entryType: "page" | "article") {
  return db
    .select()
    .from(cmsEntries)
    .where(and(eq(cmsEntries.entryType, entryType), eq(cmsEntries.status, "published")))
    .orderBy(desc(cmsEntries.publishedAt))
}
