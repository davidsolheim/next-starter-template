import { relations } from "drizzle-orm"
import { pgTable, text, timestamp, integer, index, unique } from "drizzle-orm/pg-core"
import { productVariants } from "./product-variants"
import { inventoryLocations } from "./inventory-locations"

export const inventoryItems = pgTable("inventory_items", {
  id: text("id").primaryKey(),
  variantId: text("variant_id").notNull().references(() => productVariants.id, { onDelete: "cascade" }),
  locationId: text("location_id").notNull().references(() => inventoryLocations.id, { onDelete: "cascade" }),
  quantity: integer("quantity").default(0).notNull(),
  reservedQuantity: integer("reserved_quantity").default(0).notNull(),
  reorderPoint: integer("reorder_point").default(0),
  reorderQuantity: integer("reorder_quantity").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  variantIdx: index("idx_inventory_items_variant").on(table.variantId),
  locationIdx: index("idx_inventory_items_location").on(table.locationId),
  uniqueVariantLocation: unique("uq_inventory_variant_location").on(table.variantId, table.locationId),
}))

export const inventoryItemsRelations = relations(inventoryItems, ({ one }) => ({
  variant: one(productVariants, {
    fields: [inventoryItems.variantId],
    references: [productVariants.id],
  }),
  location: one(inventoryLocations, {
    fields: [inventoryItems.locationId],
    references: [inventoryLocations.id],
  }),
}))

export type InventoryItem = typeof inventoryItems.$inferSelect
export type NewInventoryItem = typeof inventoryItems.$inferInsert
