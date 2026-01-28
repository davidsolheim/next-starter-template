import { relations } from "drizzle-orm"
import { pgTable, text, timestamp, boolean, uniqueIndex } from "drizzle-orm/pg-core"
import { featureFlagOverrides } from "./feature-flag-overrides"

export const featureFlags = pgTable("feature_flags", {
  id: text("id").primaryKey(),
  key: text("key").notNull(),
  description: text("description"),
  defaultValue: boolean("default_value").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  keyIdx: uniqueIndex("idx_feature_flags_key").on(table.key),
}))

export const featureFlagsRelations = relations(featureFlags, ({ many }) => ({
  overrides: many(featureFlagOverrides),
}))

export type FeatureFlag = typeof featureFlags.$inferSelect
export type NewFeatureFlag = typeof featureFlags.$inferInsert
