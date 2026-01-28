import { relations } from "drizzle-orm"
import { pgTable, text, timestamp, index } from "drizzle-orm/pg-core"
import { orders } from "./orders"
import { shippingMethods } from "./shipping-methods"
import { shipmentItems } from "./shipment-items"
import { fulfillmentStatus } from "./enums"

export const shipments = pgTable("shipments", {
  id: text("id").primaryKey(),
  orderId: text("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
  shippingMethodId: text("shipping_method_id").references(() => shippingMethods.id, { onDelete: "set null" }),
  status: fulfillmentStatus("status").default("unfulfilled").notNull(),
  trackingNumber: text("tracking_number"),
  trackingUrl: text("tracking_url"),
  carrier: text("carrier"),
  labelUrl: text("label_url"),
  shippedAt: timestamp("shipped_at"),
  deliveredAt: timestamp("delivered_at"),
  estimatedDeliveryAt: timestamp("estimated_delivery_at"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  orderIdx: index("idx_shipments_order").on(table.orderId),
  trackingIdx: index("idx_shipments_tracking").on(table.trackingNumber),
}))

export const shipmentsRelations = relations(shipments, ({ one, many }) => ({
  order: one(orders, {
    fields: [shipments.orderId],
    references: [orders.id],
  }),
  shippingMethod: one(shippingMethods, {
    fields: [shipments.shippingMethodId],
    references: [shippingMethods.id],
  }),
  items: many(shipmentItems),
}))

export type Shipment = typeof shipments.$inferSelect
export type NewShipment = typeof shipments.$inferInsert
