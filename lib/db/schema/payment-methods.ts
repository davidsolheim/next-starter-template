import { relations } from "drizzle-orm"
import { pgTable, text, timestamp, integer, index, uniqueIndex } from "drizzle-orm/pg-core"
import { organizations } from "./organizations"

export const paymentMethods = pgTable("payment_methods", {
  id: text("id").primaryKey(),
  orgId: text("org_id").notNull().references(() => organizations.id, { onDelete: "cascade" }),
  stripePaymentMethodId: text("stripe_payment_method_id").notNull(),
  brand: text("brand"),
  last4: text("last4"),
  expMonth: integer("exp_month"),
  expYear: integer("exp_year"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  stripeIdx: uniqueIndex("idx_payment_methods_stripe_id").on(table.stripePaymentMethodId),
  orgIdx: index("idx_payment_methods_org_id").on(table.orgId),
}))

export const paymentMethodsRelations = relations(paymentMethods, ({ one }) => ({
  organization: one(organizations, {
    fields: [paymentMethods.orgId],
    references: [organizations.id],
  }),
}))

export type PaymentMethod = typeof paymentMethods.$inferSelect
export type NewPaymentMethod = typeof paymentMethods.$inferInsert
