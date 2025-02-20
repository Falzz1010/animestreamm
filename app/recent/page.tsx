import { Suspense } from "react"
import { getRecentEpisodes } from "@/lib/api"
import { Card } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"

async function RecentEpisodesList() {
  const episodes = await getRecentEpisodes()
  
  return (
    <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {episodes.map((episode, index) => (
        <Link 
          href={episode.episodeUrl} 
          key={`${episode.episodeId}-${episode.episodeNum}-${index}`}
          className="opacity-0 animate-fade-up"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <Card className="overflow-hidden group shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="relative aspect-[2/3]">
              <Image
                src={episode.animeImg}
                alt={episode.animeTitle}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
              <div className="absolute bottom-0 p-4 w-full transform transition-all duration-300 group-hover:translate-y-[-4px]">
                <h3 className="text-lg font-semibold text-white line-clamp-2">{episode.animeTitle}</h3>
                <p className="text-sm text-white/90 mt-1">Episode {episode.episodeNum}</p>
              </div>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  )
}

function EpisodeCardSkeleton() {
  return (
    <Card className="overflow-hidden animate-pulse">
      <div className="relative aspect-[2/3] bg-muted">
        <div className="absolute bottom-0 p-4 w-full space-y-2">
          <div className="h-6 bg-muted-foreground/20 rounded-md w-3/4"></div>
          <div className="h-4 bg-muted-foreground/20 rounded-md w-1/3"></div>
        </div>
      </div>
    </Card>
  )
}

function LoadingSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {[...Array(8)].map((_, i) => (
        <div 
          key={i} 
          className="opacity-0 animate-fade-up"
          style={{ animationDelay: `${i * 0.1}s` }}
        >
          <EpisodeCardSkeleton />
        </div>
      ))}
    </div>
  )
}

export default function RecentPage() {
  return (
    <div className="container max-w-7xl mx-auto py-8 space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight opacity-0 animate-fade-in">
          Recent Episodes
        </h1>
        <p className="text-xl text-muted-foreground opacity-0 animate-fade-in-delay">
          Stay up to date with the latest anime episodes
        </p>
      </div>
      <Suspense fallback={<LoadingSkeleton />}>
        <RecentEpisodesList />
      </Suspense>
    </div>
  )
} 