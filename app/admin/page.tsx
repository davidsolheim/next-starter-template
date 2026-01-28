import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default async function AdminPage() {
  const session = await auth()

  if (!session) {
    redirect("/login")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Admin Dashboard</CardTitle>
          <CardDescription>Welcome to your admin dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This is a starter template. Add your admin functionality here.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
