import { relations } from "drizzle-orm"
import { pgTable, text, timestamp, boolean } from "drizzle-orm/pg-core"
import { inventoryItems } from "./inventory-items"

export const inventoryLocations = pgTable("inventory_locations", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  address1: text("address1"),
  address2: text("address2"),
  city: text("city"),
  state: text("state"),
  postalCode: text("postal_code"),
  country: text("country"),
  phone: text("phone"),
  isActive: boolean("is_active").default(true).notNull(),
  isDefault: boolean("is_default").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export const inventoryLocationsRelations = relations(inventoryLocations, ({ many }) => ({
  inventoryItems: many(inventoryItems),
}))

export type InventoryLocation = typeof inventoryLocations.$inferSelect
export type NewInventoryLocation = typeof inventoryLocations.$inferInsert
