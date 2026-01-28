import { relations } from "drizzle-orm"
import { pgTable, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core"
import { memberships } from "./memberships"
import { roles } from "./roles"

export const membershipRoles = pgTable("membership_roles", {
  id: text("id").primaryKey(),
  membershipId: text("membership_id").notNull().references(() => memberships.id, { onDelete: "cascade" }),
  roleId: text("role_id").notNull().references(() => roles.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  membershipRoleIdx: uniqueIndex("idx_membership_roles_membership_role").on(
    table.membershipId,
    table.roleId,
  ),
}))

export const membershipRolesRelations = relations(membershipRoles, ({ one }) => ({
  membership: one(memberships, {
    fields: [membershipRoles.membershipId],
    references: [memberships.id],
  }),
  role: one(roles, {
    fields: [membershipRoles.roleId],
    references: [roles.id],
  }),
}))

export type MembershipRole = typeof membershipRoles.$inferSelect
export type NewMembershipRole = typeof membershipRoles.$inferInsert
