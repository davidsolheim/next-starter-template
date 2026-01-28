import { relations } from "drizzle-orm"
import { pgTable, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core"
import { projects } from "./projects"
import { memberships } from "./memberships"

export const projectMemberships = pgTable("project_memberships", {
  id: text("id").primaryKey(),
  projectId: text("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
  membershipId: text("membership_id").notNull().references(() => memberships.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  projectMembershipIdx: uniqueIndex("idx_project_memberships_project_membership").on(
    table.projectId,
    table.membershipId,
  ),
}))

export const projectMembershipsRelations = relations(projectMemberships, ({ one }) => ({
  project: one(projects, {
    fields: [projectMemberships.projectId],
    references: [projects.id],
  }),
  membership: one(memberships, {
    fields: [projectMemberships.membershipId],
    references: [memberships.id],
  }),
}))

export type ProjectMembership = typeof projectMemberships.$inferSelect
export type NewProjectMembership = typeof projectMemberships.$inferInsert
