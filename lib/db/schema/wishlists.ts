import { relations } from "drizzle-orm"
import { pgTable, text, timestamp, boolean, index } from "drizzle-orm/pg-core"
import { users } from "./users"
import { wishlistItems } from "./wishlist-items"

export const wishlists = pgTable("wishlists", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: text("name").default("My Wishlist").notNull(),
  isPublic: boolean("is_public").default(false).notNull(),
  shareToken: text("share_token"), // For public sharing
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  userIdx: index("idx_wishlists_user").on(table.userId),
  shareTokenIdx: index("idx_wishlists_share_token").on(table.shareToken),
}))

export const wishlistsRelations = relations(wishlists, ({ one, many }) => ({
  user: one(users, {
    fields: [wishlists.userId],
    references: [users.id],
  }),
  items: many(wishlistItems),
}))

export type Wishlist = typeof wishlists.$inferSelect
export type NewWishlist = typeof wishlists.$inferInsert
