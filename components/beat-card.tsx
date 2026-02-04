"use client"

import Link from "next/link"
import { Play, Pause, Music } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"
import type { Beat } from "@/store/cart"

interface BeatCardProps {
  beat: Beat
}

export function BeatCard({ beat }: BeatCardProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
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
    <Link href={`/beats/${beat.id}`}>
      <div 
        className="group relative overflow-hidden rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-purple-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Cover Image */}
        <div className="relative aspect-square overflow-hidden">
          {beat.cover_url ? (
            <img
              src={beat.cover_url}
              alt={beat.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-zinc-800 to-zinc-900">
              <Music className="h-16 w-16 text-zinc-600" />
            </div>
          )}
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          
          {/* Play Button */}
          {!hasError && (
            <div className={cn(
              "absolute inset-0 flex items-center justify-center transition-all duration-300",
              isHovered || isPlaying ? "opacity-100" : "opacity-0"
            )}>
              <div className={cn(
                "h-20 w-20 rounded-full flex items-center justify-center transition-transform duration-300",
                isPlaying ? "bg-purple-500 scale-100" : "bg-purple-600 hover:bg-purple-500 scale-90 hover:scale-100"
              )}>
                {isPlaying ? (
                  <Pause className="h-10 w-10 text-white" />
                ) : (
                  <Play className="h-10 w-10 text-white ml-1" />
                )}
              </div>
            </div>
          )}

          {/* Price Tag */}
          <div className="absolute top-3 right-3 px-3 py-1.5 bg-purple-600 rounded-full text-white font-bold text-sm shadow-lg">
            ${beat.price}
          </div>

          {/* Genre Badge */}
          <div className="absolute bottom-3 left-3 px-3 py-1 bg-black/60 backdrop-blur-sm rounded-full text-white text-xs font-medium">
            {beat.genre}
          </div>
        </div>

        {/* Info */}
        <div className="p-4">
          <h3 className="font-bold text-lg text-white group-hover:text-purple-400 transition-colors truncate">
            {beat.title}
          </h3>
          <div className="flex items-center gap-3 mt-1 text-zinc-400 text-sm">
            <span>{beat.bpm} BPM</span>
            <span className="w-1 h-1 bg-zinc-600 rounded-full" />
            <span>{beat.key}</span>
          </div>
          
          {/* Hover Effect Line */}
          <div className={cn(
            "h-0.5 mt-3 bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300",
            isHovered ? "opacity-100" : "opacity-0"
          )} />
        </div>
      </div>
    </Link>
  )
}
