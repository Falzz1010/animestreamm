import { Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from "next/image"
import Link from "next/link"
import { getPopularAnime, getRecentEpisodes, getTopAiring } from "@/lib/api"
import { HeroSection } from "@/components/HeroSection"
import { AnimatedCard } from "@/components/AnimatedCard"
import { Skeleton } from  "@/components/ui/skeleton"
 
function CardSkeleton() { 
  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg dark:hover:shadow-primary/20">
      <div className="relative aspect-[2/3]">
        <div className="absolute inset-0 bg-muted/60 dark:bg-muted/20 animate-pulse rounded-sm" />
        <div className="absolute bottom-0 p-4 w-full space-y-2">
          {/* Title skeleton */}
          <div className="h-6 bg-muted/60 dark:bg-muted/20 animate-pulse rounded-sm" />
          {/* Subtitle skeleton */}
          <div className="h-4 w-24 bg-muted/60 dark:bg-muted/20 animate-pulse rounded-sm" />
        </div>
      </div>
    </Card>
  )
}

function LoadingGrid() {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(8)].map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
      {/* Pagination skeleton */}
      <div className="flex justify-center items-center gap-2 mt-6">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="h-9 w-9 bg-muted/60 dark:bg-muted/20 animate-pulse rounded-md"
          />
        ))}
      </div>
    </div>
  )
}

type HomeProps = {
  searchParams: {
    recentPage?: string
    popularPage?: string
    airingPage?: string
  }
}

function PaginationControls({ currentPage, totalPages, onPageChange }: { 
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void 
}) {
  return (
    <div className="flex justify-center items-center gap-2 mt-6">
      {/* Previous Button */}
      <Link
        href={`${onPageChange(Math.max(1, currentPage - 1))}`}
        className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors h-9 px-4 
          ${currentPage === 1 
            ? 'opacity-50 cursor-not-allowed bg-muted'
            : 'border border-input bg-background hover:bg-accent hover:text-accent-foreground'
          }`}
        aria-disabled={currentPage === 1}
      >
        Previous
      </Link>

      {/* Page Numbers */}
      {[...Array(10)].map((_, i) => (
        <Link
          key={i}
          href={`${onPageChange(i + 1)}`}
          className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors h-9 w-9
            ${currentPage === i + 1 
              ? 'bg-primary text-primary-foreground hover:bg-primary/90'
              : 'border border-input bg-background hover:bg-accent hover:text-accent-foreground'
            }`}
          aria-current={currentPage === i + 1 ? 'page' : undefined}
        >
          {i + 1}
        </Link>
      ))}

      {/* Next Button */}
      <Link
        href={`${onPageChange(Math.min(totalPages, currentPage + 1))}`}
        className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors h-9 px-4
          ${currentPage === totalPages 
            ? 'opacity-50 cursor-not-allowed bg-muted'
            : 'border border-input bg-background hover:bg-accent hover:text-accent-foreground'
          }`}
        aria-disabled={currentPage === totalPages}
      >
        Next
      </Link>
    </div>
  )
}

function LoadingState() {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-muted h-[300px] rounded-md"></div>
          </div>
        ))}
      </div>
      <div className="flex justify-center gap-2 mt-6">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="h-9 w-9 bg-muted rounded-md animate-pulse"
          />
        ))}
      </div>
    </div>
  )
}

async function RecentEpisodes({ page = 1 }: { page: number }) {
  const episodes = await getRecentEpisodes()
  const totalPages = 10
  
  return (
    <Suspense fallback={<LoadingState />}>
      <div className="space-y-6">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {episodes.slice((page - 1) * 8, page * 8).map((episode, index) => (
            <AnimatedCard 
              key={episode.episodeId} 
              episode={episode} 
              index={index}
            />
          ))}
        </div>
        <PaginationControls 
          currentPage={page} 
          totalPages={totalPages}
          onPageChange={(p) => `?recentPage=${p}`}
        />
      </div>
    </Suspense>
  )
}

function PageInfo({ currentPage, totalItems }: { currentPage: number; totalItems: number }) {
  const startItem = (currentPage - 1) * 8 + 1
  const endItem = Math.min(currentPage * 8, totalItems)
  
  return (
    <div className="text-sm text-muted-foreground text-center mt-2">
      Showing {startItem}-{endItem} of {totalItems} items
    </div>
  )
}

async function PopularAnime({ page = 1 }: { page: number }) {
  const anime = await getPopularAnime()
  const totalPages = 10
  const totalItems = anime.length
  
  return (
    <Suspense fallback={<LoadingGrid />}>
      <div className="space-y-6">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {anime.slice((page - 1) * 8, page * 8).map((item, index) => (
            <Link 
              href={`/anime/${item.animeId}`} 
              key={item.animeId}
              className={`animate-fade-up`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <Card className="overflow-hidden group transition-all duration-300 hover:shadow-xl dark:hover:shadow-primary/20 hover:-translate-y-1">
                <div className="relative aspect-[2/3]">
                  <Image
                    src={item.animeImg}
                    alt={item.animeTitle}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-0 p-4 w-full transform transition-all duration-300 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100">
                    <h3 className="text-lg font-medium text-white line-clamp-2">{item.animeTitle}</h3>
                    <p className="text-sm text-white/80 mt-1">{item.releasedDate}</p>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
        <PaginationControls 
          currentPage={page} 
          totalPages={totalPages}
          onPageChange={(p) => `?popularPage=${p}`}
        />
        <PageInfo currentPage={page} totalItems={totalItems} />
      </div>
    </Suspense>
  )
}

async function TopAiring({ page = 1 }: { page: number }) {
  const anime = await getTopAiring()
  const totalPages = 10
  const totalItems = anime.length
  
  return (
    <Suspense fallback={<LoadingGrid />}>
      <div className="space-y-6">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {anime.slice((page - 1) * 8, page * 8).map((item, index) => (
            <Link 
              href={`/anime/${item.animeId}`} 
              key={item.animeId}
              className={`animate-fade-up`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <Card className="overflow-hidden group transition-all duration-300 hover:shadow-xl dark:hover:shadow-primary/20 hover:-translate-y-1">
                <div className="relative aspect-[2/3]">
                  <Image
                    src={item.animeImg}
                    alt={item.animeTitle}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-0 p-4 w-full transform transition-all duration-300 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100">
                    <h3 className="text-lg font-medium text-white line-clamp-2">{item.animeTitle}</h3>
                    <p className="text-sm text-white/80 mt-1">Episodes: {item.latestEp}</p>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
        <PaginationControls 
          currentPage={page} 
          totalPages={totalPages}
          onPageChange={(p) => `?airingPage=${p}`}
        />
        <PageInfo currentPage={page} totalItems={totalItems} />
      </div>
    </Suspense>
  )
}

export default function Home({ searchParams }: HomeProps) {
  const recentPage = Number(searchParams.recentPage) || 1
  const popularPage = Number(searchParams.popularPage) || 1
  const airingPage = Number(searchParams.airingPage) || 1

  return (
    <div className="min-h-screen flex flex-col items-center bg-background dark:bg-background">
      <div className="w-full">
        <HeroSection />
      </div>
      
      <div className="container max-w-7xl mx-auto space-y-20 pb-20 px-4 sm:px-6 lg:px-8">
        <section className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-medium tracking-tight text-foreground/90">Recent Episodes</h2>
            <Button variant="ghost" size="lg" className="hover:bg-primary/10 transition-colors duration-300" asChild>
              <Link href="/recent">View all</Link>
            </Button>
          </div>
          <Suspense fallback={<LoadingGrid />}>
            <RecentEpisodes page={recentPage} />
          </Suspense>
        </section>

        <section className="space-y-8">
          <Tabs defaultValue="popular" className="space-y-8">
            <div className="flex items-center justify-between">
              <TabsList className="h-12 p-1 bg-background dark:bg-background/80 border dark:border-border/50 rounded-full">
                <TabsTrigger value="popular" className="text-base px-8 rounded-full transition-all data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
                  Popular
                </TabsTrigger>
                <TabsTrigger value="airing" className="text-base px-8 rounded-full transition-all data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
                  Top Airing
                </TabsTrigger>
              </TabsList>
              <Button variant="ghost" size="lg" className="hover:bg-primary/10 transition-colors duration-300" asChild>
                <Link href="/browse">Browse all</Link>
              </Button>
            </div>
            <TabsContent value="popular" className="m-0">
              <Suspense fallback={<LoadingGrid />}>
                <PopularAnime page={popularPage} />
              </Suspense>
            </TabsContent>
            <TabsContent value="airing" className="m-0">
              <Suspense fallback={<LoadingGrid />}>
                <TopAiring page={airingPage} />
              </Suspense>
            </TabsContent>
          </Tabs>
        </section>
      </div>
    </div>
  )
}