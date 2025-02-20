import { cache } from 'react'

const JIKAN_API_BASE_URL = 'https://api.jikan.moe/v4'

export interface AnimeEpisode {
  episodeId: string
  animeTitle: string
  episodeNum: string
  subOrDub: string
  animeImg: string
  episodeUrl: string
}

export interface PopularAnime {
  animeId: string
  animeTitle: string
  animeImg: string
  releasedDate: string
  animeUrl: string
}

export interface TopAiringAnime {
  animeId: string
  animeTitle: string
  animeImg: string
  latestEp: string
  animeUrl: string
  genres: string[]
}

export interface AnimeDetails {
  animeTitle: string
  type: string
  releasedDate: string
  status: string
  genres: string[]
  otherNames: string
  synopsis: string
  animeImg: string
  episodesAvaliable: string
  episodesList: {
    episodeId: string
    episodeNum: string
    episodeUrl: string
  }[]
}

export interface JikanAnime {
  mal_id: number
  title: string
  images: {
    jpg: {
      image_url: string
      small_image_url: string
      large_image_url: string
    }
    webp: {
      image_url: string
      small_image_url: string
      large_image_url: string
    }
  }
  episodes: number
  status: string
  score: number
  synopsis: string
  year: number
  season: string
}

export interface JikanResponse<T> {
  data: T[]
  pagination: {
    last_visible_page: number
    has_next_page: boolean
  }
}

export const getRecentEpisodes = cache(async (page = 1) => {
  try {
    // Fetch multiple pages of data
    const responses = await Promise.all([1, 2, 3].map(pageNum => 
      fetch(`${JIKAN_API_BASE_URL}/seasons/now?page=${pageNum}`, {
        next: { revalidate: 3600 }
      })
    ))
    
    const data = await Promise.all(responses.map(r => r.json()))
    const allAnime = data.flatMap(d => (d as JikanResponse<JikanAnime>).data)
    
    return allAnime.map(anime => ({
      episodeId: anime.mal_id.toString(),
      animeTitle: anime.title,
      episodeNum: '1',
      subOrDub: 'sub',
      animeImg: anime.images.jpg.image_url,
      episodeUrl: `https://myanimelist.net/anime/${anime.mal_id}`
    }))
  } catch (error) {
    console.error('Error fetching recent episodes:', error)
    return []
  }
})

export const getPopularAnime = cache(async (page = 1) => {
  try {
    // Fetch multiple pages of data
    const responses = await Promise.all([1, 2, 3].map(pageNum => 
      fetch(`${JIKAN_API_BASE_URL}/top/anime?page=${pageNum}`, {
        next: { revalidate: 3600 }
      })
    ))
    
    const data = await Promise.all(responses.map(r => r.json()))
    const allAnime = data.flatMap(d => (d as JikanResponse<JikanAnime>).data)
    
    return allAnime.map(anime => ({
      animeId: anime.mal_id.toString(),
      animeTitle: anime.title,
      animeImg: anime.images.jpg.image_url,
      releasedDate: anime.year?.toString() || 'Unknown',
      animeUrl: `https://myanimelist.net/anime/${anime.mal_id}`
    }))
  } catch (error) {
    console.error('Error fetching popular anime:', error)
    return []
  }
})

export const getTopAiring = cache(async (page = 1) => {
  try {
    // Fetch multiple pages of data
    const responses = await Promise.all([1, 2, 3].map(pageNum => 
      fetch(`${JIKAN_API_BASE_URL}/seasons/now?page=${pageNum}`, {
        next: { revalidate: 3600 }
      })
    ))
    
    const data = await Promise.all(responses.map(r => r.json()))
    const allAnime = data.flatMap(d => (d as JikanResponse<JikanAnime>).data)
    
    return allAnime.map(anime => ({
      animeId: anime.mal_id.toString(),
      animeTitle: anime.title,
      animeImg: anime.images.jpg.image_url,
      latestEp: anime.episodes?.toString() || 'Unknown',
      animeUrl: `https://myanimelist.net/anime/${anime.mal_id}`
    }))
  } catch (error) {
    console.error('Error fetching top airing:', error)
    return []
  }
})

export const getAnimeDetails = cache(async (animeId: string) => {
  const response = await fetch(`${JIKAN_API_BASE_URL}/anime/${animeId}`)
  const data = await response.json()
  return data as AnimeDetails
})

export const searchAnime = cache(async (keyword: string, page = 1) => {
  const response = await fetch(`${JIKAN_API_BASE_URL}/anime?q=${encodeURIComponent(keyword)}&page=${page}`)
  const data = await response.json() as JikanResponse<JikanAnime>
  return data.data.map(anime => ({
    animeId: anime.mal_id.toString(),
    animeTitle: anime.title,
    animeImg: anime.images.jpg.image_url,
    releasedDate: anime.year?.toString() || 'Unknown',
    animeUrl: `https://myanimelist.net/anime/${anime.mal_id}`
  }))
})