"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Play, Pause, ShoppingCart, Check, Volume2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useCartStore, type Beat } from "@/store/cart"

export default function BeatDetailPage() {
  const params = useParams()
  const beatId = params.id as string
  
  const [beat, setBeat] = useState<Beat | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [audioError, setAudioError] = useState(false)
  
  const audioRef = useRef<HTMLAudioElement | null>(null)
  
  const { addItem, items } = useCartStore()

  useEffect(() => {
    const fetchBeat = async () => {
      const response = await fetch(`/api/beats/${beatId}`)
      if (response.ok) {
        const data = await response.json()
        setBeat(data)
      }
      setIsLoading(false)
    }
    fetchBeat()
  }, [beatId])

  useEffect(() => {
    if (beat?.audio_url) {
      audioRef.current = new Audio(beat.audio_url)
      audioRef.current.addEventListener("ended", () => setIsPlaying(false))
      audioRef.current.addEventListener("error", () => {
        setAudioError(true)
        setIsPlaying(false)
      })
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.src = ""
      }
    }
  }, [beat])

  const togglePlay = () => {
    if (!audioRef.current || !beat) return
    
    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play().catch(() => {
        setAudioError(true)
      })
    }
    setIsPlaying(!isPlaying)
  }

  const handleAddToCart = (licenseType: "basic" | "exclusive") => {
    if (!beat) return
    addItem(beat, licenseType)
  }

  const isInCart = (licenseType: "basic" | "exclusive") => {
    return items.some(item => item.id === beat?.id && item.licenseType === licenseType)
  }

  if (isLoading) {
    return (
      <div className="container py-20 text-center">
        <p>Loading...</p>
      </div>
    )
  }

  if (!beat) {
    return (
      <div className="container py-20 text-center">
        <h1 className="text-2xl font-bold">Beat not found</h1>
        <Link href="/" className="text-primary hover:underline mt-4 block">
          ← Back to beats
        </Link>
      </div>
    )
  }

  const exclusivePrice = beat.exclusive_price || beat.price * 3

  return (
    <div className="container py-8">
      <Link href="/" className="text-muted-foreground hover:text-primary mb-6 inline-block">
        ← Back to beats
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-6">
              <div className="relative">
                {beat.cover_url ? (
                  <img
                    src={beat.cover_url}
                    alt={beat.title}
                    className="w-full aspect-square object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-full aspect-square bg-muted rounded-lg flex items-center justify-center">
                    <p className="text-muted-foreground">No cover image</p>
                  </div>
                )}
                
                <button
                  onClick={togglePlay}
                  className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg opacity-0 hover:opacity-100 transition-opacity"
                >
                  <div className="h-20 w-20 rounded-full bg-primary flex items-center justify-center">
                    {isPlaying ? (
                      <Pause className="h-10 w-10 text-primary-foreground" />
                    ) : (
                      <Play className="h-10 w-10 text-primary-foreground ml-1" />
                    )}
                  </div>
                </button>
              </div>

              {audioError ? (
                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-yellow-700 text-sm">
                    ⚠️ Audio preview not available for this beat. Purchase to download the full track.
                  </p>
                </div>
              ) : (
                <div className="mt-6">
                  <audio ref={audioRef} preload="metadata" />
                  <div className="flex items-center gap-4">
                    <Button onClick={togglePlay} className="w-full">
                      {isPlaying ? (
                        <>
                          <Pause className="mr-2 h-4 w-4" /> Pause
                        </>
                      ) : (
                        <>
                          <Play className="mr-2 h-4 w-4" /> Play Preview
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">License Information</h2>
            <Card>
              <CardContent className="p-6 space-y-4">
                <div>
                  <h3 className="font-semibold">Basic License</h3>
                  <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                    <li>✓ MP3 download (320kbps)</li>
                    <li>✓ Unlimited streaming</li>
                    <li>✓ Use for one commercial release</li>
                    <li>✓ Credit required</li>
                    <li>✗ No exclusive rights</li>
                  </ul>
                </div>
                <Separator />
                <div>
                  <h3 className="font-semibold">Exclusive License</h3>
                  <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                    <li>✓ All Basic License rights</li>
                    <li>✓ WAV + STEM files included</li>
                    <li>✓ Unlimited commercial releases</li>
                    <li>✓ Full ownership transfer</li>
                    <li>✓ No credit required</li>
                    <li>✓ Beat removed from marketplace</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{beat.genre}</Badge>
                {beat.is_exclusive && <Badge>Exclusive</Badge>}
              </div>
              <h1 className="text-3xl font-bold">{beat.title}</h1>
              <div className="flex gap-4 text-muted-foreground">
                <span>{beat.bpm} BPM</span>
                <span>{beat.key}</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Button
                  className="w-full"
                  size="lg"
                  onClick={() => handleAddToCart("basic")}
                  disabled={isInCart("basic")}
                >
                  {isInCart("basic") ? (
                    <>
                      <Check className="mr-2 h-4 w-4" /> In Cart
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="mr-2 h-4 w-4" /> Add Basic
                    </>
                  )}
                  <span className="ml-auto font-bold">${beat.price}</span>
                </Button>

                <Button
                  variant="outline"
                  className="w-full"
                  size="lg"
                  onClick={() => handleAddToCart("exclusive")}
                  disabled={isInCart("exclusive")}
                >
                  {isInCart("exclusive") ? (
                    <>
                      <Check className="mr-2 h-4 w-4" /> In Cart
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="mr-2 h-4 w-4" /> Add Exclusive
                    </>
                  )}
                  <span className="ml-auto font-bold">${exclusivePrice}</span>
                </Button>
              </div>

              <p className="text-xs text-muted-foreground text-center">
                Secure payment via PayPal or Crypto
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
