import { relations } from "drizzle-orm"
import { pgTable, text, timestamp, primaryKey, index } from "drizzle-orm/pg-core"
import { products } from "./products"
import { productCategories } from "./product-categories"

export const productCategoryAssignments = pgTable("product_category_assignments", {
  productId: text("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  categoryId: text("category_id").notNull().references(() => productCategories.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  pk: primaryKey({ columns: [table.productId, table.categoryId] }),
  productIdx: index("idx_pca_product").on(table.productId),
  categoryIdx: index("idx_pca_category").on(table.categoryId),
}))

export const productCategoryAssignmentsRelations = relations(productCategoryAssignments, ({ one }) => ({
  product: one(products, {
    fields: [productCategoryAssignments.productId],
    references: [products.id],
  }),
  category: one(productCategories, {
    fields: [productCategoryAssignments.categoryId],
    references: [productCategories.id],
  }),
}))

export type ProductCategoryAssignment = typeof productCategoryAssignments.$inferSelect
export type NewProductCategoryAssignment = typeof productCategoryAssignments.$inferInsert
