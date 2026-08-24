import { pgTable, text, timestamp, integer, index, uniqueIndex } from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"
import { mediaAssets } from "./media-assets"

export const mediaUsages = pgTable("media_usages", {
  id: text("id").primaryKey(),
  assetId: text("asset_id").notNull().references(() => mediaAssets.id, { onDelete: "cascade" }),
  entityType: text("entity_type").notNull(),
  entityId: text("entity_id").notNull(),
  fieldKey: text("field_key").notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  assetIdx: index("idx_media_usages_asset").on(table.assetId),
  entityIdx: index("idx_media_usages_entity").on(table.entityType, table.entityId),
  entityFieldAssetUniqueIdx: uniqueIndex("uq_media_usages_entity_field_asset").on(
    table.entityType,
    table.entityId,
    table.fieldKey,
    table.assetId,
  ),
}))

export const mediaUsagesRelations = relations(mediaUsages, ({ one }) => ({
  asset: one(mediaAssets, {
    fields: [mediaUsages.assetId],
    references: [mediaAssets.id],
  }),
}))

export type MediaUsage = typeof mediaUsages.$inferSelect
export type NewMediaUsage = typeof mediaUsages.$inferInsert
