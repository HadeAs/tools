import { describe, it, expect } from 'vitest'
import { tools, getToolBySlug, getToolsByCategory, getRelatedTools } from './registry'

describe('registry', () => {
  it('has no duplicate slugs', () => {
    const slugs = tools.map(t => t.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
  })

  it('getToolBySlug returns correct tool', () => {
    const tool = getToolBySlug('json-formatter')
    expect(tool?.name).toBe('JSON 格式化')
  })

  it('getToolBySlug returns undefined for unknown slug', () => {
    expect(getToolBySlug('nonexistent')).toBeUndefined()
  })

  it('getToolsByCategory returns only tools in that category', () => {
    const devTools = getToolsByCategory('developer')
    expect(devTools.every(t => t.category === 'developer')).toBe(true)
    expect(devTools.length).toBeGreaterThan(0)
  })

  it('getRelatedTools returns up to 4 tools excluding current', () => {
    const related = getRelatedTools('json-formatter')
    expect(related.length).toBeLessThanOrEqual(4)
    expect(related.find(t => t.slug === 'json-formatter')).toBeUndefined()
  })

  it('getRelatedTools fills from other categories when same category has fewer than 2', () => {
    const related = getRelatedTools('color-converter')
    expect(related.length).toBeGreaterThan(0)
  })
})
