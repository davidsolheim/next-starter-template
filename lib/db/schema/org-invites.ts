import { relations } from "drizzle-orm"
import { pgTable, text, timestamp, index, uniqueIndex } from "drizzle-orm/pg-core"
import { inviteStatus, membershipRole } from "./enums"
import { organizations } from "./organizations"

export const orgInvites = pgTable("org_invites", {
  id: text("id").primaryKey(),
  orgId: text("org_id").notNull().references(() => organizations.id, { onDelete: "cascade" }),
  email: text("email").notNull(),
  role: membershipRole("role").notNull(),
  token: text("token").notNull(),
  status: inviteStatus("status").notNull().default("pending"),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  tokenIdx: uniqueIndex("idx_org_invites_token").on(table.token),
  orgIdx: index("idx_org_invites_org_id").on(table.orgId),
  emailIdx: index("idx_org_invites_email").on(table.email),
}))

export const orgInvitesRelations = relations(orgInvites, ({ one }) => ({
  organization: one(organizations, {
    fields: [orgInvites.orgId],
    references: [organizations.id],
  }),
}))

export type OrgInvite = typeof orgInvites.$inferSelect
export type NewOrgInvite = typeof orgInvites.$inferInsert
