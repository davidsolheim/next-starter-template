import { pgTable, text, timestamp, index, primaryKey } from "drizzle-orm/pg-core"

export const verificationTokens = pgTable("verification_tokens", {
  identifier: text("identifier").notNull(),
  token: text("token").notNull(),
  expires: timestamp("expires").notNull(),
}, (table) => ({
  pk: primaryKey({ columns: [table.identifier, table.token] }),
  identifierTokenIdx: index("idx_verification_tokens_identifier_token").on(table.identifier, table.token),
}))

export type VerificationToken = typeof verificationTokens.$inferSelect
export type NewVerificationToken = typeof verificationTokens.$inferInsert
