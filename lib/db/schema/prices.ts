import { relations } from "drizzle-orm"
import { pgTable, text, timestamp, boolean, integer, uniqueIndex, index } from "drizzle-orm/pg-core"
import { products } from "./products"
import { subscriptionItems } from "./subscription-items"

export const prices = pgTable("prices", {
  id: text("id").primaryKey(),
  productId: text("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  stripePriceId: text("stripe_price_id").notNull(),
  unitAmount: integer("unit_amount"),
  currency: text("currency").notNull(),
  recurringInterval: text("recurring_interval"),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  stripeIdx: uniqueIndex("idx_prices_stripe_price").on(table.stripePriceId),
  productIdx: index("idx_prices_product_id").on(table.productId),
}))

export const pricesRelations = relations(prices, ({ one, many }) => ({
  product: one(products, {
    fields: [prices.productId],
    references: [products.id],
  }),
  subscriptionItems: many(subscriptionItems),
}))

export type Price = typeof prices.$inferSelect
export type NewPrice = typeof prices.$inferInsert
