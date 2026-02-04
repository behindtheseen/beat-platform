import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Download, FileMusic, Calendar, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: { success?: string }
}) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  const { data: purchases } = await supabase
    .from("licenses")
    .select("*, beats(*)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  const isNewPurchase = searchParams.success === "true"

  return (
    <div className="container py-8">
      {isNewPurchase && (
        <Card className="mb-8 border-green-500 bg-green-50">
          <CardContent className="p-4">
            <p className="text-green-700 font-medium">
              ✓ Purchase successful! Your beats are ready to download.
            </p>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Welcome back,</p>
              <CardTitle className="text-xl">{profile?.full_name || user.email}</CardTitle>
            </div>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <FileMusic className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Purchases</p>
              <CardTitle className="text-xl">{purchases?.length || 0}</CardTitle>
            </div>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Download className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Files Downloaded</p>
              <CardTitle className="text-xl">
                {purchases?.reduce((sum, p) => sum + (p.download_count || 0), 0) || 0}
              </CardTitle>
            </div>
          </CardHeader>
        </Card>
      </div>

      <h2 className="text-2xl font-bold mb-6">Purchase History</h2>

      {purchases && purchases.length > 0 ? (
        <div className="space-y-4">
          {purchases.map((purchase: any) => (
            <Card key={purchase.id}>
              <CardContent className="p-4 flex items-center gap-4">
                {purchase.beats?.cover_url ? (
                  <img
                    src={purchase.beats.cover_url}
                    alt={purchase.beats.title}
                    className="w-16 h-16 object-cover rounded"
                  />
                ) : (
                  <div className="w-16 h-16 bg-muted rounded flex items-center justify-center">
                    <FileMusic className="h-6 w-6 text-muted-foreground" />
                  </div>
                )}
                
                <div className="flex-1">
                  <h3 className="font-semibold">{purchase.beats?.title}</h3>
                  <div className="flex gap-2 mt-1">
                    <Badge variant="outline">
                      {purchase.license_type === "exclusive" ? "Exclusive" : "Basic"}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {purchase.beats?.bpm} BPM • {purchase.beats?.key}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-bold">${purchase.price_paid}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(purchase.created_at).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-8 text-center">
            <FileMusic className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-semibold text-lg">No purchases yet</h3>
            <p className="text-muted-foreground mt-1">
              Browse our catalog and start building your beat collection!
            </p>
            <Link href="/">
              <Button className="mt-4">Browse Beats</Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
