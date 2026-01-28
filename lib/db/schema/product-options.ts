import { relations } from "drizzle-orm"
import { pgTable, text, timestamp, integer, index } from "drizzle-orm/pg-core"
import { products } from "./products"
import { productOptionValues } from "./product-option-values"

export const productOptions = pgTable("product_options", {
  id: text("id").primaryKey(),
  productId: text("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  name: text("name").notNull(), // e.g., "Size", "Color", "Material"
  position: integer("position").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  productIdx: index("idx_product_options_product").on(table.productId),
}))

export const productOptionsRelations = relations(productOptions, ({ one, many }) => ({
  product: one(products, {
    fields: [productOptions.productId],
    references: [products.id],
  }),
  values: many(productOptionValues),
}))

export type ProductOption = typeof productOptions.$inferSelect
export type NewProductOption = typeof productOptions.$inferInsert
