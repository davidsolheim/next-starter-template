import { NextRequest } from "next/server"
import { db } from "@/lib/db"
import { users, verificationTokens } from "@/lib/db/schema"
import { eq, sql } from "drizzle-orm"
import { sendPasswordResetEmail } from "@/lib/auth"
import { jsonError, jsonOk, parseJson } from "@/lib/api/helpers"
import { rateLimitRequest } from "@/lib/api/rate-limit"
import { z } from "zod"

const bodySchema = z.object({
  email: z.string().email(),
})

export async function POST(request: NextRequest) {
  try {
    const limited = rateLimitRequest(request, "forgot-password", { limit: 5, windowMs: 60_000 })
    if (limited) return limited

    const parsed = await parseJson(request, bodySchema)
    if (parsed instanceof Response) return parsed

    const email = parsed.email.trim().toLowerCase()

    const userResult = await db
      .select()
      .from(users)
      .where(sql`lower(${users.email}) = ${email}`)
      .limit(1)

    if (userResult.length === 0 || userResult[0].deletedAt) {
      return jsonOk({
        success: true,
        message: "If an account with that email exists, a password reset link has been sent.",
      })
    }

    const token = crypto.randomUUID().replace(/-/g, "") + crypto.randomUUID().replace(/-/g, "")
    const expires = new Date()
    expires.setHours(expires.getHours() + 1)

    await db.delete(verificationTokens).where(eq(verificationTokens.identifier, email))

    await db.insert(verificationTokens).values({
      identifier: email,
      token,
      expires,
    })

    await sendPasswordResetEmail(email, token)

    return jsonOk({
      success: true,
      message: "If an account with that email exists, a password reset link has been sent.",
    })
  } catch (error) {
    console.error("Failed to send password reset email:", error)
    return jsonError("Failed to send password reset email", 500)
  }
}
