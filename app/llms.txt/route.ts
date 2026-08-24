import { getCanonicalSiteUrl, siteName } from "@/lib/site-visibility"

export function GET() {
  const origin = getCanonicalSiteUrl()
  const name = siteName()
  const body = [
    `# ${name}`,
    "",
    `> ${name} public pages.`,
    "",
    `- [Home](${origin}/)`,
    `- [Contact](${origin}/contact)`,
    `- [Privacy](${origin}/privacy)`,
    `- [Terms](${origin}/terms)`,
    `- [Articles](${origin}/articles)`,
  ].join("\n")

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  })
}
