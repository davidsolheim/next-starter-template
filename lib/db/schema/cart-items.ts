import { relations } from "drizzle-orm"
import { pgTable, text, timestamp, integer, index, unique } from "drizzle-orm/pg-core"
import { carts } from "./carts"
import { productVariants } from "./product-variants"

export const cartItems = pgTable("cart_items", {
  id: text("id").primaryKey(),
  cartId: text("cart_id").notNull().references(() => carts.id, { onDelete: "cascade" }),
  variantId: text("variant_id").notNull().references(() => productVariants.id, { onDelete: "cascade" }),
  quantity: integer("quantity").default(1).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  cartIdx: index("idx_cart_items_cart").on(table.cartId),
  variantIdx: index("idx_cart_items_variant").on(table.variantId),
  uniqueCartVariant: unique("uq_cart_items_cart_variant").on(table.cartId, table.variantId),
}))

export const cartItemsRelations = relations(cartItems, ({ one }) => ({
  cart: one(carts, {
    fields: [cartItems.cartId],
    references: [carts.id],
  }),
  variant: one(productVariants, {
    fields: [cartItems.variantId],
    references: [productVariants.id],
  }),
}))

export type CartItem = typeof cartItems.$inferSelect
export type NewCartItem = typeof cartItems.$inferInsert
