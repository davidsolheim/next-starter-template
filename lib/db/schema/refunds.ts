import { relations } from "drizzle-orm"
import { pgTable, text, timestamp, integer, index, uniqueIndex } from "drizzle-orm/pg-core"
import { orders } from "./orders"
import { users } from "./users"
import { refundStatus } from "./enums"

export const refunds = pgTable("refunds", {
  id: text("id").primaryKey(),
  orderId: text("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
  
  amount: integer("amount").notNull(), // Refund amount in cents
  currency: text("currency").default("usd").notNull(),
  
  status: refundStatus("status").default("pending").notNull(),
  reason: text("reason"),
  customerReason: text("customer_reason"), // Customer-provided reason
  internalNotes: text("internal_notes"),
  
  // Stripe integration
  stripeRefundId: text("stripe_refund_id"),
  stripeChargeId: text("stripe_charge_id"),
  
  // Who processed it
  processedBy: text("processed_by").references(() => users.id, { onDelete: "set null" }),
  processedAt: timestamp("processed_at"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  orderIdx: index("idx_refunds_order").on(table.orderId),
  statusIdx: index("idx_refunds_status").on(table.status),
  stripeRefundIdx: uniqueIndex("idx_refunds_stripe_refund").on(table.stripeRefundId),
}))

export const refundsRelations = relations(refunds, ({ one }) => ({
  order: one(orders, {
    fields: [refunds.orderId],
    references: [orders.id],
  }),
  processor: one(users, {
    fields: [refunds.processedBy],
    references: [users.id],
  }),
}))

export type Refund = typeof refunds.$inferSelect
export type NewRefund = typeof refunds.$inferInsert
