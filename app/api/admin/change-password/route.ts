import { NextRequest } from "next/server"
import { db } from "@/lib/db"
import { users } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import bcrypt from "bcryptjs"
import { jsonError, jsonOk, parseJson, requireUserId } from "@/lib/api/helpers"
import { z } from "zod"

const bodySchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8),
})

export async function POST(request: NextRequest) {
  try {
    const userId = await requireUserId()
    if (userId instanceof Response) return userId

    const parsed = await parseJson(request, bodySchema)
    if (parsed instanceof Response) return parsed

    const userResult = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1)

    if (userResult.length === 0) {
      return jsonError("User not found", 404)
    }

    const user = userResult[0]

    if (!user.password) {
      return jsonError("User does not have a password set", 400)
    }

    const isCurrentPasswordValid = await bcrypt.compare(parsed.currentPassword, user.password)
    if (!isCurrentPasswordValid) {
      return jsonError("Current password is incorrect", 400)
    }

    const hashedNewPassword = await bcrypt.hash(parsed.newPassword, 10)

    await db
      .update(users)
      .set({
        password: hashedNewPassword,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))

    return jsonOk({
      success: true,
      message: "Password changed successfully",
    })
  } catch (error) {
    console.error("Failed to change password:", error)
    return jsonError("An error occurred while changing password", 500)
  }
}
