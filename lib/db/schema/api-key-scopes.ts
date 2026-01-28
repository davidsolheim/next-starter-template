import { relations } from "drizzle-orm"
import { pgTable, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core"
import { apiKeys } from "./api-keys"

export const apiKeyScopes = pgTable("api_key_scopes", {
  id: text("id").primaryKey(),
  apiKeyId: text("api_key_id").notNull().references(() => apiKeys.id, { onDelete: "cascade" }),
  scope: text("scope").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  apiKeyScopeIdx: uniqueIndex("idx_api_key_scopes_api_key_scope").on(
    table.apiKeyId,
    table.scope,
  ),
}))

export const apiKeyScopesRelations = relations(apiKeyScopes, ({ one }) => ({
  apiKey: one(apiKeys, {
    fields: [apiKeyScopes.apiKeyId],
    references: [apiKeys.id],
  }),
}))

export type ApiKeyScope = typeof apiKeyScopes.$inferSelect
export type NewApiKeyScope = typeof apiKeyScopes.$inferInsert
