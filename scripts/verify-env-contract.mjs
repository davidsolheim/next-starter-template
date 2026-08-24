#!/usr/bin/env node

export const REQUIRED_ENV_KEYS = ["DATABASE_URL", "AUTH_SECRET"]

export const RECOMMENDED_ENV_KEYS = [
  "RESEND_API_KEY",
  "EMAIL_FROM",
  "NEXT_PUBLIC_SITE_URL",
  "NEXT_PUBLIC_SITE_NAME",
]

export function verifyEnvContract(env = process.env) {
  const missing = REQUIRED_ENV_KEYS.filter((key) => !env[key]?.trim())
  const missingRecommended = RECOMMENDED_ENV_KEYS.filter((key) => !env[key]?.trim())
  const dopplerContext = [env.DOPPLER_PROJECT, env.DOPPLER_CONFIG].filter(Boolean).join("/")

  return { missing, missingRecommended, dopplerContext }
}

const isDirectRun = import.meta.main === true || process.argv[1]?.endsWith("verify-env-contract.mjs")

if (isDirectRun) {
  const { missing, missingRecommended, dopplerContext } = verifyEnvContract()

  if (missing.length > 0) {
    console.error(
      [
        "Missing required application environment variables:",
        ...missing.map((key) => `- ${key}`),
        "",
        dopplerContext
          ? `Doppler context detected: ${dopplerContext}`
          : "No Doppler context detected. Run through `bun run env:verify:doppler` or `doppler run -- ...`.",
      ].join("\n"),
    )
    process.exit(1)
  }

  if (missingRecommended.length > 0) {
    console.warn(
      [
        "Warning: missing recommended environment variables:",
        ...missingRecommended.map((key) => `- ${key}`),
      ].join("\n"),
    )
  }

  console.log(
    dopplerContext
      ? `Required application environment variables are present via ${dopplerContext}.`
      : "Required application environment variables are present.",
  )
}
