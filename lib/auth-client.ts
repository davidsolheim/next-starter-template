"use client"

import { useSession as useNextAuthSession, signIn as nextAuthSignIn, signOut as nextAuthSignOut } from "next-auth/react"

// Re-export useSession hook from NextAuth.js
export function useSession() {
  const { data: session, status } = useNextAuthSession()
  return {
    data: session,
    isPending: status === "loading",
  }
}

// Sign in function
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

// Sign out function
export const signOut = async () => {
  await nextAuthSignOut({ redirect: false })
}

// Forgot password function (custom implementation)
export async function forgetPassword(email: string) {
  const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
  
  const response = await fetch(`${baseURL}/api/auth/forgot-password`, {
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

// Reset password function (custom implementation)
export async function resetPassword(token: string, newPassword: string) {
  const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
  
  const response = await fetch(`${baseURL}/api/auth/reset-password`, {
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

// Change password function for authenticated users
export async function changePassword(currentPassword: string, newPassword: string) {
  const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
  
  const response = await fetch(`${baseURL}/api/admin/change-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // Include cookies for authentication
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

// Re-export for backward compatibility
export interface User {
  id: string
  email: string
  name: string
}

export interface Session {
  user: User
}
