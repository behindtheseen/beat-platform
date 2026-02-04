"use client"

import Link from "next/link"
import { Play, Pause, Music } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { Beat } from "@/store/cart"

interface BeatCardProps {
  beat: Beat
}

export function BeatCard({ beat }: BeatCardProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [hasError, setHasError] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    if (!beat.audio_url) return
    
    const audio = new Audio(beat.audio_url)
    audioRef.current = audio
    
    audio.addEventListener("ended", () => setIsPlaying(false))
    audio.addEventListener("error", () => {
      setHasError(true)
      setIsPlaying(false)
    })
    
    return () => {
      audio.pause()
      audio.src = ""
    }
  }, [beat.audio_url])

  const togglePlay = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!audioRef.current || hasError) return
    
    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play().catch(() => {
        setHasError(true)
      })
    }
    setIsPlaying(!isPlaying)
  }

  return (
    <Card className="overflow-hidden group">
      <div className="relative aspect-square bg-muted">
        {beat.cover_url ? (
          <img
            src={beat.cover_url}
            alt={beat.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Music className="h-12 w-12 text-muted-foreground" />
          </div>
        )}
        
        {!hasError && (
          <button
            onClick={togglePlay}
            className={cn(
              "absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity",
              isPlaying && "opacity-100"
            )}
          >
            <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center">
              {isPlaying ? (
                <Pause className="h-8 w-8 text-primary-foreground" />
              ) : (
                <Play className="h-8 w-8 text-primary-foreground ml-1" />
              )}
            </div>
          </button>
        )}
      </div>

      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <Link href={`/beats/${beat.id}`}>
              <h3 className="font-semibold hover:text-primary transition-colors">
                {beat.title}
              </h3>
            </Link>
            <div className="flex gap-2 mt-1 text-sm text-muted-foreground">
              <span>{beat.bpm} BPM</span>
              <span>•</span>
              <span>{beat.key}</span>
            </div>
          </div>
          <Badge variant="secondary">{beat.genre}</Badge>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <span className="font-bold text-lg">${beat.price}</span>
        <Link href={`/beats/${beat.id}`}>
          <Button variant="outline" size="sm">
            View Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
