import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function GenreNotFound() {
  return (
    <div className="container max-w-7xl mx-auto py-16 text-center space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Genre Not Found</h1>
        <p className="text-xl text-muted-foreground">
          Sorry, we couldn't find the genre you're looking for.
        </p>
      </div>
      <Button asChild>
        <Link href="/genres">Browse All Genres</Link>
      </Button>
    </div>
  )
} 