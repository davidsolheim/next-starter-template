import { relations } from "drizzle-orm"
import { pgTable, text, timestamp, boolean, index, uniqueIndex } from "drizzle-orm/pg-core"
import { subscriptionStatus } from "./enums"
import { organizations } from "./organizations"
import { subscriptionItems } from "./subscription-items"

export const subscriptions = pgTable("subscriptions", {
  id: text("id").primaryKey(),
  orgId: text("org_id").notNull().references(() => organizations.id, { onDelete: "cascade" }),
  stripeSubscriptionId: text("stripe_subscription_id").notNull(),
  status: subscriptionStatus("status").notNull(),
  currentPeriodEnd: timestamp("current_period_end"),
  cancelAtPeriodEnd: boolean("cancel_at_period_end").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  stripeIdx: uniqueIndex("idx_subscriptions_stripe_id").on(table.stripeSubscriptionId),
  orgIdx: index("idx_subscriptions_org_id").on(table.orgId),
}))

export const subscriptionsRelations = relations(subscriptions, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [subscriptions.orgId],
    references: [organizations.id],
  }),
  items: many(subscriptionItems),
}))

export type Subscription = typeof subscriptions.$inferSelect
export type NewSubscription = typeof subscriptions.$inferInsert
