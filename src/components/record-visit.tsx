'use client'

import { useEffect } from 'react'
import { useRecentTools } from '@/hooks/use-recent-tools'

export function RecordVisit({ slug }: { slug: string }) {
  const { recordVisit } = useRecentTools()
  useEffect(() => { recordVisit(slug) }, [slug]) // eslint-disable-line react-hooks/exhaustive-deps
  return null
}
