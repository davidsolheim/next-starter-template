export const SITE_GATE_COOKIE = "site_gate"
export const SITE_GATE_MAX_AGE_SECONDS = 60 * 60 * 24 * 30

const COOKIE_VERSION = "v1"

function base64UrlEncode(bytes: Uint8Array) {
  let binary = ""
  for (const byte of bytes) {
    binary += String.fromCharCode(byte)
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "")
}

function constantTimeEqual(a: string, b: string) {
  if (a.length !== b.length) return false

  let mismatch = 0
  for (let i = 0; i < a.length; i += 1) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }
  return mismatch === 0
}

async function signValue(secret: string, expiresAt: number) {
  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  )
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(`${COOKIE_VERSION}:${expiresAt}`),
  )
  return base64UrlEncode(new Uint8Array(signature))
}

export function isSiteGateEnabled() {
  return process.env.VERCEL_ENV === "preview" || process.env.VERCEL_ENV === "production"
}

export function siteGatePassword() {
  return process.env.SITE_GATE_PASSWORD ?? ""
}

export function safeSiteGateNext(value: string | null | undefined) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "/"
  }

  try {
    const url = new URL(value, "http://starter.local")
    return `${url.pathname}${url.search}`
  } catch {
    return "/"
  }
}

export async function createSiteGateCookieValue(secret: string) {
  const expiresAt = Date.now() + SITE_GATE_MAX_AGE_SECONDS * 1000
  const signature = await signValue(secret, expiresAt)
  return `${COOKIE_VERSION}.${expiresAt}.${signature}`
}

export async function verifySiteGateCookie(value: string | undefined, secret: string) {
  if (!value || !secret) return false

  const [version, expiresAtRaw, signature] = value.split(".")
  const expiresAt = Number(expiresAtRaw)
  if (version !== COOKIE_VERSION || !Number.isFinite(expiresAt) || !signature) {
    return false
  }
  if (expiresAt <= Date.now()) {
    return false
  }

  const expectedSignature = await signValue(secret, expiresAt)
  return constantTimeEqual(signature, expectedSignature)
}
