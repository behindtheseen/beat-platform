import { createClient } from "@/lib/supabase/server"
import { BeatCard } from "@/components/beat-card"
import type { Beat } from "@/store/cart"

export default async function Home() {
  const supabase = await createClient()
  
  const { data: beats } = await supabase
    .from("beats")
    .select("*")
    .eq("status", "active")
    .order("created_at", { ascending: false })

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight">Premium Beats</h1>
        <p className="text-muted-foreground mt-2">
          High-quality beats for your next hit
        </p>
      </div>

      {beats && beats.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {beats.map((beat: any) => (
            <BeatCard key={beat.id} beat={beat as Beat} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-muted-foreground">No beats available yet.</p>
          <p className="text-sm text-muted-foreground mt-2">
            Add beats in Supabase to see them here.
          </p>
        </div>
      )}
    </div>
  )
}
