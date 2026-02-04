"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Loader2, Upload, Music, Image } from "lucide-react"

const GENRES = ["Trap", "Hip Hop", "Pop", "R&B", "Drill", "Lo-Fi", "EDM", "Rock", "Jazz", "Other"]
const KEYS = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B", "Cm", "C#m", "Dm", "D#m", "Em", "Fm", "F#m", "Gm", "G#m", "Am", "A#m", "Bm"]

export default function AdminUploadPage() {
  const router = useRouter()
  const supabase = createClient()
  
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  
  const [formData, setFormData] = useState({
    title: "",
    bpm: 140,
    key: "Cm",
    genre: "Trap",
    price: 29.99,
    exclusive_price: 299.99,
  })
  
  const [files, setFiles] = useState({
    audio: null as File | null,
    cover: null as File | null,
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "audio" | "cover") => {
    const file = e.target.files?.[0]
    if (file) {
      setFiles(prev => ({ ...prev, [type]: file }))
    }
  }

  const uploadBeat = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setUploading(true)
    setProgress(0)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push("/auth/login")
        return
      }

      let audioUrl = ""
      let coverUrl = ""

      // Upload audio file
      if (files.audio) {
        setProgress(10)
        const audioExt = files.audio.name.split(".").pop()
        const audioPath = `${user.id}/${Date.now()}.${audioExt}`
        const { data: audioData, error: audioError } = await supabase.storage
          .from("beats")
          .upload(audioPath, files.audio)

        if (audioError) throw audioError
        
        const { data: { publicUrl } } = supabase.storage
          .from("beats")
          .getPublicUrl(audioPath)
        audioUrl = publicUrl
        setProgress(40)
      }

      // Upload cover image
      if (files.cover) {
        setProgress(50)
        const coverExt = files.cover.name.split(".").pop()
        const coverPath = `${user.id}/covers/${Date.now()}.${coverExt}`
        const { data: coverData, error: coverError } = await supabase.storage
          .from("covers")
          .upload(coverPath, files.cover)

        if (coverError) throw coverError
        
        const { data: { publicUrl } } = supabase.storage
          .from("covers")
          .getPublicUrl(coverPath)
        coverUrl = publicUrl
        setProgress(80)
      }

      // Insert beat into database
      setProgress(90)
      const { error: insertError } = await supabase.from("beats").insert({
        title: formData.title,
        bpm: formData.bpm,
        key: formData.key,
        genre: formData.genre,
        price: formData.price,
        exclusive_price: formData.exclusive_price,
        audio_url: audioUrl,
        cover_url: coverUrl,
        is_exclusive: false,
        status: "active",
        producer_id: user.id,
      })

      if (insertError) throw insertError

      setProgress(100)
      
      // Reset form
      setFormData({
        title: "",
        bpm: 140,
        key: "Cm",
        genre: "Trap",
        price: 29.99,
        exclusive_price: 299.99,
      })
      setFiles({ audio: null, cover: null })
      
      alert("Beat uploaded successfully!")
      router.push("/")
    } catch (error: any) {
      console.error("Error uploading beat:", error)
      alert("Error uploading beat: " + error.message)
    } finally {
      setLoading(false)
      setUploading(false)
      setProgress(0)
    }
  }

  return (
    <div className="container max-w-2xl py-10">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-6 w-6" />
            Upload New Beat
          </CardTitle>
          <CardDescription>
            Add a new beat to your marketplace
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={uploadBeat} className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Beat Title</Label>
              <Input
                id="title"
                placeholder="Enter beat title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                required
              />
            </div>

            {/* BPM and Key */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bpm">BPM</Label>
                <Input
                  id="bpm"
                  type="number"
                  min="60"
                  max="200"
                  value={formData.bpm}
                  onChange={(e) => setFormData(prev => ({ ...prev, bpm: parseInt(e.target.value) }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="key">Key</Label>
                <Select
                  value={formData.key}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, key: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {KEYS.map((key) => (
                      <SelectItem key={key} value={key}>{key}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Genre */}
            <div className="space-y-2">
              <Label htmlFor="genre">Genre</Label>
              <Select
                value={formData.genre}
                onValueChange={(value) => setFormData(prev => ({ ...prev, genre: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {GENRES.map((genre) => (
                    <SelectItem key={genre} value={genre}>{genre}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Prices */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Basic License Price ($)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="exclusive_price">Exclusive Price ($)</Label>
                <Input
                  id="exclusive_price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.exclusive_price}
                  onChange={(e) => setFormData(prev => ({ ...prev, exclusive_price: parseFloat(e.target.value) }))}
                  required
                />
              </div>
            </div>

            {/* Audio Upload */}
            <div className="space-y-2">
              <Label>Audio File (MP3/WAV)</Label>
              <div className="border-2 border-dashed rounded-lg p-6 text-center">
                <input
                  type="file"
                  accept="audio/*"
                  onChange={(e) => handleFileChange(e, "audio")}
                  className="hidden"
                  id="audio-upload"
                  required
                />
                <label htmlFor="audio-upload" className="cursor-pointer">
                  <Music className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                  {files.audio ? (
                    <p className="text-sm font-medium">{files.audio.name}</p>
                  ) : (
                    <>
                      <p className="text-sm text-muted-foreground">
                        Click to upload audio file
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Max file size: 50MB
                      </p>
                    </>
                  )}
                </label>
              </div>
            </div>

            {/* Cover Upload */}
            <div className="space-y-2">
              <Label>Cover Image (JPG/PNG)</Label>
              <div className="border-2 border-dashed rounded-lg p-6 text-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, "cover")}
                  className="hidden"
                  id="cover-upload"
                />
                <label htmlFor="cover-upload" className="cursor-pointer">
                  <Image className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                  {files.cover ? (
                    <p className="text-sm font-medium">{files.cover.name}</p>
                  ) : (
                    <>
                      <p className="text-sm text-muted-foreground">
                        Click to upload cover image (optional)
                      </p>
                    </>
                  )}
                </label>
              </div>
            </div>

            {/* Upload Progress */}
            {uploading && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>
                    {progress < 50 ? "Uploading audio..." : 
                     progress < 80 ? "Uploading cover..." : 
                     "Saving to database..."}
                  </span>
                  <span>{progress}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Submit */}
            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading || uploading}
            >
              {loading || uploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Beat
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
