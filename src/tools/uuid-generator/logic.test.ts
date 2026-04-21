import { describe, it, expect } from 'vitest'
import { generateUUID, generateBatch } from './logic'

describe('uuid-generator', () => {
  it('generates a valid UUID v4', () => {
    const uuid = generateUUID()
    expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/)
  })
  it('generates unique UUIDs', () => {
    const a = generateUUID(), b = generateUUID()
    expect(a).not.toBe(b)
  })
  it('generates correct batch count', () => {
    expect(generateBatch(5)).toHaveLength(5)
  })
})
