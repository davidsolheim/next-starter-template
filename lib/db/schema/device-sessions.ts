import { relations } from "drizzle-orm"
import { pgTable, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core"
import { users } from "./users"
import { sessions } from "./sessions"

export const deviceSessions = pgTable("device_sessions", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  sessionId: text("session_id").notNull().references(() => sessions.id, { onDelete: "cascade" }),
  deviceName: text("device_name"),
  lastSeenAt: timestamp("last_seen_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  userSessionIdx: uniqueIndex("idx_device_sessions_user_session").on(
    table.userId,
    table.sessionId,
  ),
}))

export const deviceSessionsRelations = relations(deviceSessions, ({ one }) => ({
  user: one(users, {
    fields: [deviceSessions.userId],
    references: [users.id],
  }),
  session: one(sessions, {
    fields: [deviceSessions.sessionId],
    references: [sessions.id],
  }),
}))

export type DeviceSession = typeof deviceSessions.$inferSelect
export type NewDeviceSession = typeof deviceSessions.$inferInsert
