import { relations } from "drizzle-orm"
import { pgTable, text, timestamp, integer, index } from "drizzle-orm/pg-core"
import { organizations } from "./organizations"

export const usageEvents = pgTable("usage_events", {
  id: text("id").primaryKey(),
  orgId: text("org_id").notNull().references(() => organizations.id, { onDelete: "cascade" }),
  key: text("key").notNull(),
  quantity: integer("quantity").default(1).notNull(),
  eventTimestamp: timestamp("event_timestamp").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  orgKeyIdx: index("idx_usage_events_org_key").on(table.orgId, table.key),
}))

export const usageEventsRelations = relations(usageEvents, ({ one }) => ({
  organization: one(organizations, {
    fields: [usageEvents.orgId],
    references: [organizations.id],
  }),
}))

export type UsageEvent = typeof usageEvents.$inferSelect
export type NewUsageEvent = typeof usageEvents.$inferInsert
