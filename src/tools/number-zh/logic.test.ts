import { describe, it, expect } from 'vitest'
import { numberToZh } from './logic'

describe('numberToZh', () => {
  it('converts 0', () => expect(numberToZh('0')).toBe('零元整'))
  it('converts 1', () => expect(numberToZh('1')).toBe('壹元整'))
  it('converts 10', () => expect(numberToZh('10')).toBe('壹拾元整'))
  it('converts 100', () => expect(numberToZh('100')).toBe('壹佰元整'))
  it('converts 1000', () => expect(numberToZh('1000')).toBe('壹仟元整'))
  it('converts 10000', () => expect(numberToZh('10000')).toBe('壹万元整'))
  it('converts 100000000', () => expect(numberToZh('100000000')).toBe('壹亿元整'))

  it('converts 1234', () => expect(numberToZh('1234')).toBe('壹仟贰佰叁拾肆元整'))
  it('converts 10001', () => expect(numberToZh('10001')).toBe('壹万零壹元整'))
  it('converts 100100', () => expect(numberToZh('100100')).toBe('壹拾万零壹佰元整'))

  it('converts decimal: 1.5', () => expect(numberToZh('1.5')).toBe('壹元伍角'))
  it('converts decimal: 1.56', () => expect(numberToZh('1.56')).toBe('壹元伍角陆分'))
  it('converts decimal: 100.05', () => expect(numberToZh('100.05')).toBe('壹佰元零伍分'))
  it('converts decimal: 0.5', () => expect(numberToZh('0.5')).toBe('零元伍角'))
  it('converts decimal: 0.56', () => expect(numberToZh('0.56')).toBe('零元伍角陆分'))
  it('converts decimal: 0.05', () => expect(numberToZh('0.05')).toBe('零元零伍分'))

  it('converts negative', () => expect(numberToZh('-100')).toBe('负壹佰元整'))

  it('throws for invalid input', () => {
    expect(() => numberToZh('abc')).toThrow()
    expect(() => numberToZh('1.234')).toThrow()
    expect(() => numberToZh('')).toThrow()
  })
})
