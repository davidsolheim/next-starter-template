import { relations } from "drizzle-orm"
import { pgTable, text, timestamp, integer, index, jsonb } from "drizzle-orm/pg-core"
import { orders } from "./orders"
import { productVariants } from "./product-variants"
import { products } from "./products"

export const orderItems = pgTable("order_items", {
  id: text("id").primaryKey(),
  orderId: text("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
  productId: text("product_id").references(() => products.id, { onDelete: "set null" }),
  variantId: text("variant_id").references(() => productVariants.id, { onDelete: "set null" }),
  
  // Snapshot at time of order (in case product/variant is deleted or modified)
  productName: text("product_name").notNull(),
  variantName: text("variant_name"),
  sku: text("sku"),
  optionValues: jsonb("option_values").$type<Record<string, string>>(),
  
  // Pricing (in cents)
  unitPrice: integer("unit_price").notNull(),
  quantity: integer("quantity").notNull(),
  subtotal: integer("subtotal").notNull(),
  discountAmount: integer("discount_amount").default(0).notNull(),
  taxAmount: integer("tax_amount").default(0).notNull(),
  total: integer("total").notNull(),
  
  // For digital products
  requiresShipping: text("requires_shipping").default("true"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  orderIdx: index("idx_order_items_order").on(table.orderId),
  productIdx: index("idx_order_items_product").on(table.productId),
  variantIdx: index("idx_order_items_variant").on(table.variantId),
}))

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
  variant: one(productVariants, {
    fields: [orderItems.variantId],
    references: [productVariants.id],
  }),
}))

export type OrderItem = typeof orderItems.$inferSelect
export type NewOrderItem = typeof orderItems.$inferInsert
