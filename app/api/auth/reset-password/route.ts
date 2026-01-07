import { NextRequest, NextResponse } from "next/server"
import { drizzleDb } from "@/lib/db"
import { users, verificationTokens } from "@/lib/db/schema"
import { eq, and } from "drizzle-orm"
import bcrypt from "bcryptjs"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { token, newPassword } = body

    if (!token || !newPassword) {
      return NextResponse.json(
        { error: "Token and new password are required" },
        { status: 400 }
      )
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters long" },
        { status: 400 }
      )
    }

    // Find the verification token
    const tokenResult = await drizzleDb
      .select()
      .from(verificationTokens)
      .where(eq(verificationTokens.token, token))
      .limit(1)

    if (tokenResult.length === 0) {
      return NextResponse.json(
        { error: "Invalid or expired reset token" },
        { status: 400 }
      )
    }

    const verificationToken = tokenResult[0]

    // Check if token is expired
    if (new Date(verificationToken.expires) < new Date()) {
      // Delete expired token
      await drizzleDb
        .delete(verificationTokens)
        .where(eq(verificationTokens.token, token))

      return NextResponse.json(
        { error: "Invalid or expired reset token" },
        { status: 400 }
      )
    }

    // Find user by email (identifier)
    const userResult = await drizzleDb
      .select()
      .from(users)
      .where(eq(users.email, verificationToken.identifier))
      .limit(1)

    if (userResult.length === 0) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    const user = userResult[0]

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    // Update user password
    await drizzleDb
      .update(users)
      .set({
        password: hashedPassword,
        updatedAt: new Date(),
      })
      .where(eq(users.id, user.id))

    // Delete the used token
    await drizzleDb
      .delete(verificationTokens)
      .where(eq(verificationTokens.token, token))

    return NextResponse.json({
      success: true,
      message: "Password reset successfully",
    })
  } catch (error: any) {
    console.error("Failed to reset password:", error)
    return NextResponse.json(
      { error: "Failed to reset password" },
      { status: 500 }
    )
  }
}

