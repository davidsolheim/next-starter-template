import { NextRequest, NextResponse } from "next/server"
import {
  createSiteGateCookieValue,
  isSiteGateEnabled,
  safeSiteGateNext,
  SITE_GATE_COOKIE,
  SITE_GATE_MAX_AGE_SECONDS,
  siteGatePassword,
} from "@/lib/site-gate"

function shouldUseSecureCookie(request: NextRequest) {
  return isSiteGateEnabled() && !["localhost", "127.0.0.1"].includes(request.nextUrl.hostname)
}

function gateRedirect(request: NextRequest, nextPath: string, error?: string) {
  const url = new URL("/site-gate", request.url)
  url.searchParams.set("next", nextPath)
  if (error) {
    url.searchParams.set("error", error)
  }
  return NextResponse.redirect(url, { status: 303 })
}

export async function POST(request: NextRequest) {
  const form = await request.formData()
  const password = String(form.get("password") ?? "")
  const nextPath = safeSiteGateNext(String(form.get("next") ?? "/"))
  const expectedPassword = siteGatePassword()

  if (!expectedPassword || password !== expectedPassword) {
    return gateRedirect(request, nextPath, "invalid")
  }

  const response = NextResponse.redirect(new URL(nextPath, request.url), { status: 303 })
  response.cookies.set({
    name: SITE_GATE_COOKIE,
    value: await createSiteGateCookieValue(expectedPassword),
    httpOnly: true,
    maxAge: SITE_GATE_MAX_AGE_SECONDS,
    path: "/",
    sameSite: "lax",
    secure: shouldUseSecureCookie(request),
  })
  return response
}
