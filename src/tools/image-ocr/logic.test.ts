import { describe, it, expect } from 'vitest'
import { validateImageFile, formatConfidence, formatProgress, cleanOcrText } from './logic'

function makeFile(type: string, size: number): File {
  const blob = new Blob([new Uint8Array(size)], { type })
  return new File([blob], 'test', { type })
}

describe('validateImageFile', () => {
  it('非图片文件被拒绝', () => {
    expect(validateImageFile(makeFile('text/plain', 10))).toBeTruthy()
    expect(validateImageFile(makeFile('application/pdf', 10))).toBeTruthy()
  })

  it('合法图片通过', () => {
    expect(validateImageFile(makeFile('image/png', 1000))).toBeNull()
    expect(validateImageFile(makeFile('image/jpeg', 1000))).toBeNull()
  })

  it('超过 10MB 被拒绝', () => {
    expect(validateImageFile(makeFile('image/png', 11 * 1024 * 1024))).toBeTruthy()
  })
})

describe('formatConfidence', () => {
  it('四舍五入并加百分号', () => {
    expect(formatConfidence(95.6)).toBe('96%')
    expect(formatConfidence(0)).toBe('0%')
  })

  it('超出范围被钳制', () => {
    expect(formatConfidence(-5)).toBe('0%')
    expect(formatConfidence(120)).toBe('100%')
  })
})

describe('cleanOcrText', () => {
  it('去掉中文字符之间的空格', () => {
    expect(cleanOcrText('你 好 世 界')).toBe('你好世界')
    expect(cleanOcrText('这 是  一 段   文字')).toBe('这是一段文字')
  })

  it('保留中英文/数字之间的空格', () => {
    expect(cleanOcrText('Hello 世界')).toBe('Hello 世界')
    expect(cleanOcrText('第 3 章')).toBe('第 3 章')
    expect(cleanOcrText('the quick fox')).toBe('the quick fox')
  })

  it('合并 3 行以上空行、去掉行尾空白', () => {
    expect(cleanOcrText('a\n\n\n\nb')).toBe('a\n\nb')
    expect(cleanOcrText('行一   \n行二')).toBe('行一\n行二')
  })

  it('去掉首尾空白', () => {
    expect(cleanOcrText('  \n内容\n  ')).toBe('内容')
  })
})

describe('formatProgress', () => {
  it('0-1 映射到 0-100 整数', () => {
    expect(formatProgress(0.5)).toBe(50)
    expect(formatProgress(0)).toBe(0)
    expect(formatProgress(1)).toBe(100)
  })

  it('超出范围被钳制', () => {
    expect(formatProgress(-1)).toBe(0)
    expect(formatProgress(2)).toBe(100)
  })
})
