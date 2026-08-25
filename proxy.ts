import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { auth, isAccountBlocked } from "@/lib/auth"
import {
  isSiteGateEnabled,
  safeSiteGateNext,
  SITE_GATE_COOKIE,
  siteGatePassword,
  verifySiteGateCookie,
} from "@/lib/site-gate"

function isAdminPath(pathname: string) {
  return pathname === "/admin" || pathname.startsWith("/admin/")
}

function isGateRoute(pathname: string) {
  return pathname === "/site-gate" || pathname === "/api/site-gate"
}

function isStaticAsset(pathname: string) {
  return (
    pathname.startsWith("/_next/") ||
    pathname === "/favicon.ico" ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml" ||
    pathname === "/manifest.webmanifest" ||
    /\.[a-zA-Z0-9]+$/.test(pathname)
  )
}

function isSiteGateExempt(pathname: string) {
  return isStaticAsset(pathname) || pathname === "/api/health"
}

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl
  const password = siteGatePassword()

  if (isSiteGateEnabled() && password && !isSiteGateExempt(pathname)) {
    const hasGateAccess = await verifySiteGateCookie(
      request.cookies.get(SITE_GATE_COOKIE)?.value,
      password,
    )

    if (isGateRoute(pathname)) {
      if (hasGateAccess && pathname === "/site-gate") {
        return NextResponse.redirect(
          new URL(safeSiteGateNext(request.nextUrl.searchParams.get("next")), request.url),
        )
      }
      return NextResponse.next()
    }

    if (!hasGateAccess) {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json({ error: "Site gate access required." }, { status: 401 })
      }

      const gate = new URL("/site-gate", request.url)
      gate.searchParams.set("next", safeSiteGateNext(`${pathname}${search}`))
      return NextResponse.redirect(gate)
    }
  }

  if (pathname === "/admin/login") {
    const login = new URL("/login", request.url)
    login.searchParams.set("callbackUrl", `/admin${search}`)
    return NextResponse.redirect(login)
  }

  if (isAdminPath(pathname)) {
    const session = await auth.api.getSession({ headers: request.headers })
    if (!session || await isAccountBlocked(session.user.id)) {
      const login = new URL("/login", request.url)
      login.searchParams.set("callbackUrl", `${pathname}${search}`)
      return NextResponse.redirect(login)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
}
