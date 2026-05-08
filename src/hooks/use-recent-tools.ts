import { useCallback } from 'react'
import { usePersistedState } from './use-persisted-state'

const KEY = 'recent-tools'
const MAX = 8

export function useRecentTools() {
  const [recent, setRecent] = usePersistedState<string[]>(KEY, [])

  const recordVisit = useCallback((slug: string) => {
    // 直接读 localStorage 而非依赖 React state，避免 hydration 前 stale closure
    // 造成每次访问都把历史清空为 [currentSlug] 的 bug
    try {
      const stored = localStorage.getItem(KEY)
      const current: string[] = stored ? (JSON.parse(stored) as string[]) : []
      const updated = [slug, ...current.filter(s => s !== slug)].slice(0, MAX)
      setRecent(updated)
    } catch {
      setRecent([slug])
    }
  }, [setRecent])

  return { recent, recordVisit }
}
