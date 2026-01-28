import { relations } from "drizzle-orm"
import { pgTable, text, timestamp, index, uniqueIndex } from "drizzle-orm/pg-core"
import { membershipRole } from "./enums"
import { organizations } from "./organizations"
import { users } from "./users"
import { membershipRoles } from "./membership-roles"
import { teamMemberships } from "./team-memberships"
import { projectMemberships } from "./project-memberships"

export const memberships = pgTable("memberships", {
  id: text("id").primaryKey(),
  orgId: text("org_id").notNull().references(() => organizations.id, { onDelete: "cascade" }),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  role: membershipRole("role").notNull(),
  status: text("status").default("active"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  orgUserIdx: uniqueIndex("idx_memberships_org_user").on(table.orgId, table.userId),
  userIdx: index("idx_memberships_user_id").on(table.userId),
  orgIdx: index("idx_memberships_org_id").on(table.orgId),
}))

export const membershipsRelations = relations(memberships, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [memberships.orgId],
    references: [organizations.id],
  }),
  user: one(users, {
    fields: [memberships.userId],
    references: [users.id],
  }),
  roles: many(membershipRoles),
  teamMemberships: many(teamMemberships),
  projectMemberships: many(projectMemberships),
}))

export type Membership = typeof memberships.$inferSelect
export type NewMembership = typeof memberships.$inferInsert
