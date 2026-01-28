import { relations } from "drizzle-orm"
import { pgTable, text, timestamp, integer, index } from "drizzle-orm/pg-core"
import { shipments } from "./shipments"
import { orderItems } from "./order-items"

export const shipmentItems = pgTable("shipment_items", {
  id: text("id").primaryKey(),
  shipmentId: text("shipment_id").notNull().references(() => shipments.id, { onDelete: "cascade" }),
  orderItemId: text("order_item_id").notNull().references(() => orderItems.id, { onDelete: "cascade" }),
  quantity: integer("quantity").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  shipmentIdx: index("idx_shipment_items_shipment").on(table.shipmentId),
  orderItemIdx: index("idx_shipment_items_order_item").on(table.orderItemId),
}))

export const shipmentItemsRelations = relations(shipmentItems, ({ one }) => ({
  shipment: one(shipments, {
    fields: [shipmentItems.shipmentId],
    references: [shipments.id],
  }),
  orderItem: one(orderItems, {
    fields: [shipmentItems.orderItemId],
    references: [orderItems.id],
  }),
}))

export type ShipmentItem = typeof shipmentItems.$inferSelect
export type NewShipmentItem = typeof shipmentItems.$inferInsert
