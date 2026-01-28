import { relations } from "drizzle-orm"
import { pgTable, text, timestamp, integer, index } from "drizzle-orm/pg-core"
import { productOptions } from "./product-options"

export const productOptionValues = pgTable("product_option_values", {
  id: text("id").primaryKey(),
  optionId: text("option_id").notNull().references(() => productOptions.id, { onDelete: "cascade" }),
  value: text("value").notNull(), // e.g., "Small", "Medium", "Large", "Red", "Blue"
  position: integer("position").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  optionIdx: index("idx_product_option_values_option").on(table.optionId),
}))

export const productOptionValuesRelations = relations(productOptionValues, ({ one }) => ({
  option: one(productOptions, {
    fields: [productOptionValues.optionId],
    references: [productOptions.id],
  }),
}))

export type ProductOptionValue = typeof productOptionValues.$inferSelect
export type NewProductOptionValue = typeof productOptionValues.$inferInsert
