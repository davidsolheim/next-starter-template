import { relations } from "drizzle-orm"
import { pgTable, text, timestamp, integer, boolean, uniqueIndex, jsonb } from "drizzle-orm/pg-core"
import { discountType } from "./enums"
import { couponUsages } from "./coupon-usages"

export const coupons = pgTable("coupons", {
  id: text("id").primaryKey(),
  code: text("code").notNull(),
  description: text("description"),
  discountType: discountType("discount_type").notNull(),
  discountValue: integer("discount_value").notNull(), // Percentage (0-100) or amount in cents
  currency: text("currency").default("usd"), // For fixed_amount discounts
  
  // Restrictions
  minOrderAmount: integer("min_order_amount"), // Minimum order value in cents
  maxDiscountAmount: integer("max_discount_amount"), // Cap for percentage discounts
  
  // Usage limits
  maxUses: integer("max_uses"), // Total uses allowed
  maxUsesPerUser: integer("max_uses_per_user").default(1),
  usedCount: integer("used_count").default(0).notNull(),
  
  // Product/category restrictions (null = applies to all)
  productIds: jsonb("product_ids").$type<string[]>(),
  categoryIds: jsonb("category_ids").$type<string[]>(),
  excludeProductIds: jsonb("exclude_product_ids").$type<string[]>(),
  excludeCategoryIds: jsonb("exclude_category_ids").$type<string[]>(),
  
  // Validity period
  startsAt: timestamp("starts_at"),
  expiresAt: timestamp("expires_at"),
  
  isActive: boolean("is_active").default(true).notNull(),
  isFirstOrderOnly: boolean("is_first_order_only").default(false).notNull(),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  codeIdx: uniqueIndex("idx_coupons_code").on(table.code),
}))

export const couponsRelations = relations(coupons, ({ many }) => ({
  usages: many(couponUsages),
}))

export type Coupon = typeof coupons.$inferSelect
export type NewCoupon = typeof coupons.$inferInsert
