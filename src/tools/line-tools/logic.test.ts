import { describe, it, expect } from 'vitest'
import { processLines } from './logic'

describe('processLines', () => {
  it('sort-asc sorts alphabetically', () => {
    expect(processLines('banana\napple\ncherry', 'sort-asc')).toBe('apple\nbanana\ncherry')
  })

  it('sort-desc sorts reverse alphabetically', () => {
    expect(processLines('banana\napple\ncherry', 'sort-desc')).toBe('cherry\nbanana\napple')
  })

  it('dedupe removes duplicates preserving order', () => {
    expect(processLines('a\nb\na\nc\nb', 'dedupe')).toBe('a\nb\nc')
  })

  it('remove-empty removes blank lines', () => {
    expect(processLines('a\n\nb\n  \nc', 'remove-empty')).toBe('a\nb\nc')
  })

  it('reverse reverses lines', () => {
    expect(processLines('a\nb\nc', 'reverse')).toBe('c\nb\na')
  })

  it('trim strips whitespace from each line', () => {
    expect(processLines('  hello  \n  world  ', 'trim')).toBe('hello\nworld')
  })

  it('shuffle returns same lines in different order (probabilistic)', () => {
    const input = Array.from({ length: 20 }, (_, i) => String(i)).join('\n')
    const result = processLines(input, 'shuffle')
    const inputLines = input.split('\n').sort()
    const resultLines = result.split('\n').sort()
    expect(resultLines).toEqual(inputLines)
  })

  it('handles single line', () => {
    expect(processLines('only', 'sort-asc')).toBe('only')
    expect(processLines('only', 'reverse')).toBe('only')
  })
})
