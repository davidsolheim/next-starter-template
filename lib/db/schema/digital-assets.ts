import { relations } from "drizzle-orm"
import { pgTable, text, timestamp, integer, boolean, index } from "drizzle-orm/pg-core"
import { products } from "./products"
import { productVariants } from "./product-variants"

export const digitalAssets = pgTable("digital_assets", {
  id: text("id").primaryKey(),
  productId: text("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  variantId: text("variant_id").references(() => productVariants.id, { onDelete: "set null" }),
  
  name: text("name").notNull(),
  fileName: text("file_name").notNull(),
  fileUrl: text("file_url").notNull(), // Secure storage URL
  fileSize: integer("file_size"), // Size in bytes
  mimeType: text("mime_type"),
  
  version: text("version"), // For versioned downloads
  description: text("description"),
  
  maxDownloads: integer("max_downloads"), // Limit per purchase (null = unlimited)
  downloadExpiryDays: integer("download_expiry_days"), // Days after purchase (null = never expires)
  
  isActive: boolean("is_active").default(true).notNull(),
  position: integer("position").default(0).notNull(),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  productIdx: index("idx_digital_assets_product").on(table.productId),
  variantIdx: index("idx_digital_assets_variant").on(table.variantId),
}))

export const digitalAssetsRelations = relations(digitalAssets, ({ one }) => ({
  product: one(products, {
    fields: [digitalAssets.productId],
    references: [products.id],
  }),
  variant: one(productVariants, {
    fields: [digitalAssets.variantId],
    references: [productVariants.id],
  }),
}))

export type DigitalAsset = typeof digitalAssets.$inferSelect
export type NewDigitalAsset = typeof digitalAssets.$inferInsert
