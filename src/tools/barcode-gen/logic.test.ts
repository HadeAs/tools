import { describe, it, expect } from 'vitest'
import { validateInput } from './logic'

describe('validateInput', () => {
  it('空输入返回错误', () => {
    expect(validateInput('', 'CODE128')).toBeTruthy()
    expect(validateInput('  ', 'CODE128')).toBeTruthy()
  })

  it('CODE128 接受任意非空字符串', () => {
    expect(validateInput('Hello World!', 'CODE128')).toBe('')
    expect(validateInput('12345', 'CODE128')).toBe('')
  })

  it('EAN-13 需要 12 或 13 位数字', () => {
    expect(validateInput('5901234123457', 'EAN13')).toBe('')  // 13 位
    expect(validateInput('590123412345', 'EAN13')).toBe('')   // 12 位
    expect(validateInput('abc', 'EAN13')).toBeTruthy()
    expect(validateInput('123456789', 'EAN13')).toBeTruthy()  // 9 位
  })

  it('EAN-8 需要 7 或 8 位数字', () => {
    expect(validateInput('96385074', 'EAN8')).toBe('')   // 8 位
    expect(validateInput('9638507', 'EAN8')).toBe('')    // 7 位
    expect(validateInput('123', 'EAN8')).toBeTruthy()
  })

  it('UPC-A 需要 11 或 12 位数字', () => {
    expect(validateInput('012345678905', 'UPC')).toBe('')
    expect(validateInput('01234567890', 'UPC')).toBe('')
    expect(validateInput('1234', 'UPC')).toBeTruthy()
  })

  it('ITF-14 需要 13 或 14 位数字', () => {
    expect(validateInput('10012345678902', 'ITF14')).toBe('')
    expect(validateInput('1001234567890', 'ITF14')).toBe('')
    expect(validateInput('abc', 'ITF14')).toBeTruthy()
  })

  it('MSI 只接受数字', () => {
    expect(validateInput('12345678', 'MSI')).toBe('')
    expect(validateInput('abc', 'MSI')).toBeTruthy()
  })

  it('Pharmacode 范围校验', () => {
    expect(validateInput('1234', 'pharmacode')).toBe('')
    expect(validateInput('2', 'pharmacode')).toBeTruthy()     // < 3
    expect(validateInput('200000', 'pharmacode')).toBeTruthy() // > 131583
    expect(validateInput('abc', 'pharmacode')).toBeTruthy()
  })
})
