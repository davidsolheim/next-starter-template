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
              <li>Better Auth authentication</li>
              <li>Resend email integration</li>
              <li>Tailwind CSS 4 + shadcn/ui components</li>
              <li>TypeScript</li>
            </ul>
          </div>
          <div className="flex flex-wrap gap-4 pt-4">
            <Button asChild>
              <Link href="/admin">Admin Dashboard</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/contact">Contact</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/privacy">Privacy</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/terms">Terms</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
