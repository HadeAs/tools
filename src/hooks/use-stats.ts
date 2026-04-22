'use client'

import { useState, useEffect } from 'react'

export type StatsMap = Record<string, number>

export function useStats() {
  const [stats, setStats] = useState<StatsMap>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/stats')
      .then(r => r.json())
      .then(setStats)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return { stats, loading }
}

export function formatCount(n: number): string {
  if (n >= 10_000) return `${(n / 10_000).toFixed(1)}w`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`
  return String(n)
}
