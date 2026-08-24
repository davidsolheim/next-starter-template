import { pgTable, text, timestamp, integer, jsonb, index } from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"
import { cmsEntries } from "./cms-entries"
import { users } from "./users"

export const cmsRevisions = pgTable("cms_revisions", {
  id: text("id").primaryKey(),
  entryId: text("entry_id").notNull().references(() => cmsEntries.id, { onDelete: "cascade" }),
  revisionNumber: integer("revision_number").notNull(),
  snapshot: jsonb("snapshot").notNull(),
  createdByUserId: text("created_by_user_id").references(() => users.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  entryRevisionIdx: index("idx_cms_revisions_entry_revision").on(table.entryId, table.revisionNumber),
}))

export const cmsRevisionsRelations = relations(cmsRevisions, ({ one }) => ({
  entry: one(cmsEntries, {
    fields: [cmsRevisions.entryId],
    references: [cmsEntries.id],
  }),
}))

export type CmsRevision = typeof cmsRevisions.$inferSelect
export type NewCmsRevision = typeof cmsRevisions.$inferInsert
