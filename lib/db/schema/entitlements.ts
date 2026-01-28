import { relations } from "drizzle-orm"
import { pgTable, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core"
import { organizations } from "./organizations"

export const entitlements = pgTable("entitlements", {
  id: text("id").primaryKey(),
  orgId: text("org_id").notNull().references(() => organizations.id, { onDelete: "cascade" }),
  key: text("key").notNull(),
  value: text("value"),
  source: text("source"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  orgKeyIdx: uniqueIndex("idx_entitlements_org_key").on(table.orgId, table.key),
}))

export const entitlementsRelations = relations(entitlements, ({ one }) => ({
  organization: one(organizations, {
    fields: [entitlements.orgId],
    references: [organizations.id],
  }),
}))

export type Entitlement = typeof entitlements.$inferSelect
export type NewEntitlement = typeof entitlements.$inferInsert
