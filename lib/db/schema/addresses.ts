import { relations } from "drizzle-orm"
import { pgTable, text, timestamp, boolean, index } from "drizzle-orm/pg-core"
import { users } from "./users"
import { addressType } from "./enums"

export const addresses = pgTable("addresses", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  type: addressType("type").default("shipping").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  company: text("company"),
  address1: text("address1").notNull(),
  address2: text("address2"),
  city: text("city").notNull(),
  state: text("state"),
  postalCode: text("postal_code").notNull(),
  country: text("country").notNull(),
  phone: text("phone"),
  isDefault: boolean("is_default").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  userIdx: index("idx_addresses_user").on(table.userId),
  userTypeIdx: index("idx_addresses_user_type").on(table.userId, table.type),
}))

export const addressesRelations = relations(addresses, ({ one }) => ({
  user: one(users, {
    fields: [addresses.userId],
    references: [users.id],
  }),
}))

export type Address = typeof addresses.$inferSelect
export type NewAddress = typeof addresses.$inferInsert
