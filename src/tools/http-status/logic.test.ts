import { describe, it, expect } from 'vitest'
import { searchStatus, STATUS_CODES } from './logic'

describe('STATUS_CODES', () => {
  it('contains common codes', () => {
    const codes = STATUS_CODES.map(s => s.code)
    expect(codes).toContain(200)
    expect(codes).toContain(404)
    expect(codes).toContain(500)
    expect(codes).toContain(301)
  })

  it('all entries have required fields', () => {
    for (const s of STATUS_CODES) {
      expect(s.code).toBeGreaterThan(99)
      expect(s.name.length).toBeGreaterThan(0)
      expect(s.description.length).toBeGreaterThan(0)
      expect(['1xx', '2xx', '3xx', '4xx', '5xx']).toContain(s.category)
    }
  })
})

describe('searchStatus', () => {
  it('returns all when query is empty', () => {
    expect(searchStatus('')).toHaveLength(STATUS_CODES.length)
  })

  it('finds by exact code', () => {
    const result = searchStatus('404')
    expect(result.some(s => s.code === 404)).toBe(true)
  })

  it('finds by code prefix', () => {
    const result = searchStatus('5')
    expect(result.every(s => s.category === '5xx')).toBe(true)
  })

  it('finds by name keyword', () => {
    const result = searchStatus('not found')
    expect(result.some(s => s.code === 404)).toBe(true)
  })

  it('finds by description keyword', () => {
    const result = searchStatus('限流')
    expect(result.some(s => s.code === 429)).toBe(true)
  })

  it('returns empty for no match', () => {
    expect(searchStatus('99999')).toHaveLength(0)
  })

  it('is case insensitive', () => {
    const result = searchStatus('OK')
    expect(result.some(s => s.code === 200)).toBe(true)
  })
})
