import type { MetadataRoute } from 'next'
import { tools } from '@/tools/registry'

const BASE_URL = 'https://devtools.vercel.app'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    ...tools.map(t => ({
      url: `${BASE_URL}/tools/${t.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
  ]
}
