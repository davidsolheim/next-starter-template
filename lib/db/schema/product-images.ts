import { relations } from "drizzle-orm"
import { pgTable, text, timestamp, integer, boolean, index } from "drizzle-orm/pg-core"
import { products } from "./products"
import { productVariants } from "./product-variants"

export const productImages = pgTable("product_images", {
  id: text("id").primaryKey(),
  productId: text("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  variantId: text("variant_id").references(() => productVariants.id, { onDelete: "set null" }),
  url: text("url").notNull(),
  alt: text("alt"),
  position: integer("position").default(0).notNull(),
  isPrimary: boolean("is_primary").default(false).notNull(),
  width: integer("width"),
  height: integer("height"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  productIdx: index("idx_product_images_product").on(table.productId),
  variantIdx: index("idx_product_images_variant").on(table.variantId),
}))

export const productImagesRelations = relations(productImages, ({ one }) => ({
  product: one(products, {
    fields: [productImages.productId],
    references: [products.id],
  }),
  variant: one(productVariants, {
    fields: [productImages.variantId],
    references: [productVariants.id],
  }),
}))

export type ProductImage = typeof productImages.$inferSelect
export type NewProductImage = typeof productImages.$inferInsert
