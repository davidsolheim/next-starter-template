import { NextRequest, NextResponse } from "next/server"
import { drizzleDb } from "@/lib/db"
import { users, verificationTokens } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { sendPasswordResetEmail } from "@/lib/auth"
import crypto from "crypto"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    // Find user by email
    const userResult = await drizzleDb
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1)

    // Always return success to prevent email enumeration
    if (userResult.length === 0) {
      return NextResponse.json({ success: true, message: "If an account with that email exists, a password reset link has been sent." })
    }

    const user = userResult[0]

    // Generate reset token
    const token = crypto.randomBytes(32).toString("hex")
    const expires = new Date()
    expires.setHours(expires.getHours() + 1) // Token expires in 1 hour

    // Delete any existing tokens for this user
    await drizzleDb
      .delete(verificationTokens)
      .where(eq(verificationTokens.identifier, email))

    // Store the token
    await drizzleDb.insert(verificationTokens).values({
      identifier: email,
      token: token,
      expires: expires,
    })

    // Send password reset email
    await sendPasswordResetEmail(email, token)

    return NextResponse.json({
      success: true,
      message: "If an account with that email exists, a password reset link has been sent.",
    })
  } catch (error: any) {
    console.error("Failed to send password reset email:", error)
    return NextResponse.json(
      { error: "Failed to send password reset email" },
      { status: 500 }
    )
  }
}

