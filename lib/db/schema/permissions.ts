import { relations } from "drizzle-orm"
import { pgTable, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core"
import { rolePermissions } from "./role-permissions"

export const permissions = pgTable("permissions", {
  id: text("id").primaryKey(),
  key: text("key").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  keyIdx: uniqueIndex("idx_permissions_key").on(table.key),
}))

export const permissionsRelations = relations(permissions, ({ many }) => ({
  roles: many(rolePermissions),
}))

export type Permission = typeof permissions.$inferSelect
export type NewPermission = typeof permissions.$inferInsert
