"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from "next/image"
import { Skeleton } from "@/components/ui/skeleton"

interface AnimeDetails {
  animeTitle: string
  synopsis: string
  type: string
  releasedDate: string
  status: string
  genres: string[]
  totalEpisodes: number
  animeImg: string
}

interface Episode {
  episodeId: string
  episodeNum: number
  episodeUrl: string
}

export default function AnimePage() {
  const params = useParams()
  const [anime, setAnime] = useState<AnimeDetails | null>(null)
  const [episodes, setEpisodes] = useState<Episode[]>([])
  const [currentEpisode, setCurrentEpisode] = useState<Episode | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchAnimeDetails() {
      try {
        // Replace with your actual API endpoints
        const animeResponse = await fetch(`/api/anime/${params.id}`)
        const animeData = await animeResponse.json()
        setAnime(animeData)

        const episodesResponse = await fetch(`/api/anime/${params.id}/episodes`)
        const episodesData = await episodesResponse.json()
        setEpisodes(episodesData)
        
        // Set first episode as current
        if (episodesData.length > 0) {
          setCurrentEpisode(episodesData[0])
        }
      } catch (error) {
        console.error('Failed to fetch anime details:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (params.id) {
      fetchAnimeDetails()
    }
  }, [params.id])

  if (isLoading) {
    return <LoadingState />
  }

  if (!anime) {
    return <div>Anime not found</div>
  }

  return (
    <div className="container max-w-7xl mx-auto py-8 space-y-8">
      {/* Video Player Section */}
      <div className="grid gap-8 lg:grid-cols-[2fr,1fr]">
        <div className="space-y-4">
          <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
            {currentEpisode ? (
              <iframe
                src={currentEpisode.episodeUrl}
                className="absolute inset-0 w-full h-full"
                allowFullScreen
              />
            ) : (
              <div className="flex items-center justify-center h-full text-white">
                Select an episode to watch
              </div>
            )}
          </div>
          {currentEpisode && (
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Episode {currentEpisode.episodeNum}</h2>
              <div className="space-x-2">
                <Button
                  variant="outline"
                  disabled={currentEpisode.episodeNum === 1}
                  onClick={() => {
                    const prevEp = episodes.find(ep => ep.episodeNum === currentEpisode.episodeNum - 1)
                    if (prevEp) setCurrentEpisode(prevEp)
                  }}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  disabled={currentEpisode.episodeNum === anime.totalEpisodes}
                  onClick={() => {
                    const nextEp = episodes.find(ep => ep.episodeNum === currentEpisode.episodeNum + 1)
                    if (nextEp) setCurrentEpisode(nextEp)
                  }}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Info Section */}
        <Card>
          <CardContent className="p-6">
            <Tabs defaultValue="info" className="space-y-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="info">Information</TabsTrigger>
                <TabsTrigger value="episodes">Episodes</TabsTrigger>
              </TabsList>
              <TabsContent value="info" className="space-y-4">
                <div className="relative aspect-[3/4] rounded-lg overflow-hidden">
                  <Image
                    src={anime.animeImg}
                    alt={anime.animeTitle}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="space-y-4">
                  <h1 className="text-2xl font-bold">{anime.animeTitle}</h1>
                  <div className="space-y-2">
                    <p><strong>Type:</strong> {anime.type}</p>
                    <p><strong>Status:</strong> {anime.status}</p>
                    <p><strong>Released:</strong> {anime.releasedDate}</p>
                    <p><strong>Episodes:</strong> {anime.totalEpisodes}</p>
                    <div className="flex flex-wrap gap-2">
                      {anime.genres.map((genre) => (
                        <Button key={genre} variant="secondary" size="sm">
                          {genre}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Synopsis</h3>
                    <p className="text-muted-foreground">{anime.synopsis}</p>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="episodes" className="h-[600px] overflow-y-auto">
                <div className="grid gap-2">
                  {episodes.map((episode) => (
                    <Button
                      key={episode.episodeId}
                      variant={currentEpisode?.episodeId === episode.episodeId ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setCurrentEpisode(episode)}
                    >
                      Episode {episode.episodeNum}
                    </Button>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function LoadingState() {
  return (
    <div className="container max-w-7xl mx-auto py-8 space-y-8">
      <div className="grid gap-8 lg:grid-cols-[2fr,1fr]">
        <div className="space-y-4">
          <Skeleton className="aspect-video w-full" />
          <Skeleton className="h-10 w-[200px]" />
        </div>
        <Skeleton className="h-[800px]" />
      </div>
    </div>
  )
}