import { relations } from "drizzle-orm"
import { pgTable, text, timestamp, index } from "drizzle-orm/pg-core"
import { tags } from "./tags"

export const taggings = pgTable("taggings", {
  id: text("id").primaryKey(),
  tagId: text("tag_id").notNull().references(() => tags.id, { onDelete: "cascade" }),
  entityType: text("entity_type").notNull(),
  entityId: text("entity_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  entityIdx: index("idx_taggings_entity").on(table.entityType, table.entityId),
}))

export const taggingsRelations = relations(taggings, ({ one }) => ({
  tag: one(tags, {
    fields: [taggings.tagId],
    references: [tags.id],
  }),
}))

export type Tagging = typeof taggings.$inferSelect
export type NewTagging = typeof taggings.$inferInsert
