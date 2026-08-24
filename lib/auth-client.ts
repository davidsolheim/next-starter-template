"use client"

import { useSession as useNextAuthSession, signIn as nextAuthSignIn, signOut as nextAuthSignOut } from "next-auth/react"

export function useSession() {
  const { data: session, status } = useNextAuthSession()
  return {
    data: session,
    isPending: status === "loading",
  }
}

export async function signIn(email: string, password: string) {
  const result = await nextAuthSignIn("credentials", {
    email,
    password,
    redirect: false,
  })

  if (result?.error) {
    return {
      error: {
        message: result.error,
      },
    }
  }

  return { data: result, error: null }
}

export const signOut = async () => {
  await nextAuthSignOut({ redirect: false })
}

export async function forgetPassword(email: string) {
  const response = await fetch("/api/auth/forgot-password", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  })

  const data = await response.json()

  if (!response.ok) {
    return {
      error: {
        message: data.error || "Failed to send password reset email",
      },
    }
  }

  return { data, error: null }
}

export async function resetPassword(token: string, newPassword: string) {
  const response = await fetch("/api/auth/reset-password", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token, newPassword }),
  })

  const data = await response.json()

  if (!response.ok) {
    return {
      error: {
        message: data.error || "Failed to reset password",
      },
    }
  }

  return { data, error: null }
}

export async function changePassword(currentPassword: string, newPassword: string) {
  const response = await fetch("/api/admin/change-password", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      currentPassword,
      newPassword,
    }),
  })

  const data = await response.json()

  if (!response.ok) {
    return {
      error: {
        message: data.error || "Failed to change password",
      },
    }
  }

  return { data, error: null }
}

export interface User {
  id: string
  email: string
  name: string
}

export interface Session {
  user: User
}
