import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
 
export function LoadingGrid() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: 12 }).map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <div className="relative aspect-[2/3]">
            <Skeleton className="absolute inset-0" />
          </div>
        </Card>
      ))}
    </div>
  )
} 
