import { relations } from "drizzle-orm"
import { pgTable, text, timestamp, index, uniqueIndex } from "drizzle-orm/pg-core"
import { apiKeyStatus } from "./enums"
import { organizations } from "./organizations"
import { apiKeyScopes } from "./api-key-scopes"

export const apiKeys = pgTable("api_keys", {
  id: text("id").primaryKey(),
  orgId: text("org_id").notNull().references(() => organizations.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  hashedKey: text("hashed_key").notNull(),
  status: apiKeyStatus("status").default("active").notNull(),
  lastUsedAt: timestamp("last_used_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  keyIdx: uniqueIndex("idx_api_keys_hashed_key").on(table.hashedKey),
  orgIdx: index("idx_api_keys_org_id").on(table.orgId),
}))

export const apiKeysRelations = relations(apiKeys, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [apiKeys.orgId],
    references: [organizations.id],
  }),
  scopes: many(apiKeyScopes),
}))

export type ApiKey = typeof apiKeys.$inferSelect
export type NewApiKey = typeof apiKeys.$inferInsert
