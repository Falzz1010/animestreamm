import { Suspense } from "react"
import { getPopularAnime } from "@/lib/api"
import { Card } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"

async function PopularAnimeList() {
  const anime = await getPopularAnime()
  
  return (
    <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {anime.map((item, index) => (
        <Link 
          href={item.animeUrl} 
          key={item.animeId}
          style={{ '--delay': `${index * 0.1}s` } as React.CSSProperties}
          className="animate-delayed-fade opacity-0"
        >
          <Card className="overflow-hidden group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02]">
            <div className="relative aspect-[2/3]">
              <Image
                src={item.animeImg}
                alt={item.animeTitle}
                fill
                className="object-cover transition-all duration-700 group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
              <div className="absolute bottom-0 p-6 w-full transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out">
                <h3 className="text-lg font-bold text-white line-clamp-2 drop-shadow-lg">{item.animeTitle}</h3>
                <p className="text-sm text-white/90 mt-2 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-100">{item.releasedDate}</p>
              </div>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  )
}

export default function PopularPage() {
  return (
    <div className="container max-w-7xl mx-auto py-12 space-y-10">
      <div className="space-y-4 text-center">
        <h1 className="text-5xl font-bold tracking-tight animate-bounce-in opacity-0 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Popular Anime
        </h1>
        <p className="text-xl text-muted-foreground animate-slide-up opacity-0">
          Discover the most popular anime series
        </p>
      </div>
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
        </div>
      }>
        <PopularAnimeList />
      </Suspense>
    </div>
  )
} 