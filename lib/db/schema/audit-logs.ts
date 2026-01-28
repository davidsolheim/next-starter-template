import { relations } from "drizzle-orm"
import { pgTable, text, timestamp, jsonb, index } from "drizzle-orm/pg-core"
import { auditAction } from "./enums"
import { organizations } from "./organizations"
import { users } from "./users"

export const auditLogs = pgTable("audit_logs", {
  id: text("id").primaryKey(),
  orgId: text("org_id").notNull().references(() => organizations.id, { onDelete: "cascade" }),
  actorUserId: text("actor_user_id").references(() => users.id, { onDelete: "set null" }),
  action: auditAction("action").notNull(),
  entityType: text("entity_type"),
  entityId: text("entity_id"),
  metadata: jsonb("metadata"),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  orgIdx: index("idx_audit_logs_org_id").on(table.orgId),
  entityIdx: index("idx_audit_logs_entity").on(table.entityType, table.entityId),
  actorIdx: index("idx_audit_logs_actor").on(table.actorUserId),
}))

export const auditLogsRelations = relations(auditLogs, ({ one }) => ({
  organization: one(organizations, {
    fields: [auditLogs.orgId],
    references: [organizations.id],
  }),
  actor: one(users, {
    fields: [auditLogs.actorUserId],
    references: [users.id],
  }),
}))

export type AuditLog = typeof auditLogs.$inferSelect
export type NewAuditLog = typeof auditLogs.$inferInsert
