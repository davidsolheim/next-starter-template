import { pgTable, text, timestamp, integer, index, uniqueIndex, jsonb } from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"
import { locales } from "./locales"
import { users } from "./users"
import { mediaKind } from "./enums"
import { mediaUsages } from "./media-usages"

export const mediaAssets = pgTable("media_assets", {
  id: text("id").primaryKey(),
  storageUrl: text("storage_url").notNull(),
  storageKey: text("storage_key").notNull(),
  thumbnailUrl: text("thumbnail_url"),
  thumbnailKey: text("thumbnail_key"),
  filename: text("filename").notNull(),
  title: text("title"),
  description: text("description"),
  sourceCredit: text("source_credit"),
  tags: jsonb("tags").$type<string[]>().default([]).notNull(),
  contentType: text("content_type"),
  sizeBytes: integer("size_bytes"),
  width: integer("width"),
  height: integer("height"),
  focalX: integer("focal_x"),
  focalY: integer("focal_y"),
  kind: mediaKind("kind").default("image").notNull(),
  altText: text("alt_text"),
  localeId: text("locale_id").references(() => locales.id, { onDelete: "set null" }),
  uploadedByUserId: text("uploaded_by_user_id").references(() => users.id, { onDelete: "set null" }),
  archivedAt: timestamp("archived_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  storageKeyUniqueIdx: uniqueIndex("uq_media_assets_storage_key").on(table.storageKey),
  kindIdx: index("idx_media_assets_kind").on(table.kind),
  archivedIdx: index("idx_media_assets_archived").on(table.archivedAt),
}))

export const mediaAssetsRelations = relations(mediaAssets, ({ many, one }) => ({
  usages: many(mediaUsages),
  locale: one(locales, {
    fields: [mediaAssets.localeId],
    references: [locales.id],
  }),
}))

export type MediaAsset = typeof mediaAssets.$inferSelect
export type NewMediaAsset = typeof mediaAssets.$inferInsert
