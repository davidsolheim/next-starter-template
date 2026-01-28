import { relations } from "drizzle-orm"
import { pgTable, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core"
import { teams } from "./teams"
import { memberships } from "./memberships"

export const teamMemberships = pgTable("team_memberships", {
  id: text("id").primaryKey(),
  teamId: text("team_id").notNull().references(() => teams.id, { onDelete: "cascade" }),
  membershipId: text("membership_id").notNull().references(() => memberships.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  teamMembershipIdx: uniqueIndex("idx_team_memberships_team_membership").on(
    table.teamId,
    table.membershipId,
  ),
}))

export const teamMembershipsRelations = relations(teamMemberships, ({ one }) => ({
  team: one(teams, {
    fields: [teamMemberships.teamId],
    references: [teams.id],
  }),
  membership: one(memberships, {
    fields: [teamMemberships.membershipId],
    references: [memberships.id],
  }),
}))

export type TeamMembership = typeof teamMemberships.$inferSelect
export type NewTeamMembership = typeof teamMemberships.$inferInsert
