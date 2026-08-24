import bcrypt from "bcryptjs"
import { eq, sql } from "drizzle-orm"
import { db } from "@/lib/db"
import { users } from "@/lib/db/schema"

async function main() {
  const email = (process.env.SEED_ADMIN_EMAIL || "admin@example.com").trim().toLowerCase()
  const password = process.env.SEED_ADMIN_PASSWORD || "changeme-admin-password"
  const name = process.env.SEED_ADMIN_NAME || "Admin"

  if (!process.env.DATABASE_URL && !process.env.NEON_DATABASE_URL) {
    console.error("DATABASE_URL is required to seed an admin user.")
    process.exit(1)
  }

  const existing = await db
    .select({ id: users.id })
    .from(users)
    .where(sql`lower(${users.email}) = ${email}`)
    .limit(1)

  if (existing[0]) {
    await db
      .update(users)
      .set({
        capabilities: ["admin"],
        deletedAt: null,
        updatedAt: new Date(),
      })
      .where(eq(users.id, existing[0].id))
    console.log(`Admin user already exists (${email}); capabilities set to admin.`)
    return
  }

  const hashedPassword = await bcrypt.hash(password, 10)
  await db.insert(users).values({
    id: crypto.randomUUID(),
    email,
    name,
    password: hashedPassword,
    capabilities: ["admin"],
  })

  console.log(`Created admin user ${email}. Change the password after first login.`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
