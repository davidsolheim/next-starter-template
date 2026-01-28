import { relations } from "drizzle-orm"
import { pgTable, text, timestamp, boolean, jsonb } from "drizzle-orm/pg-core"
import { shippingMethods } from "./shipping-methods"

export const shippingZones = pgTable("shipping_zones", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  countries: jsonb("countries").$type<string[]>().default([]).notNull(), // ISO country codes
  states: jsonb("states").$type<string[]>(), // State/region codes for specific country filtering
  postalCodes: jsonb("postal_codes").$type<string[]>(), // Postal code patterns
  isDefault: boolean("is_default").default(false).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export const shippingZonesRelations = relations(shippingZones, ({ many }) => ({
  methods: many(shippingMethods),
}))

export type ShippingZone = typeof shippingZones.$inferSelect
export type NewShippingZone = typeof shippingZones.$inferInsert
