import { pgTable, text, timestamp, index } from "drizzle-orm/pg-core"

export const contactInquiries = pgTable("contact_inquiries", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  message: text("message").notNull(),
  ipAddress: text("ip_address"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  emailIdx: index("idx_contact_inquiries_email").on(table.email),
}))
