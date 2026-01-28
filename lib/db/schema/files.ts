import { relations } from "drizzle-orm"
import { pgTable, text, timestamp, integer, index } from "drizzle-orm/pg-core"
import { organizations } from "./organizations"
import { projects } from "./projects"
import { users } from "./users"

export const files = pgTable("files", {
  id: text("id").primaryKey(),
  orgId: text("org_id").notNull().references(() => organizations.id, { onDelete: "cascade" }),
  projectId: text("project_id").references(() => projects.id, { onDelete: "set null" }),
  ownerId: text("owner_id").references(() => users.id, { onDelete: "set null" }),
  storageKey: text("storage_key").notNull(),
  url: text("url").notNull(),
  mimeType: text("mime_type"),
  size: integer("size"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  deletedAt: timestamp("deleted_at"),
}, (table) => ({
  orgIdx: index("idx_files_org_id").on(table.orgId),
  ownerIdx: index("idx_files_owner_id").on(table.ownerId),
  projectIdx: index("idx_files_project_id").on(table.projectId),
}))

export const filesRelations = relations(files, ({ one }) => ({
  organization: one(organizations, {
    fields: [files.orgId],
    references: [organizations.id],
  }),
  project: one(projects, {
    fields: [files.projectId],
    references: [projects.id],
  }),
  owner: one(users, {
    fields: [files.ownerId],
    references: [users.id],
  }),
}))

export type File = typeof files.$inferSelect
export type NewFile = typeof files.$inferInsert
