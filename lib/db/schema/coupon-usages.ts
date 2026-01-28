import { relations } from "drizzle-orm"
import { pgTable, text, timestamp, integer, index } from "drizzle-orm/pg-core"
import { coupons } from "./coupons"
import { users } from "./users"
import { orders } from "./orders"

export const couponUsages = pgTable("coupon_usages", {
  id: text("id").primaryKey(),
  couponId: text("coupon_id").notNull().references(() => coupons.id, { onDelete: "cascade" }),
  userId: text("user_id").references(() => users.id, { onDelete: "set null" }),
  orderId: text("order_id").references(() => orders.id, { onDelete: "set null" }),
  discountAmount: integer("discount_amount").notNull(), // Actual discount applied in cents
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  couponIdx: index("idx_coupon_usages_coupon").on(table.couponId),
  userIdx: index("idx_coupon_usages_user").on(table.userId),
  orderIdx: index("idx_coupon_usages_order").on(table.orderId),
}))

export const couponUsagesRelations = relations(couponUsages, ({ one }) => ({
  coupon: one(coupons, {
    fields: [couponUsages.couponId],
    references: [coupons.id],
  }),
  user: one(users, {
    fields: [couponUsages.userId],
    references: [users.id],
  }),
  order: one(orders, {
    fields: [couponUsages.orderId],
    references: [orders.id],
  }),
}))

export type CouponUsage = typeof couponUsages.$inferSelect
export type NewCouponUsage = typeof couponUsages.$inferInsert
