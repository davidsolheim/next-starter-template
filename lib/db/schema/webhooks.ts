import { relations } from "drizzle-orm"
import { pgTable, text, timestamp, boolean, jsonb, index } from "drizzle-orm/pg-core"
import { organizations } from "./organizations"
import { webhookDeliveries } from "./webhook-deliveries"

export const webhooks = pgTable("webhooks", {
  id: text("id").primaryKey(),
  orgId: text("org_id").notNull().references(() => organizations.id, { onDelete: "cascade" }),
  url: text("url").notNull(),
  secret: text("secret"),
  events: jsonb("events"),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  orgIdx: index("idx_webhooks_org_id").on(table.orgId),
}))

export const webhooksRelations = relations(webhooks, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [webhooks.orgId],
    references: [organizations.id],
  }),
  deliveries: many(webhookDeliveries),
}))

export type Webhook = typeof webhooks.$inferSelect
export type NewWebhook = typeof webhooks.$inferInsert
