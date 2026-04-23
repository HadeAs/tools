import { describe, it, expect } from 'vitest'
import { convert } from './logic'

describe('simplified to traditional', () => {
  it('converts basic simplified to traditional', () => {
    const result = convert('汉字', 'cn-to-tw')
    expect(result).toBe('漢字')
  })

  it('converts 简体 to 簡體', () => {
    const result = convert('简体中文', 'cn-to-tw')
    expect(result).toContain('簡')
    expect(result).toContain('體')
  })

  it('returns empty string for empty input', () => {
    expect(convert('', 'cn-to-tw')).toBe('')
    expect(convert('  ', 'cn-to-tw')).toBe('')
  })
})

describe('traditional to simplified', () => {
  it('converts basic traditional to simplified', () => {
    const result = convert('漢字', 'tw-to-cn')
    expect(result).toBe('汉字')
  })

  it('converts 國 to 国', () => {
    const result = convert('中國', 'tw-to-cn')
    expect(result).toContain('国')
  })
})
