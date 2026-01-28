import { relations } from "drizzle-orm"
import { pgTable, text, timestamp, index } from "drizzle-orm/pg-core"
import { organizations } from "./organizations"
import { users } from "./users"

export const comments = pgTable("comments", {
  id: text("id").primaryKey(),
  orgId: text("org_id").notNull().references(() => organizations.id, { onDelete: "cascade" }),
  authorId: text("author_id").references(() => users.id, { onDelete: "set null" }),
  entityType: text("entity_type").notNull(),
  entityId: text("entity_id").notNull(),
  body: text("body").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  entityIdx: index("idx_comments_entity").on(table.entityType, table.entityId),
  authorIdx: index("idx_comments_author_id").on(table.authorId),
}))

export const commentsRelations = relations(comments, ({ one }) => ({
  organization: one(organizations, {
    fields: [comments.orgId],
    references: [organizations.id],
  }),
  author: one(users, {
    fields: [comments.authorId],
    references: [users.id],
  }),
}))

export type Comment = typeof comments.$inferSelect
export type NewComment = typeof comments.$inferInsert
