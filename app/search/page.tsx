import { Suspense } from 'react'
import { SearchResults } from '@/components/search-results'

export default function SearchPage({
  searchParams,
}: {
  searchParams: { q: string }
}) {
  return (
    <div className="container max-w-7xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">
        Search Results for "{searchParams.q}"
      </h1>
      <Suspense fallback={<div>Loading...</div>}>
        <SearchResults query={searchParams.q} />
      </Suspense>
    </div>
  )
} 