import { pgTable, text, timestamp, boolean, index } from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"
import { sessions } from "./sessions"
import { accounts } from "./accounts"
import { memberships } from "./memberships"
import { notifications } from "./notifications"
import { notificationPreferences } from "./notification-preferences"
import { auditLogs } from "./audit-logs"
import { apiKeys } from "./api-keys"
import { deviceSessions } from "./device-sessions"
import { comments } from "./comments"
import { files } from "./files"
import { featureFlagOverrides } from "./feature-flag-overrides"

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false),
  image: text("image"),
  password: text("password"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  emailIdx: index("idx_users_email").on(table.email),
}))

export const usersRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
  accounts: many(accounts),
  memberships: many(memberships),
  notifications: many(notifications),
  notificationPreferences: many(notificationPreferences),
  auditLogs: many(auditLogs),
  apiKeys: many(apiKeys),
  deviceSessions: many(deviceSessions),
  comments: many(comments),
  files: many(files),
  featureFlagOverrides: many(featureFlagOverrides),
}))

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert

