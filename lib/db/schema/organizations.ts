import { relations } from "drizzle-orm"
import { pgTable, text, timestamp, index, uniqueIndex } from "drizzle-orm/pg-core"
import { users } from "./users"
import { memberships } from "./memberships"
import { auditLogs } from "./audit-logs"
import { notifications } from "./notifications"
import { files } from "./files"

export const organizations = pgTable("organizations", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  createdBy: text("created_by").references(() => users.id),
  updatedBy: text("updated_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  deletedAt: timestamp("deleted_at"),
}, (table) => ({
  slugIdx: uniqueIndex("idx_orgs_slug").on(table.slug),
  nameIdx: index("idx_orgs_name").on(table.name),
}))

export const organizationsRelations = relations(organizations, ({ many, one }) => ({
  createdByUser: one(users, {
    fields: [organizations.createdBy],
    references: [users.id],
  }),
  updatedByUser: one(users, {
    fields: [organizations.updatedBy],
    references: [users.id],
  }),
  memberships: many(memberships),
  auditLogs: many(auditLogs),
  notifications: many(notifications),
  files: many(files),
}))

export type Organization = typeof organizations.$inferSelect
export type NewOrganization = typeof organizations.$inferInsert
