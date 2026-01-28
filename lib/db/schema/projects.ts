import { relations } from "drizzle-orm"
import { pgTable, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core"
import { organizations } from "./organizations"
import { users } from "./users"
import { projectMemberships } from "./project-memberships"
import { files } from "./files"

export const projects = pgTable("projects", {
  id: text("id").primaryKey(),
  orgId: text("org_id").notNull().references(() => organizations.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  createdBy: text("created_by").references(() => users.id),
  updatedBy: text("updated_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  deletedAt: timestamp("deleted_at"),
}, (table) => ({
  orgSlugIdx: uniqueIndex("idx_projects_org_slug").on(table.orgId, table.slug),
}))

export const projectsRelations = relations(projects, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [projects.orgId],
    references: [organizations.id],
  }),
  createdByUser: one(users, {
    fields: [projects.createdBy],
    references: [users.id],
  }),
  updatedByUser: one(users, {
    fields: [projects.updatedBy],
    references: [users.id],
  }),
  memberships: many(projectMemberships),
  files: many(files),
}))

export type Project = typeof projects.$inferSelect
export type NewProject = typeof projects.$inferInsert
