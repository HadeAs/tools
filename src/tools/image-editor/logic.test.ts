import { describe, it, expect } from 'vitest'
import { createTextLayer, fontString } from './logic'

describe('createTextLayer', () => {
  it('returns object with given id', () => {
    const layer = createTextLayer('abc')
    expect(layer.id).toBe('abc')
  })

  it('has non-empty default text', () => {
    const layer = createTextLayer('1')
    expect(layer.text.length).toBeGreaterThan(0)
  })

  it('position defaults to roughly center', () => {
    const layer = createTextLayer('1')
    expect(layer.x).toBeGreaterThan(0)
    expect(layer.x).toBeLessThan(100)
    expect(layer.y).toBeGreaterThan(0)
    expect(layer.y).toBeLessThan(100)
  })

  it('opacity defaults to 100', () => {
    expect(createTextLayer('1').opacity).toBe(100)
  })

  it('bgOpacity defaults to 0', () => {
    expect(createTextLayer('1').bgOpacity).toBe(0)
  })
})

describe('fontString', () => {
  it('generates basic font string', () => {
    const result = fontString({ bold: false, italic: false, fontSize: 24, fontFamily: 'sans-serif' })
    expect(result).toBe('24px sans-serif')
  })

  it('includes bold', () => {
    const result = fontString({ bold: true, italic: false, fontSize: 24, fontFamily: 'serif' })
    expect(result).toContain('bold')
    expect(result).toContain('24px')
    expect(result).toContain('serif')
  })

  it('includes italic', () => {
    const result = fontString({ bold: false, italic: true, fontSize: 16, fontFamily: 'monospace' })
    expect(result).toContain('italic')
    expect(result).not.toContain('bold')
  })

  it('includes both bold and italic', () => {
    const result = fontString({ bold: true, italic: true, fontSize: 32, fontFamily: 'Georgia, serif' })
    expect(result).toContain('italic')
    expect(result).toContain('bold')
    expect(result).toContain('32px')
  })

  it('italic appears before bold in CSS font string', () => {
    const result = fontString({ bold: true, italic: true, fontSize: 12, fontFamily: 'serif' })
    expect(result.indexOf('italic')).toBeLessThan(result.indexOf('bold'))
  })
})
