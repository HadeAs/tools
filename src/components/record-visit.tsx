'use client'

import { useEffect } from 'react'
import { useRecentTools } from '@/hooks/use-recent-tools'

export function RecordVisit({ slug }: { slug: string }) {
  const { recordVisit } = useRecentTools()
  useEffect(() => {
    recordVisit(slug)
    fetch(`/api/stats/${slug}`, { method: 'POST' }).catch(() => {})
  }, [slug]) // eslint-disable-line react-hooks/exhaustive-deps
  return null
}
