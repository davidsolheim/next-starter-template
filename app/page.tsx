import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "My App"

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-4xl">{siteName}</CardTitle>
          <CardDescription className="text-lg">
            A Next.js starter template with authentication, database, and modern tooling
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-xl font-semibold">Features</h3>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>Next.js 16 with App Router</li>
              <li>Drizzle ORM with Neon PostgreSQL</li>
              <li>NextAuth.js v5 authentication</li>
              <li>Resend email integration</li>
              <li>Stripe payment integration</li>
              <li>Tailwind CSS 4 + shadcn/ui components</li>
              <li>TypeScript</li>
            </ul>
          </div>
          <div className="flex gap-4 pt-4">
            <Button asChild>
              <Link href="/admin">Admin Dashboard</Link>
            </Button>
            <Button variant="outline" asChild>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                Documentation
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
