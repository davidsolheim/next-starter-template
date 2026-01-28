import { relations } from "drizzle-orm"
import { pgTable, text, timestamp, boolean, uniqueIndex } from "drizzle-orm/pg-core"
import { prices } from "./prices"
import { productType } from "./enums"
import { productVariants } from "./product-variants"
import { productImages } from "./product-images"
import { productOptions } from "./product-options"
import { digitalAssets } from "./digital-assets"
import { reviews } from "./reviews"

export const products = pgTable("products", {
  id: text("id").primaryKey(),
  stripeProductId: text("stripe_product_id").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  type: productType("type").default("physical").notNull(),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  stripeIdx: uniqueIndex("idx_products_stripe_product").on(table.stripeProductId),
}))

export const productsRelations = relations(products, ({ many }) => ({
  prices: many(prices),
  variants: many(productVariants),
  images: many(productImages),
  options: many(productOptions),
  digitalAssets: many(digitalAssets),
  reviews: many(reviews),
}))

export type Product = typeof products.$inferSelect
export type NewProduct = typeof products.$inferInsert
