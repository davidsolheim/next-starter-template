import NextAuth from "next-auth"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import CredentialsProvider from "next-auth/providers/credentials"
import { drizzleDb } from "@/lib/db"
import * as schema from "@/lib/db/schema"
import { Resend } from "resend"
import { eq } from "drizzle-orm"
import bcrypt from "bcryptjs"

// Lazy initialization of Resend to avoid build-time errors
function getResend() {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not set")
  }
  return new Resend(apiKey)
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(drizzleDb, {
    schema: {
      users: schema.users,
      sessions: schema.sessions,
      accounts: schema.accounts,
      verificationTokens: schema.verificationTokens,
    },
  }),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await drizzleDb
          .select()
          .from(schema.users)
          .where(eq(schema.users.email, credentials.email as string))
          .limit(1)

        if (user.length === 0) {
          return null
        }

        const foundUser = user[0]

        if (!foundUser.password) {
          return null
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          foundUser.password
        )

        if (!isPasswordValid) {
          return null
        }

        return {
          id: foundUser.id,
          email: foundUser.email,
          name: foundUser.name,
          image: foundUser.image,
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub
      }
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id
      }
      return token
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.AUTH_SECRET,
})

// Helper function to send password reset email
export async function sendPasswordResetEmail(email: string, token: string) {
  const baseURL = process.env.AUTH_URL || process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
  const resetUrl = `${baseURL}/reset-password?token=${token}`
  const emailFrom = process.env.EMAIL_FROM!
  
  const resend = getResend()
  await resend.emails.send({
    from: emailFrom,
    to: email,
    subject: "Reset your password",
    html: `<p>Click <a href="${resetUrl}">here</a> to reset your password.</p>`,
  })
}

// Helper function to send verification email
export async function sendVerificationEmail(email: string, url: string) {
  const emailFrom = process.env.EMAIL_FROM!
  
  const resend = getResend()
  await resend.emails.send({
    from: emailFrom,
    to: email,
    subject: "Verify your email",
    html: `<p>Click <a href="${url}">here</a> to verify your email.</p>`,
  })
}

// Export session type
export type Session = Awaited<ReturnType<typeof auth>>
