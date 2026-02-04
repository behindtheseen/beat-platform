import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()
  
  const { data: beat, error } = await supabase
    .from("beats")
    .select("*")
    .eq("id", id)
    .eq("status", "active")
    .single()

  if (error || !beat) {
    return NextResponse.json({ error: "Beat not found" }, { status: 404 })
  }

  return NextResponse.json(beat)
}
