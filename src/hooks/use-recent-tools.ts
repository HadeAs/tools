import { useCallback } from 'react'
import { usePersistedState } from './use-persisted-state'

const KEY = 'recent-tools'
const MAX = 4

export function useRecentTools() {
  const [recent, setRecent] = usePersistedState<string[]>(KEY, [])

  const recordVisit = useCallback((slug: string) => {
    setRecent([slug, ...recent.filter((s: string) => s !== slug)].slice(0, MAX))
  }, [recent, setRecent])

  return { recent, recordVisit }
}
