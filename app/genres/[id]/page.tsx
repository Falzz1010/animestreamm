import { Suspense } from "react"
import { Card } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { LoadingGrid } from "@/components/LoadingGrid"

// This would come from your API
// Update the genres object to use MAL IDs directly as keys
const genres = {
  "1": { name: "Action", color: "bg-red-500", id: 1 },
  "2": { name: "Adventure", color: "bg-blue-500", id: 2 },
  "4": { name: "Comedy", color: "bg-yellow-500", id: 4 },
  "8": { name: "Drama", color: "bg-purple-500", id: 8 },
  "10": { name: "Fantasy", color: "bg-green-500", id: 10 },
  "14": { name: "Horror", color: "bg-gray-800", id: 14 },
  "18": { name: "Mecha", color: "bg-orange-500", id: 18 },
  "7": { name: "Mystery", color: "bg-indigo-500", id: 7 },
  "22": { name: "Romance", color: "bg-pink-500", id: 22 },
  "24": { name: "Sci-Fi", color: "bg-cyan-500", id: 24 },
  "36": { name: "Slice of Life", color: "bg-teal-500", id: 36 },
  "30": { name: "Sports", color: "bg-emerald-500", id: 30 },
  "37": { name: "Supernatural", color: "bg-violet-500", id: 37 },
  "41": { name: "Thriller", color: "bg-rose-500", id: 41 }
} as const

type GenreId = keyof typeof genres

// Update the getAnimeByGenre function
async function getAnimeByGenre(genreId: string) {
  try {
    const response = await fetch(
      `https://api.jikan.moe/v4/anime?genres=${genreId}&order_by=popularity&sort=desc&limit=24`
    )
    if (!response.ok) throw new Error('Failed to fetch genre anime')
    return response.json()
  } catch (error) {
    console.error('Error fetching genre anime:', error)
    return { data: [] }
  }
}

// Update the genres page link in the genres list page
export async function generateStaticParams() {
  return Object.keys(genres).map((id) => ({
    id: id.toString()
  }))
}

async function GenreAnimeList({ genreId }: { genreId: string }) {
  const data = await getAnimeByGenre(genreId)
  const animeList = data.data
  
  if (animeList.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No anime found for this genre.</p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {animeList.map((anime: any) => (
        <Link href={`/anime/${anime.mal_id}`} key={anime.mal_id}>
          <Card className="overflow-hidden group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="relative aspect-[2/3]">
              <Image
                src={anime.images.webp.large_image_url}
                alt={anime.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-0 p-4 w-full transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="text-lg font-semibold text-white line-clamp-2">{anime.title}</h3>
                <div className="flex items-center gap-2 mt-2">
                  <div className="text-sm text-white/90 bg-white/10 px-2 py-1 rounded-full backdrop-blur-sm">
                    Score: {anime.score || 'N/A'}
                  </div>
                  {anime.episodes && (
                    <div className="text-sm text-white/90 bg-white/10 px-2 py-1 rounded-full backdrop-blur-sm">
                      {anime.episodes} eps
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  )
}

export default function GenrePage({ params }: { params: { id: string } }) {
  const genre = genres[params.id as GenreId]
  
  if (!genre) {
    notFound()
  }

  return (
    <div className="container max-w-7xl mx-auto py-8 space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">{genre.name} Anime</h1>
        <p className="text-xl text-muted-foreground">
          Discover the best {genre.name.toLowerCase()} anime series
        </p>
      </div>
      
      <Suspense fallback={<LoadingGrid />}>
        <GenreAnimeList genreId={params.id} />
      </Suspense>
    </div>
  )
}