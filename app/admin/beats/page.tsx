"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Edit, Trash2, Search, Music } from "lucide-react"
import Link from "next/link"

export default function AdminBeatsPage() {
  const supabase = createClient()
  const [beats, setBeats] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  useEffect(() => {
    fetchBeats()
  }, [])

  const fetchBeats = async () => {
    const { data } = await supabase
      .from("beats")
      .select("*")
      .order("created_at", { ascending: false })
    
    if (data) setBeats(data)
    setLoading(false)
  }

  const deleteBeat = async (id: string) => {
    if (!confirm("Are you sure you want to delete this beat?")) return
    
    await supabase.from("beats").delete().eq("id", id)
    fetchBeats()
  }

  const filteredBeats = beats.filter(beat =>
    beat.title.toLowerCase().includes(search.toLowerCase()) ||
    beat.genre.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) {
    return (
      <div className="container py-20 text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto" />
        <p className="mt-4">Loading beats...</p>
      </div>
    )
  }

  return (
    <div className="container py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Manage Beats</h1>
        <Link href="/admin/upload">
          <Button>Add New Beat</Button>
        </Link>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search beats..."
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {filteredBeats.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Music className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No beats found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredBeats.map((beat) => (
            <Card key={beat.id}>
              <CardContent className="p-4 flex items-center gap-4">
                {beat.cover_url ? (
                  <img
                    src={beat.cover_url}
                    alt={beat.title}
                    className="w-16 h-16 object-cover rounded"
                  />
                ) : (
                  <div className="w-16 h-16 bg-muted rounded flex items-center justify-center">
                    <Music className="h-6 w-6 text-muted-foreground" />
                  </div>
                )}
                
                <div className="flex-1">
                  <h3 className="font-semibold">{beat.title}</h3>
                  <div className="flex gap-2 mt-1 text-sm text-muted-foreground">
                    <span>{beat.bpm} BPM</span>
                    <span>•</span>
                    <span>{beat.key}</span>
                    <span>•</span>
                    <Badge variant="secondary">{beat.genre}</Badge>
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-bold">${beat.price}</p>
                  <Badge variant={beat.status === "active" ? "default" : "outline"}>
                    {beat.status}
                  </Badge>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="icon">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => deleteBeat(beat.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
