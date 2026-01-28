import { relations } from "drizzle-orm"
import { pgTable, text, timestamp, integer, jsonb, index } from "drizzle-orm/pg-core"
import { webhooks } from "./webhooks"

export const webhookDeliveries = pgTable("webhook_deliveries", {
  id: text("id").primaryKey(),
  webhookId: text("webhook_id").notNull().references(() => webhooks.id, { onDelete: "cascade" }),
  event: text("event").notNull(),
  payload: jsonb("payload"),
  statusCode: integer("status_code"),
  deliveredAt: timestamp("delivered_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  webhookIdx: index("idx_webhook_deliveries_webhook_id").on(table.webhookId),
}))

export const webhookDeliveriesRelations = relations(webhookDeliveries, ({ one }) => ({
  webhook: one(webhooks, {
    fields: [webhookDeliveries.webhookId],
    references: [webhooks.id],
  }),
}))

export type WebhookDelivery = typeof webhookDeliveries.$inferSelect
export type NewWebhookDelivery = typeof webhookDeliveries.$inferInsert
