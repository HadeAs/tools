import { describe, it, expect } from 'vitest'
import { getMimeType, getApproxSize, formatSize } from './logic'

describe('image-base64', () => {
  it('extracts mime type from data url', () => {
    expect(getMimeType('data:image/png;base64,abc')).toBe('image/png')
    expect(getMimeType('data:image/jpeg;base64,xyz')).toBe('image/jpeg')
  })
  it('returns unknown for invalid url', () => {
    expect(getMimeType('not-a-data-url')).toBe('unknown')
  })
  it('formats size in bytes', () => {
    expect(formatSize(512)).toBe('512 B')
  })
  it('formats size in KB', () => {
    expect(formatSize(2048)).toBe('2.0 KB')
  })
  it('formats size in MB', () => {
    expect(formatSize(1572864)).toBe('1.50 MB')
  })
  it('approximates base64 decoded size', () => {
    // 4 base64 chars = 3 bytes
    const dataUrl = 'data:image/png;base64,' + 'AAAA'.repeat(100)
    expect(getApproxSize(dataUrl)).toBe(300)
  })
})
