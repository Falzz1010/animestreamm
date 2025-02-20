'use client'

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"

interface AnimatedCardProps {
  episode: {
    episodeUrl: string
    animeImg: string
    animeTitle: string
    episodeNum: string | number
  }
  index: number
}

export function AnimatedCard({ episode, index }: AnimatedCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <Link href={episode.episodeUrl}>
        <Card className="overflow-hidden group transition-all duration-300 hover:shadow-[0_0_15px_rgba(255,255,255,0.3)]">
          <div className="relative aspect-[2/3]">
            <Image
              src={episode.animeImg}
              alt={episode.animeTitle}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            <div className="absolute bottom-0 p-4 w-full">
              <h3 className="text-lg font-semibold text-white line-clamp-2">{episode.animeTitle}</h3>
              <p className="text-sm text-white/90 mt-1">Episode {episode.episodeNum}</p>
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  )
} 