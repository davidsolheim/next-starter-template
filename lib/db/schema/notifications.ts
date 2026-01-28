import { relations } from "drizzle-orm"
import { pgTable, text, timestamp, index } from "drizzle-orm/pg-core"
import { notificationChannel } from "./enums"
import { users } from "./users"
import { organizations } from "./organizations"

export const notifications = pgTable("notifications", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  orgId: text("org_id").references(() => organizations.id, { onDelete: "cascade" }),
  channel: notificationChannel("channel").notNull(),
  title: text("title").notNull(),
  body: text("body"),
  readAt: timestamp("read_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  userIdx: index("idx_notifications_user_id").on(table.userId),
  orgIdx: index("idx_notifications_org_id").on(table.orgId),
}))

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
  organization: one(organizations, {
    fields: [notifications.orgId],
    references: [organizations.id],
  }),
}))

export type Notification = typeof notifications.$inferSelect
export type NewNotification = typeof notifications.$inferInsert
