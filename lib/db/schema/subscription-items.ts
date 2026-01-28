import { relations } from "drizzle-orm"
import { pgTable, text, timestamp, integer, uniqueIndex } from "drizzle-orm/pg-core"
import { subscriptions } from "./subscriptions"
import { prices } from "./prices"

export const subscriptionItems = pgTable("subscription_items", {
  id: text("id").primaryKey(),
  subscriptionId: text("subscription_id").notNull().references(() => subscriptions.id, { onDelete: "cascade" }),
  priceId: text("price_id").notNull().references(() => prices.id, { onDelete: "cascade" }),
  quantity: integer("quantity").default(1).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  subscriptionPriceIdx: uniqueIndex("idx_subscription_items_subscription_price").on(
    table.subscriptionId,
    table.priceId,
  ),
}))

export const subscriptionItemsRelations = relations(subscriptionItems, ({ one }) => ({
  subscription: one(subscriptions, {
    fields: [subscriptionItems.subscriptionId],
    references: [subscriptions.id],
  }),
  price: one(prices, {
    fields: [subscriptionItems.priceId],
    references: [prices.id],
  }),
}))

export type SubscriptionItem = typeof subscriptionItems.$inferSelect
export type NewSubscriptionItem = typeof subscriptionItems.$inferInsert
