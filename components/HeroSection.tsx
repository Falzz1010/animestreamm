'use client'

import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { useEffect, useState } from "react"
import Link from "next/link"
import { useQuery } from "@tanstack/react-query"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

interface AnimeData {
  mal_id: number
  images: {
    webp: {
      large_image_url: string
    }
  }
  title: string
  synopsis: string
  score: number
  genres: {
    name: string
    mal_id: number
  }[]
  status: string
  episodes: number
}

const JIKAN_API_BASE_URL = 'https://api.jikan.moe/v4'

export function HeroSection() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [progress, setProgress] = useState<number>(0)
  const { data: trendingAnime, isLoading } = useQuery({
    queryKey: ['trending-anime'],
    queryFn: async () => {
      const response = await fetch(`${JIKAN_API_BASE_URL}/top/anime?filter=airing&limit=10`)
      const data = await response.json()
      return data.data || []
    }
  })

  useEffect(() => {
    if (!trendingAnime || trendingAnime.length === 0) return
    
    const interval = setInterval(() => {
      if (isPlaying) {
        setCurrentIndex((prev) => (prev + 1) % trendingAnime.length)
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [trendingAnime, isPlaying])

  if (isLoading || !trendingAnime || trendingAnime.length === 0) {
    return (
      <section className="relative h-[70vh] w-full mb-12 bg-gradient-to-b from-background/5 to-background">
        <div className="container max-w-7xl mx-auto h-full flex items-center justify-center">
          <div className="w-full h-full flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </div>
      </section>
    )
  }

  const currentAnime = trendingAnime[currentIndex]

  return (
    <section className="relative h-[70vh] w-full mb-12 bg-gradient-to-b from-background/5 to-background overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          <Image
            src={currentAnime.images.webp.large_image_url}
            alt={currentAnime.title}
            fill
            className="object-cover opacity-80"
            priority
            quality={100}
          />
          {/* Overlay gradients - mengurangi opacity gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/60 via-transparent to-background/60" />
        </motion.div>
      </AnimatePresence>

      <div className="container max-w-7xl mx-auto h-full flex flex-col justify-center space-y-6 px-2 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="max-w-2xl"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-2xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground">
                {currentAnime.title}
              </h1>
              
              {/* Add anime info */}
              <div className="flex flex-wrap items-center gap-4 mt-4">
                {currentAnime.score && (
                  <div className="flex items-center space-x-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-yellow-500">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                    <span className="text-base font-semibold">{currentAnime.score.toFixed(1)}</span>
                  </div>
                )}
                <div className="hidden sm:block h-4 w-px bg-gray-600" />
                <span className="text-xs sm:text-sm px-2 py-1 rounded-full bg-primary/20 text-primary">
                  {currentAnime.status}
                </span>
                <div className="hidden sm:block h-4 w-px bg-gray-600" />
                <span className="text-xs sm:text-sm">
                  {currentAnime.episodes} Episodes
                </span>
              </div>

              {/* Add genres */}
              <div className="flex flex-wrap gap-2 mt-4">
                {currentAnime.genres.slice(0, 3).map((genre: { mal_id: number; name: string }) => (
                  <span
                    key={genre.mal_id}
                    className="text-xs px-2 py-1 rounded-full bg-background/50 text-foreground/80"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>

              <p className="text-lg sm:text-xl text-muted-foreground mt-6 line-clamp-3">
                {currentAnime.synopsis}
              </p>
            </motion.div>
          </AnimatePresence>

          <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 sm:space-x-4">
            <Link 
              href={`/anime/${currentAnime.mal_id}`}
              className="w-full sm:w-auto px-8 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-center"
            >
              Watch Now
            </Link>
            
            {/* Navigation controls */}
            <div className="flex items-center space-x-4 w-full sm:w-auto justify-center">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-2 rounded-full bg-background/50 hover:bg-background/80 transition-colors"
              >
                {isPlaying ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="6" y="4" width="4" height="16"/>
                    <rect x="14" y="4" width="4" height="16"/>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="5 3 19 12 5 21 5 3"/>
                  </svg>
                )}
              </button>
              
              {/* Existing navigation buttons */}
              <div className="flex items-center space-x-4">
                <button
                  type="button"
                  aria-label="Previous slide"
                  onClick={() => setCurrentIndex((prev) => (prev - 1 + trendingAnime.length) % trendingAnime.length)}
                  className="p-2 rounded-full bg-background/50 hover:bg-background/80 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m15 18-6-6 6-6"/>
                  </svg>
                </button>
                
                {/* Progress indicators */}
                <div className="flex space-x-2">
                  {trendingAnime.map((_: any, index: number) => (
                    <div
                      key={index}
                      className="relative"
                    >
                      <button
                        aria-label={`Go to slide ${index + 1}`}
                        onClick={() => setCurrentIndex(index)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          index === currentIndex ? 'bg-primary w-8' : 'bg-gray-600'
                        }`}
                      />
                      {index === currentIndex && isPlaying && (
                        <div 
                          className="absolute top-0 left-0 h-full bg-primary/50 rounded-full transition-all"
                          style={{ width: `${progress}%`, maxWidth: '100%' }}
                        />
                      )}
                    </div>
                  ))}
                </div>
                
                <button
                  type="button"
                  aria-label="Next slide"
                  onClick={() => setCurrentIndex((prev) => (prev + 1) % trendingAnime.length)}
                  className="p-2 rounded-full bg-background/50 hover:bg-background/80 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m9 18 6-6-6-6"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom fade effect */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
    </section>
  )
} 