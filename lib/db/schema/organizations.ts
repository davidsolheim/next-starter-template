import { relations } from "drizzle-orm"
import { pgTable, text, timestamp, index, uniqueIndex } from "drizzle-orm/pg-core"
import { users } from "./users"
import { memberships } from "./memberships"
import { teams } from "./teams"
import { projects } from "./projects"
import { subscriptions } from "./subscriptions"
import { auditLogs } from "./audit-logs"
import { apiKeys } from "./api-keys"
import { notifications } from "./notifications"
import { webhooks } from "./webhooks"
import { featureFlagOverrides } from "./feature-flag-overrides"
import { customers } from "./customers"

export const organizations = pgTable("organizations", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  stripeCustomerId: text("stripe_customer_id"),
  createdBy: text("created_by").references(() => users.id),
  updatedBy: text("updated_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  deletedAt: timestamp("deleted_at"),
}, (table) => ({
  slugIdx: uniqueIndex("idx_orgs_slug").on(table.slug),
  nameIdx: index("idx_orgs_name").on(table.name),
}))

export const organizationsRelations = relations(organizations, ({ many, one }) => ({
  createdByUser: one(users, {
    fields: [organizations.createdBy],
    references: [users.id],
  }),
  updatedByUser: one(users, {
    fields: [organizations.updatedBy],
    references: [users.id],
  }),
  memberships: many(memberships),
  teams: many(teams),
  projects: many(projects),
  subscriptions: many(subscriptions),
  auditLogs: many(auditLogs),
  apiKeys: many(apiKeys),
  notifications: many(notifications),
  webhooks: many(webhooks),
  featureFlagOverrides: many(featureFlagOverrides),
  customers: many(customers),
}))

export type Organization = typeof organizations.$inferSelect
export type NewOrganization = typeof organizations.$inferInsert
