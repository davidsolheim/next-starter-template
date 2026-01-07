import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { auth } from "@/lib/auth"

export async function proxy(request: NextRequest) {
  // Check if the request is for admin routes
  if (request.nextUrl.pathname.startsWith("/admin")) {
    // Allow access to public admin pages (login, forgot password, reset password)
    const publicPaths = [
      "/admin/login",
      "/admin/forgot-password",
      "/admin/reset-password",
    ]
    
    if (publicPaths.includes(request.nextUrl.pathname)) {
      return NextResponse.next()
    }

    // Check authentication for all other admin routes
    const session = await auth()

    if (!session) {
      // Redirect to login if not authenticated
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}

