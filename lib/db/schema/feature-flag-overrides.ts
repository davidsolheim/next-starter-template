import { relations } from "drizzle-orm"
import { pgTable, text, timestamp, boolean, uniqueIndex } from "drizzle-orm/pg-core"
import { featureFlags } from "./feature-flags"
import { organizations } from "./organizations"
import { users } from "./users"

export const featureFlagOverrides = pgTable("feature_flag_overrides", {
  id: text("id").primaryKey(),
  featureFlagId: text("feature_flag_id").notNull().references(() => featureFlags.id, { onDelete: "cascade" }),
  orgId: text("org_id").references(() => organizations.id, { onDelete: "cascade" }),
  userId: text("user_id").references(() => users.id, { onDelete: "cascade" }),
  value: boolean("value").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  overrideIdx: uniqueIndex("idx_feature_flag_overrides_scope").on(
    table.featureFlagId,
    table.orgId,
    table.userId,
  ),
}))

export const featureFlagOverridesRelations = relations(featureFlagOverrides, ({ one }) => ({
  featureFlag: one(featureFlags, {
    fields: [featureFlagOverrides.featureFlagId],
    references: [featureFlags.id],
  }),
  organization: one(organizations, {
    fields: [featureFlagOverrides.orgId],
    references: [organizations.id],
  }),
  user: one(users, {
    fields: [featureFlagOverrides.userId],
    references: [users.id],
  }),
}))

export type FeatureFlagOverride = typeof featureFlagOverrides.$inferSelect
export type NewFeatureFlagOverride = typeof featureFlagOverrides.$inferInsert
