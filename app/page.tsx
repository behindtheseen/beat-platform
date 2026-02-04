import { createClient } from "@/lib/supabase/server"
import { BeatCard } from "@/components/beat-card"
import type { Beat } from "@/store/cart"
import { ArrowRight, Music2, Headphones, Zap } from "lucide-react"

export default async function Home() {
  const supabase = await createClient()
  
  const { data: beats } = await supabase
    .from("beats")
    .select("*")
    .eq("status", "active")
    .order("created_at", { ascending: false })

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-pink-900/20" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
        
        <div className="relative container px-4 py-20 md:py-32">
          <div className="max-w-3xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm font-medium mb-6">
              <Zap className="h-4 w-4" />
              Premium Quality Beats
            </div>
            
            {/* Title */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Your Next Hit
              <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                Starts Here
              </span>
            </h1>
            
            {/* Subtitle */}
            <p className="text-lg md:text-xl text-zinc-400 mb-8 max-w-2xl mx-auto">
              Discover professional-grade beats crafted by top producers. 
              Instant downloads, full rights, unbeatable quality.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="#beats"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-full transition-all hover:scale-105 shadow-lg shadow-purple-500/25"
              >
                Browse Beats
                <ArrowRight className="h-5 w-5" />
              </a>
              <a 
                href="/auth/signup"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-zinc-800 hover:bg-zinc-700 text-white font-semibold rounded-full transition-all border border-zinc-700"
              >
                Start Selling
              </a>
            </div>
            
            {/* Stats */}
            <div className="flex justify-center gap-12 mt-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">500+</div>
                <div className="text-sm text-zinc-500">Beats</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">10K+</div>
                <div className="text-sm text-zinc-500">Artists</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">50M+</div>
                <div className="text-sm text-zinc-500">Streams</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Wave Bottom */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path 
              d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" 
              fill="black"
            />
          </svg>
        </div>
      </section>

      {/* Beats Section */}
      <section id="beats" className="container px-4 pb-20">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white">Latest Beats</h2>
            <p className="text-zinc-400 mt-1">Fresh drops from our producers</p>
          </div>
          <a href="/beats" className="hidden md:flex items-center gap-2 text-purple-400 hover:text-purple-300 font-medium">
            View All
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>

        {beats && beats.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {beats.map((beat: any) => (
              <BeatCard key={beat.id} beat={beat as Beat} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-zinc-900 mb-4">
              <Music2 className="h-10 w-10 text-zinc-600" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No beats yet</h3>
            <p className="text-zinc-500">Be the first to add some beats!</p>
          </div>
        )}
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-black to-zinc-900">
        <div className="container px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-purple-500/10 mb-4">
                <Headphones className="h-8 w-8 text-purple-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Premium Quality</h3>
              <p className="text-zinc-400">320kbps WAV files, mastered to perfection</p>
            </div>
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-pink-500/10 mb-4">
                <Zap className="h-8 w-8 text-pink-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Instant Download</h3>
              <p className="text-zinc-400">Get your beats immediately after purchase</p>
            </div>
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-500/10 mb-4">
                <Music2 className="h-8 w-8 text-blue-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Full Rights</h3>
              <p className="text-zinc-400">Use in commercial projects, streaming, distribution</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
