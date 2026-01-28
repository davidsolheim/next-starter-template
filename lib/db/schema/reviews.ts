import { relations } from "drizzle-orm"
import { pgTable, text, timestamp, integer, boolean, index } from "drizzle-orm/pg-core"
import { users } from "./users"
import { products } from "./products"
import { orders } from "./orders"

export const reviews = pgTable("reviews", {
  id: text("id").primaryKey(),
  productId: text("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  orderId: text("order_id").references(() => orders.id, { onDelete: "set null" }), // Links to verified purchase
  
  rating: integer("rating").notNull(), // 1-5
  title: text("title"),
  content: text("content"),
  
  isVerifiedPurchase: boolean("is_verified_purchase").default(false).notNull(),
  isApproved: boolean("is_approved").default(false).notNull(),
  isFeatured: boolean("is_featured").default(false).notNull(),
  
  helpfulCount: integer("helpful_count").default(0).notNull(),
  notHelpfulCount: integer("not_helpful_count").default(0).notNull(),
  
  adminResponse: text("admin_response"),
  adminRespondedAt: timestamp("admin_responded_at"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  productIdx: index("idx_reviews_product").on(table.productId),
  userIdx: index("idx_reviews_user").on(table.userId),
  productRatingIdx: index("idx_reviews_product_rating").on(table.productId, table.rating),
  approvedIdx: index("idx_reviews_approved").on(table.isApproved),
}))

export const reviewsRelations = relations(reviews, ({ one }) => ({
  product: one(products, {
    fields: [reviews.productId],
    references: [products.id],
  }),
  user: one(users, {
    fields: [reviews.userId],
    references: [users.id],
  }),
  order: one(orders, {
    fields: [reviews.orderId],
    references: [orders.id],
  }),
}))

export type Review = typeof reviews.$inferSelect
export type NewReview = typeof reviews.$inferInsert
