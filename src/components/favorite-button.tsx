'use client'

import { Star } from 'lucide-react'
import { useFavorites } from '@/hooks/use-favorites'

export function FavoriteButton({ slug }: { slug: string }) {
  const { isFavorite, toggle } = useFavorites()
  const starred = isFavorite(slug)
  return (
    <button
      onClick={e => { e.preventDefault(); e.stopPropagation(); toggle(slug) }}
      aria-label={starred ? '取消收藏' : '收藏'}
      className={`absolute right-2 top-2 rounded p-1 transition-all ${
        starred
          ? 'text-amber-400 opacity-100'
          : 'text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-amber-400'
      }`}
    >
      <Star className="h-3.5 w-3.5" fill={starred ? 'currentColor' : 'none'} />
    </button>
  )
}
