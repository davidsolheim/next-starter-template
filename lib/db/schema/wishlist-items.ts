import { relations } from "drizzle-orm"
import { pgTable, text, timestamp, index, unique } from "drizzle-orm/pg-core"
import { wishlists } from "./wishlists"
import { products } from "./products"
import { productVariants } from "./product-variants"

export const wishlistItems = pgTable("wishlist_items", {
  id: text("id").primaryKey(),
  wishlistId: text("wishlist_id").notNull().references(() => wishlists.id, { onDelete: "cascade" }),
  productId: text("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  variantId: text("variant_id").references(() => productVariants.id, { onDelete: "set null" }),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  wishlistIdx: index("idx_wishlist_items_wishlist").on(table.wishlistId),
  productIdx: index("idx_wishlist_items_product").on(table.productId),
  uniqueWishlistProduct: unique("uq_wishlist_items_wishlist_product").on(table.wishlistId, table.productId),
}))

export const wishlistItemsRelations = relations(wishlistItems, ({ one }) => ({
  wishlist: one(wishlists, {
    fields: [wishlistItems.wishlistId],
    references: [wishlists.id],
  }),
  product: one(products, {
    fields: [wishlistItems.productId],
    references: [products.id],
  }),
  variant: one(productVariants, {
    fields: [wishlistItems.variantId],
    references: [productVariants.id],
  }),
}))

export type WishlistItem = typeof wishlistItems.$inferSelect
export type NewWishlistItem = typeof wishlistItems.$inferInsert
