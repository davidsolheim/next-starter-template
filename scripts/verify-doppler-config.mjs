#!/usr/bin/env node

import { spawnSync } from "node:child_process"

const REQUIRED_SECRET_NAMES = [
  "DATABASE_URL",
  "AUTH_SECRET",
  "NEXT_PUBLIC_SITE_URL",
  "NEXT_PUBLIC_SITE_NAME",
]

function parseArgs(argv) {
  const args = {
    project: process.env.DOPPLER_PROJECT || "next-starter-template",
    config: process.env.DOPPLER_CONFIG || "development",
  }

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index]

    if (arg === "--project" || arg === "-p") {
      args.project = argv[index + 1]
      index += 1
      continue
    }

    if (arg.startsWith("--project=")) {
      args.project = arg.slice("--project=".length)
      continue
    }

    if (arg === "--config" || arg === "-c") {
      args.config = argv[index + 1]
      index += 1
      continue
    }

    if (arg.startsWith("--config=")) {
      args.config = arg.slice("--config=".length)
      continue
    }
  }

  return args
}

function fail(message) {
  console.error(message)
  process.exit(1)
}

const { project, config } = parseArgs(process.argv.slice(2))

if (!project || !config) {
  fail("Usage: bun run doppler:verify -- --project <project> --config <config>")
}

const result = spawnSync(
  "doppler",
  ["secrets", "--only-names", "--json", "-p", project, "-c", config],
  { encoding: "utf8" },
)

if (result.error) {
  fail(`Unable to run Doppler CLI: ${result.error.message}`)
}

if (result.status !== 0) {
  const details = result.stderr.trim() || result.stdout.trim()
  fail(`Unable to read Doppler secret names for ${project}/${config}.\n${details}`)
}

let payload

try {
  payload = JSON.parse(result.stdout)
} catch {
  fail("Doppler returned invalid JSON while listing secret names.")
}

const secretNames = new Set(Object.keys(payload))
const missing = REQUIRED_SECRET_NAMES.filter((name) => !secretNames.has(name))

if (missing.length > 0) {
  fail(
    [
      `Doppler config ${project}/${config} is missing required app secret names:`,
      ...missing.map((name) => `- ${name}`),
      "",
      "No secret values were read or printed. Add these names in Doppler, sync to Vercel, then redeploy.",
    ].join("\n"),
  )
}

console.log(`Doppler config ${project}/${config} contains required app secret names.`)
