import { pgTable, text, timestamp, boolean, uniqueIndex } from "drizzle-orm/pg-core"

export const locales = pgTable("locales", {
  id: text("id").primaryKey(),
  code: text("code").notNull(),
  name: text("name").notNull(),
  isDefault: boolean("is_default").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  codeIdx: uniqueIndex("idx_locales_code").on(table.code),
}))

export type Locale = typeof locales.$inferSelect
export type NewLocale = typeof locales.$inferInsert
