import { relations } from "drizzle-orm"
import { pgTable, text, timestamp, jsonb, index } from "drizzle-orm/pg-core"
import { organizations } from "./organizations"

export const backgroundTasks = pgTable("background_tasks", {
  id: text("id").primaryKey(),
  orgId: text("org_id").references(() => organizations.id, { onDelete: "cascade" }),
  type: text("type").notNull(),
  payload: jsonb("payload"),
  status: text("status").notNull(),
  runAt: timestamp("run_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  orgIdx: index("idx_background_tasks_org_id").on(table.orgId),
  statusRunIdx: index("idx_background_tasks_status_run_at").on(table.status, table.runAt),
}))

export const backgroundTasksRelations = relations(backgroundTasks, ({ one }) => ({
  organization: one(organizations, {
    fields: [backgroundTasks.orgId],
    references: [organizations.id],
  }),
}))

export type BackgroundTask = typeof backgroundTasks.$inferSelect
export type NewBackgroundTask = typeof backgroundTasks.$inferInsert
