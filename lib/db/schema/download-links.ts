import { relations } from "drizzle-orm"
import { pgTable, text, timestamp, integer, index, uniqueIndex } from "drizzle-orm/pg-core"
import { orderItems } from "./order-items"
import { digitalAssets } from "./digital-assets"
import { users } from "./users"

export const downloadLinks = pgTable("download_links", {
  id: text("id").primaryKey(),
  orderItemId: text("order_item_id").notNull().references(() => orderItems.id, { onDelete: "cascade" }),
  assetId: text("asset_id").notNull().references(() => digitalAssets.id, { onDelete: "cascade" }),
  userId: text("user_id").references(() => users.id, { onDelete: "set null" }),
  
  token: text("token").notNull(), // Unique download token
  
  downloadCount: integer("download_count").default(0).notNull(),
  maxDownloads: integer("max_downloads"), // Inherited from asset or overridden
  
  lastDownloadedAt: timestamp("last_downloaded_at"),
  expiresAt: timestamp("expires_at"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  orderItemIdx: index("idx_download_links_order_item").on(table.orderItemId),
  assetIdx: index("idx_download_links_asset").on(table.assetId),
  userIdx: index("idx_download_links_user").on(table.userId),
  tokenIdx: uniqueIndex("idx_download_links_token").on(table.token),
}))

export const downloadLinksRelations = relations(downloadLinks, ({ one }) => ({
  orderItem: one(orderItems, {
    fields: [downloadLinks.orderItemId],
    references: [orderItems.id],
  }),
  asset: one(digitalAssets, {
    fields: [downloadLinks.assetId],
    references: [digitalAssets.id],
  }),
  user: one(users, {
    fields: [downloadLinks.userId],
    references: [users.id],
  }),
}))

export type DownloadLink = typeof downloadLinks.$inferSelect
export type NewDownloadLink = typeof downloadLinks.$inferInsert
