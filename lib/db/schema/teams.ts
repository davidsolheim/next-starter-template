import { relations } from "drizzle-orm"
import { pgTable, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core"
import { organizations } from "./organizations"
import { teamMemberships } from "./team-memberships"

export const teams = pgTable("teams", {
  id: text("id").primaryKey(),
  orgId: text("org_id").notNull().references(() => organizations.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  orgSlugIdx: uniqueIndex("idx_teams_org_slug").on(table.orgId, table.slug),
}))

export const teamsRelations = relations(teams, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [teams.orgId],
    references: [organizations.id],
  }),
  memberships: many(teamMemberships),
}))

export type Team = typeof teams.$inferSelect
export type NewTeam = typeof teams.$inferInsert
