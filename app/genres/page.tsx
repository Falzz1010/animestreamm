"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"

interface Genre {
  mal_id: number
  name: string
  count: number
}

const colorClasses = [
  "bg-gradient-to-br from-red-500 to-red-600",
  "bg-gradient-to-br from-blue-500 to-blue-600",
  "bg-gradient-to-br from-yellow-500 to-yellow-600",
  "bg-gradient-to-br from-purple-500 to-purple-600",
  "bg-gradient-to-br from-green-500 to-green-600",
  "bg-gradient-to-br from-gray-700 to-gray-800",
  "bg-gradient-to-br from-orange-500 to-orange-600",
  "bg-gradient-to-br from-indigo-500 to-indigo-600",
  "bg-gradient-to-br from-pink-500 to-pink-600",
  "bg-gradient-to-br from-cyan-500 to-cyan-600",
  "bg-gradient-to-br from-teal-500 to-teal-600",
  "bg-gradient-to-br from-emerald-500 to-emerald-600",
  "bg-gradient-to-br from-violet-500 to-violet-600",
  "bg-gradient-to-br from-rose-500 to-rose-600"
]

export default function GenresPage() {
  const [genres, setGenres] = useState<Genre[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchGenres() {
      try {
        const response = await fetch('https://api.jikan.moe/v4/genres/anime')
        const data = await response.json()
        setGenres(data.data)
      } catch (error) {
        console.error('Failed to fetch genres:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchGenres()
  }, [])

  if (isLoading) {
    return (
      <div className="container max-w-7xl mx-auto py-8 space-y-8">
        <div className="space-y-4">
          <Skeleton className="h-10 w-[250px]" />
          <Skeleton className="h-6 w-[300px]" />
        </div>
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {[...Array(12)].map((_, i) => (
            <Skeleton key={i} className="h-[120px] w-full" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container max-w-7xl mx-auto py-12 space-y-12">
      <div className="space-y-4">
        <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Anime Genres
        </h1>
        <p className="text-xl text-muted-foreground/80">
          Browse anime by your favorite genres
        </p>
      </div>
      
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {genres.map((genre, index) => (
          <Link href={`/genres/${genre.mal_id}`} key={genre.mal_id}>
            <Card className="overflow-hidden group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardContent className={`p-6 ${colorClasses[index % colorClasses.length]}`}>
                <div className="aspect-[2/1] flex flex-col items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-300" />
                  <h3 className="text-2xl font-semibold text-white text-center group-hover:scale-105 transition-transform duration-300">
                    {genre.name}
                  </h3>
                  <p className="text-white/90 text-sm mt-2 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                    {genre.count.toLocaleString()} anime
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}