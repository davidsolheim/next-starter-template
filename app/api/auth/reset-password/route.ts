import { NextRequest } from "next/server"
import { db } from "@/lib/db"
import { users, verificationTokens } from "@/lib/db/schema"
import { eq, sql } from "drizzle-orm"
import bcrypt from "bcryptjs"
import { jsonError, jsonOk, parseJson } from "@/lib/api/helpers"
import { rateLimitRequest } from "@/lib/api/rate-limit"
import { z } from "zod"

const bodySchema = z.object({
  token: z.string().min(1),
  newPassword: z.string().min(8),
})

export async function POST(request: NextRequest) {
  try {
    const limited = rateLimitRequest(request, "reset-password", { limit: 10, windowMs: 60_000 })
    if (limited) return limited

    const parsed = await parseJson(request, bodySchema)
    if (parsed instanceof Response) return parsed

    const { token, newPassword } = parsed

    const tokenResult = await db
      .select()
      .from(verificationTokens)
      .where(eq(verificationTokens.token, token))
      .limit(1)

    if (tokenResult.length === 0) {
      return jsonError("Invalid or expired reset token", 400)
    }

    const verificationToken = tokenResult[0]

    if (new Date(verificationToken.expires) < new Date()) {
      await db.delete(verificationTokens).where(eq(verificationTokens.token, token))
      return jsonError("Invalid or expired reset token", 400)
    }

    const email = verificationToken.identifier.toLowerCase()
    const userResult = await db
      .select()
      .from(users)
      .where(sql`lower(${users.email}) = ${email}`)
      .limit(1)

    if (userResult.length === 0 || userResult[0].deletedAt) {
      return jsonError("User not found", 404)
    }

    const user = userResult[0]
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    await db
      .update(users)
      .set({
        password: hashedPassword,
        updatedAt: new Date(),
      })
      .where(eq(users.id, user.id))

    await db.delete(verificationTokens).where(eq(verificationTokens.token, token))

    return jsonOk({
      success: true,
      message: "Password reset successfully",
    })
  } catch (error) {
    console.error("Failed to reset password:", error)
    return jsonError("Failed to reset password", 500)
  }
}
