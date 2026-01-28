import { relations } from "drizzle-orm"
import { pgTable, text, timestamp, integer, boolean, index, uniqueIndex, jsonb } from "drizzle-orm/pg-core"
import { products } from "./products"

export const productVariants = pgTable("product_variants", {
  id: text("id").primaryKey(),
  productId: text("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  sku: text("sku").notNull(),
  name: text("name"), // Optional variant name, e.g., "Red / Large"
  price: integer("price").notNull(), // Price in cents
  compareAtPrice: integer("compare_at_price"), // Original price for showing discounts
  costPrice: integer("cost_price"), // Cost of goods
  weight: integer("weight"), // Weight in grams
  weightUnit: text("weight_unit").default("g"),
  barcode: text("barcode"),
  optionValues: jsonb("option_values").$type<Record<string, string>>(), // e.g., { "Size": "Large", "Color": "Red" }
  isDefault: boolean("is_default").default(false).notNull(),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  productIdx: index("idx_product_variants_product").on(table.productId),
  skuIdx: uniqueIndex("idx_product_variants_sku").on(table.sku),
  barcodeIdx: index("idx_product_variants_barcode").on(table.barcode),
}))

export const productVariantsRelations = relations(productVariants, ({ one }) => ({
  product: one(products, {
    fields: [productVariants.productId],
    references: [products.id],
  }),
}))

export type ProductVariant = typeof productVariants.$inferSelect
export type NewProductVariant = typeof productVariants.$inferInsert
