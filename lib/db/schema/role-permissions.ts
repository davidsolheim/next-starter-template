import { relations } from "drizzle-orm"
import { pgTable, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core"
import { roles } from "./roles"
import { permissions } from "./permissions"

export const rolePermissions = pgTable("role_permissions", {
  id: text("id").primaryKey(),
  roleId: text("role_id").notNull().references(() => roles.id, { onDelete: "cascade" }),
  permissionId: text("permission_id").notNull().references(() => permissions.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  rolePermissionIdx: uniqueIndex("idx_role_permissions_role_permission").on(
    table.roleId,
    table.permissionId,
  ),
}))

export const rolePermissionsRelations = relations(rolePermissions, ({ one }) => ({
  role: one(roles, {
    fields: [rolePermissions.roleId],
    references: [roles.id],
  }),
  permission: one(permissions, {
    fields: [rolePermissions.permissionId],
    references: [permissions.id],
  }),
}))

export type RolePermission = typeof rolePermissions.$inferSelect
export type NewRolePermission = typeof rolePermissions.$inferInsert
