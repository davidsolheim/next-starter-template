const DEFAULT_INDEXABLE_HOSTS = ["localhost"]

export const NON_INDEXABLE_ROBOTS_TAG = "noindex, nofollow, noarchive, nosnippet"

function normalizeHost(host: string | null | undefined): string {
  if (!host) return ""
  return host.split(",")[0]?.trim().split(":")[0]?.toLowerCase() ?? ""
}

function parseIndexableHosts(value: string | undefined): string[] {
  if (!value) return DEFAULT_INDEXABLE_HOSTS
  const hosts = value
    .split(",")
    .map((entry) => normalizeHost(entry))
    .filter(Boolean)
  return hosts.length > 0 ? hosts : DEFAULT_INDEXABLE_HOSTS
}

export function getIndexableHosts(env = process.env): string[] {
  return parseIndexableHosts(env.INDEXABLE_HOSTS)
}

export function isIndexableHost(host: string | null | undefined, env = process.env): boolean {
  const normalizedHost = normalizeHost(host)
  if (!normalizedHost) return false
  return getIndexableHosts(env).includes(normalizedHost)
}

export function isSearchIndexingEnabled(env = process.env): boolean {
  return env.SEARCH_INDEXING_ENABLED?.trim().toLowerCase() === "true"
}

export function isPreviewDeployment(env = process.env): boolean {
  return env.VERCEL_ENV?.trim().toLowerCase() === "preview"
}

export function isSearchIndexingAllowed(env = process.env, host?: string | null): boolean {
  if (isPreviewDeployment(env)) return false
  if (!isSearchIndexingEnabled(env)) return false
  if (host) return isIndexableHost(host, env)
  return true
}

export function getCanonicalSiteUrl(env = process.env): string {
  const configured =
    env.CANONICAL_SITE_URL?.trim() || env.NEXT_PUBLIC_SITE_URL?.trim() || "http://localhost:3000"
  return configured.replace(/\/+$/, "")
}

export function siteName(env = process.env): string {
  return env.NEXT_PUBLIC_SITE_NAME?.trim() || "My App"
}
