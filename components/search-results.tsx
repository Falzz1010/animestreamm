'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface AnimeResult {
  mal_id: number
  title: string
  images: {
    jpg: {
      image_url: string
    }
  }
  synopsis: string
  score: number
  year: number
}

interface SearchResultsProps {
  query: string
}

export function SearchResults({ query }: SearchResultsProps) {
  const [results, setResults] = useState<AnimeResult[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    const fetchResults = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await fetch(
          `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(query)}&sfw=true&page=${currentPage}`
        )
        if (!response.ok) {
          throw new Error('Failed to fetch results')
        }
        const data = await response.json()
        setResults(data.data)
        setTotalPages(Math.ceil(data.pagination.items.total / data.pagination.items.per_page))
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setIsLoading(false)
      }
    }

    if (query) {
      fetchResults()
    }
  }, [query, currentPage])

  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="bg-card rounded-lg overflow-hidden shadow-md animate-pulse"
        >
          <div className="flex h-full">
            <div className="w-[120px] h-[180px] bg-muted"></div>
            <div className="p-4 flex-1">
              <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-muted rounded w-1/4 mb-2"></div>
              <div className="h-4 bg-muted rounded w-1/4 mb-2"></div>
              <div className="h-4 bg-muted rounded w-full mt-2"></div>
              <div className="h-4 bg-muted rounded w-full mt-1"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )

  if (isLoading) {
    return <LoadingSkeleton />
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-8">
        <p>Error: {error}</p>
        <Button 
          variant="outline" 
          className="mt-4"
          onClick={() => setCurrentPage(currentPage)}
        >
          Try Again
        </Button>
      </div>
    )
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-8">
        <p>No results found for "{query}"</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {results.map((anime) => (
          <Link
            href={`/anime/${anime.mal_id}`}
            key={anime.mal_id}
            className="group bg-card hover:bg-accent rounded-lg overflow-hidden shadow-md transition-colors"
          >
            <div className="flex h-full">
              <div className="w-[120px] relative shrink-0">
                <Image
                  src={anime.images.jpg.image_url}
                  alt={anime.title}
                  width={120}
                  height={180}
                  className="object-cover h-full"
                />
              </div>
              <div className="p-4 flex flex-col flex-1">
                <h3 className="font-semibold text-lg group-hover:text-primary transition-colors line-clamp-2">
                  {anime.title}
                </h3>
                {anime.score > 0 && (
                  <div className="text-sm text-muted-foreground mt-1">
                    Score: {anime.score.toFixed(1)}
                  </div>
                )}
                {anime.year && (
                  <div className="text-sm text-muted-foreground">
                    Year: {anime.year}
                  </div>
                )}
                <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                  {anime.synopsis || 'No synopsis available.'}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      )}
    </div>
  )
} 