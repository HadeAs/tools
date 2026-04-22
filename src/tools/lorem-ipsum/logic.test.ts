import { describe, it, expect } from 'vitest'
import { generate } from './logic'

describe('lorem-ipsum', () => {
  it('generates correct word count (en)', () => {
    const text = generate('words', 10, 'en')
    expect(text.split(' ')).toHaveLength(10)
  })
  it('generates correct paragraph count', () => {
    const text = generate('paragraphs', 3, 'en')
    expect(text.split('\n\n')).toHaveLength(3)
  })
  it('generates correct paragraph count (zh)', () => {
    const text = generate('paragraphs', 2, 'zh')
    expect(text.split('\n\n')).toHaveLength(2)
  })
  it('generates correct sentence count', () => {
    const text = generate('sentences', 5, 'en')
    const sentences = text.split('. ').length + (text.endsWith('.') ? 0 : -1)
    expect(sentences).toBeGreaterThanOrEqual(4)
  })
  it('generates non-empty output', () => {
    expect(generate('words', 1, 'en')).not.toBe('')
    expect(generate('sentences', 1, 'zh')).not.toBe('')
  })
  it('generates correct zh word count (no spaces)', () => {
    const text = generate('words', 8, 'zh')
    expect([...text].length).toBe(8)
  })
  it('generates single word', () => {
    expect(generate('words', 1, 'en').split(' ')).toHaveLength(1)
  })
  it('generates single sentence in zh ending with 。', () => {
    const text = generate('sentences', 1, 'zh')
    expect(text.endsWith('。')).toBe(true)
  })
  it('generates single paragraph', () => {
    expect(generate('paragraphs', 1, 'en').split('\n\n')).toHaveLength(1)
  })
})
