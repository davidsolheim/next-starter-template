import { relations } from "drizzle-orm"
import { pgTable, text, timestamp, integer, index, uniqueIndex } from "drizzle-orm/pg-core"
import { users } from "./users"
import { addresses } from "./addresses"
import { coupons } from "./coupons"
import { orderItems } from "./order-items"
import { shipments } from "./shipments"
import { refunds } from "./refunds"
import { orderStatus, fulfillmentStatus } from "./enums"

export const orders = pgTable("orders", {
  id: text("id").primaryKey(),
  orderNumber: text("order_number").notNull(),
  userId: text("user_id").references(() => users.id, { onDelete: "set null" }),
  email: text("email").notNull(), // Stored separately for guest orders
  status: orderStatus("status").default("pending").notNull(),
  fulfillmentStatus: fulfillmentStatus("fulfillment_status").default("unfulfilled").notNull(),
  
  // Addresses (snapshot at time of order)
  shippingAddressId: text("shipping_address_id").references(() => addresses.id, { onDelete: "set null" }),
  billingAddressId: text("billing_address_id").references(() => addresses.id, { onDelete: "set null" }),
  
  // Pricing (all in cents)
  subtotal: integer("subtotal").notNull(),
  shippingTotal: integer("shipping_total").default(0).notNull(),
  taxTotal: integer("tax_total").default(0).notNull(),
  discountTotal: integer("discount_total").default(0).notNull(),
  total: integer("total").notNull(),
  currency: text("currency").default("usd").notNull(),
  
  // Coupon
  couponId: text("coupon_id").references(() => coupons.id, { onDelete: "set null" }),
  couponCode: text("coupon_code"),
  
  // Stripe
  stripePaymentIntentId: text("stripe_payment_intent_id"),
  stripeChargeId: text("stripe_charge_id"),
  
  // Notes
  customerNotes: text("customer_notes"),
  internalNotes: text("internal_notes"),
  
  cancelledAt: timestamp("cancelled_at"),
  cancelReason: text("cancel_reason"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  orderNumberIdx: uniqueIndex("idx_orders_order_number").on(table.orderNumber),
  userIdx: index("idx_orders_user").on(table.userId),
  statusIdx: index("idx_orders_status").on(table.status),
  stripePaymentIdx: index("idx_orders_stripe_payment").on(table.stripePaymentIntentId),
}))

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  shippingAddress: one(addresses, {
    fields: [orders.shippingAddressId],
    references: [addresses.id],
    relationName: "shippingAddress",
  }),
  billingAddress: one(addresses, {
    fields: [orders.billingAddressId],
    references: [addresses.id],
    relationName: "billingAddress",
  }),
  coupon: one(coupons, {
    fields: [orders.couponId],
    references: [coupons.id],
  }),
  items: many(orderItems),
  shipments: many(shipments),
  refunds: many(refunds),
}))

export type Order = typeof orders.$inferSelect
export type NewOrder = typeof orders.$inferInsert
