import { relations } from "drizzle-orm"
import { pgTable, text, timestamp, integer, index, uniqueIndex } from "drizzle-orm/pg-core"
import { organizations } from "./organizations"

export const invoices = pgTable("invoices", {
  id: text("id").primaryKey(),
  orgId: text("org_id").notNull().references(() => organizations.id, { onDelete: "cascade" }),
  stripeInvoiceId: text("stripe_invoice_id").notNull(),
  amountDue: integer("amount_due"),
  currency: text("currency"),
  status: text("status"),
  periodStart: timestamp("period_start"),
  periodEnd: timestamp("period_end"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  stripeIdx: uniqueIndex("idx_invoices_stripe_id").on(table.stripeInvoiceId),
  orgIdx: index("idx_invoices_org_id").on(table.orgId),
}))

export const invoicesRelations = relations(invoices, ({ one }) => ({
  organization: one(organizations, {
    fields: [invoices.orgId],
    references: [organizations.id],
  }),
}))

export type Invoice = typeof invoices.$inferSelect
export type NewInvoice = typeof invoices.$inferInsert
