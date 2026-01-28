import { relations } from "drizzle-orm"
import { pgTable, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core"
import { organizations } from "./organizations"
import { taggings } from "./taggings"

export const tags = pgTable("tags", {
  id: text("id").primaryKey(),
  orgId: text("org_id").notNull().references(() => organizations.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  color: text("color"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  orgNameIdx: uniqueIndex("idx_tags_org_name").on(table.orgId, table.name),
}))

export const tagsRelations = relations(tags, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [tags.orgId],
    references: [organizations.id],
  }),
  taggings: many(taggings),
}))

export type Tag = typeof tags.$inferSelect
export type NewTag = typeof tags.$inferInsert
