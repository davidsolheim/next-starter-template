import { relations } from "drizzle-orm"
import { pgTable, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core"
import { organizations } from "./organizations"
import { rolePermissions } from "./role-permissions"
import { membershipRoles } from "./membership-roles"

export const roles = pgTable("roles", {
  id: text("id").primaryKey(),
  orgId: text("org_id").references(() => organizations.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  orgNameIdx: uniqueIndex("idx_roles_org_name").on(table.orgId, table.name),
}))

export const rolesRelations = relations(roles, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [roles.orgId],
    references: [organizations.id],
  }),
  permissions: many(rolePermissions),
  membershipRoles: many(membershipRoles),
}))

export type Role = typeof roles.$inferSelect
export type NewRole = typeof roles.$inferInsert
