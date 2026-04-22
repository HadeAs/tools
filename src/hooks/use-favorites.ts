import { usePersistedState } from './use-persisted-state'

export function useFavorites() {
  const [favorites, setFavorites] = usePersistedState<string[]>('tool:favorites', [])

  const toggle = (slug: string) => {
    setFavorites(
      favorites.includes(slug)
        ? favorites.filter(s => s !== slug)
        : [slug, ...favorites]
    )
  }

  const isFavorite = (slug: string) => favorites.includes(slug)

  return { favorites, toggle, isFavorite }
}
