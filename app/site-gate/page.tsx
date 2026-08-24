import type { Metadata } from "next"
import { LockKeyhole } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { safeSiteGateNext } from "@/lib/site-gate"

export const metadata: Metadata = {
  title: "Protected review access",
  description: "Password-protected access while this deployment is in review.",
}

type SiteGatePageProps = {
  searchParams: Promise<{
    error?: string
    next?: string
  }>
}

export default async function SiteGatePage({ searchParams }: SiteGatePageProps) {
  const params = await searchParams
  const nextPath = safeSiteGateNext(params.next)
  const hasError = params.error === "invalid"

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 py-10">
      <section className="w-full max-w-md">
        <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
          <div className="mb-6">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-muted">
              <LockKeyhole className="h-5 w-5" aria-hidden="true" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Protected review access</h1>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Enter the review password to continue. User login is available after you pass this gate.
            </p>
          </div>

          <form action="/api/site-gate" method="post" className="space-y-4">
            <input type="hidden" name="next" value={nextPath} />
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                autoFocus
                aria-invalid={hasError}
                required
              />
            </div>

            {hasError && (
              <p
                role="alert"
                className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive"
              >
                That password did not match. Please try again.
              </p>
            )}

            <Button type="submit" className="h-11 w-full">
              Continue
            </Button>
          </form>
        </div>
      </section>
    </main>
  )
}
