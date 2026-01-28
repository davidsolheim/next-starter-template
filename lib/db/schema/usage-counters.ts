import { relations } from "drizzle-orm"
import { pgTable, text, timestamp, integer, uniqueIndex } from "drizzle-orm/pg-core"
import { organizations } from "./organizations"

export const usageCounters = pgTable("usage_counters", {
  id: text("id").primaryKey(),
  orgId: text("org_id").notNull().references(() => organizations.id, { onDelete: "cascade" }),
  key: text("key").notNull(),
  periodStart: timestamp("period_start").notNull(),
  periodEnd: timestamp("period_end").notNull(),
  count: integer("count").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  orgKeyPeriodIdx: uniqueIndex("idx_usage_counters_org_key_period").on(
    table.orgId,
    table.key,
    table.periodStart,
    table.periodEnd,
  ),
}))

export const usageCountersRelations = relations(usageCounters, ({ one }) => ({
  organization: one(organizations, {
    fields: [usageCounters.orgId],
    references: [organizations.id],
  }),
}))

export type UsageCounter = typeof usageCounters.$inferSelect
export type NewUsageCounter = typeof usageCounters.$inferInsert
