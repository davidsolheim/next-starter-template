import { relations } from "drizzle-orm"
import { pgTable, text, timestamp, index } from "drizzle-orm/pg-core"
import { users } from "./users"
import { cartItems } from "./cart-items"

export const carts = pgTable("carts", {
  id: text("id").primaryKey(),
  userId: text("user_id").references(() => users.id, { onDelete: "cascade" }),
  sessionId: text("session_id"), // For guest carts
  currency: text("currency").default("usd").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  expiresAt: timestamp("expires_at"), // For guest cart cleanup
}, (table) => ({
  userIdx: index("idx_carts_user").on(table.userId),
  sessionIdx: index("idx_carts_session").on(table.sessionId),
}))

export const cartsRelations = relations(carts, ({ one, many }) => ({
  user: one(users, {
    fields: [carts.userId],
    references: [users.id],
  }),
  items: many(cartItems),
}))

export type Cart = typeof carts.$inferSelect
export type NewCart = typeof carts.$inferInsert
