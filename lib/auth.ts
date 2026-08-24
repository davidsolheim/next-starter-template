import NextAuth from "next-auth"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import type { Adapter } from "next-auth/adapters"
import CredentialsProvider from "next-auth/providers/credentials"
import ResendProvider from "next-auth/providers/resend"
import { db } from "@/lib/db"
import * as schema from "@/lib/db/schema"
import { Resend as ResendClient } from "resend"
import { eq, sql } from "drizzle-orm"
import bcrypt from "bcryptjs"
import {
  renderResetPasswordEmail,
  renderSignInEmail,
  renderVerifyEmail,
} from "@/emails/render"

function getResend() {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not set")
  }
  return new ResendClient(apiKey)
}

const authAdapterSchema = {
  usersTable: schema.users,
  accountsTable: schema.accounts,
  verificationTokensTable: schema.verificationTokens,
} as unknown as Parameters<typeof DrizzleAdapter>[1]

async function isAccountBlocked(
  column: typeof schema.users.id | typeof schema.users.email,
  value: string,
): Promise<boolean> {
  const rows = await db
    .select({ deletedAt: schema.users.deletedAt })
    .from(schema.users)
    .where(eq(column, value))
    .limit(1)

  return Boolean(rows[0]?.deletedAt)
}

const createDrizzleAdapter = DrizzleAdapter as unknown as (
  database: typeof db,
  adapterSchema: typeof authAdapterSchema,
) => Adapter

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: createDrizzleAdapter(db, authAdapterSchema),
  providers: [
    ...(process.env.RESEND_API_KEY && process.env.EMAIL_FROM
      ? [
          ResendProvider({
            apiKey: process.env.RESEND_API_KEY,
            from: process.env.EMAIL_FROM,
            maxAge: 24 * 60 * 60,
            async sendVerificationRequest({ identifier: email, url }) {
              const resend = getResend()
              await resend.emails.send({
                from: process.env.EMAIL_FROM!,
                to: email,
                subject: "Sign in",
                html: await renderSignInEmail({ url }),
              })
            },
          }),
        ]
      : []),
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

        try {
          const email = String(credentials.email).trim().toLowerCase()
          const user = await db
            .select()
            .from(schema.users)
            .where(sql`lower(${schema.users.email}) = ${email}`)
            .limit(1)

          if (user.length === 0) {
            return null
          }

          const foundUser = user[0]

          if (foundUser.deletedAt) {
            return null
          }

          if (!foundUser.password) {
            return null
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password as string,
            foundUser.password,
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
        } catch (error) {
          console.error("[auth] credentials authorize failed:", error)
          return null
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      const email = user?.email
      if (!email) return true
      return !(await isAccountBlocked(schema.users.email, email))
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        if (await isAccountBlocked(schema.users.id, token.sub)) return session
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

export async function sendPasswordResetEmail(email: string, token: string) {
  const baseURL = process.env.AUTH_URL || process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
  const resetUrl = `${baseURL}/reset-password?token=${token}`
  const emailFrom = process.env.EMAIL_FROM!

  const resend = getResend()
  await resend.emails.send({
    from: emailFrom,
    to: email,
    subject: "Reset your password",
    html: await renderResetPasswordEmail({ url: resetUrl }),
  })
}

export async function sendVerificationEmail(email: string, url: string) {
  const emailFrom = process.env.EMAIL_FROM!

  const resend = getResend()
  await resend.emails.send({
    from: emailFrom,
    to: email,
    subject: "Verify your email",
    html: await renderVerifyEmail({ url }),
  })
}

export type Session = Awaited<ReturnType<typeof auth>>
