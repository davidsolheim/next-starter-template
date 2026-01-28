import { relations } from "drizzle-orm"
import { pgTable, text, timestamp, integer, boolean, index } from "drizzle-orm/pg-core"
import { shippingZones } from "./shipping-zones"

export const shippingMethods = pgTable("shipping_methods", {
  id: text("id").primaryKey(),
  zoneId: text("zone_id").notNull().references(() => shippingZones.id, { onDelete: "cascade" }),
  name: text("name").notNull(), // e.g., "Standard Shipping", "Express", "Overnight"
  description: text("description"),
  price: integer("price").notNull(), // Price in cents
  minOrderAmount: integer("min_order_amount"), // Min order for this method
  maxOrderAmount: integer("max_order_amount"), // Max order for this method
  minWeight: integer("min_weight"), // Min weight in grams
  maxWeight: integer("max_weight"), // Max weight in grams
  estimatedDaysMin: integer("estimated_days_min"),
  estimatedDaysMax: integer("estimated_days_max"),
  carrier: text("carrier"), // e.g., "USPS", "FedEx", "UPS"
  carrierServiceCode: text("carrier_service_code"),
  isActive: boolean("is_active").default(true).notNull(),
  position: integer("position").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  zoneIdx: index("idx_shipping_methods_zone").on(table.zoneId),
}))

export const shippingMethodsRelations = relations(shippingMethods, ({ one }) => ({
  zone: one(shippingZones, {
    fields: [shippingMethods.zoneId],
    references: [shippingZones.id],
  }),
}))

export type ShippingMethod = typeof shippingMethods.$inferSelect
export type NewShippingMethod = typeof shippingMethods.$inferInsert
