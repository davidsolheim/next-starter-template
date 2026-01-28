import { relations } from "drizzle-orm"
import { pgTable, text, timestamp, boolean, uniqueIndex } from "drizzle-orm/pg-core"
import { notificationChannel } from "./enums"
import { users } from "./users"

export const notificationPreferences = pgTable("notification_preferences", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  channel: notificationChannel("channel").notNull(),
  enabled: boolean("enabled").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  userChannelIdx: uniqueIndex("idx_notification_preferences_user_channel").on(
    table.userId,
    table.channel,
  ),
}))

export const notificationPreferencesRelations = relations(notificationPreferences, ({ one }) => ({
  user: one(users, {
    fields: [notificationPreferences.userId],
    references: [users.id],
  }),
}))

export type NotificationPreference = typeof notificationPreferences.$inferSelect
export type NewNotificationPreference = typeof notificationPreferences.$inferInsert
