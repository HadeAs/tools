import { describe, it, expect } from 'vitest'
import { jsonToZod, inferTypeLine, defaultOptions } from './logic'

const opts = defaultOptions

describe('jsonToZod', () => {
  it('空输入返回空字符串', () => {
    expect(jsonToZod('', opts).output).toBe('')
    expect(jsonToZod('  ', opts).output).toBe('')
  })

  it('无效 JSON 返回 error', () => {
    const r = jsonToZod('{bad}', opts)
    expect(r.error).toBeTruthy()
    expect(r.output).toBe('')
  })

  it('包含 zod import', () => {
    const r = jsonToZod('"hello"', opts)
    expect(r.output).toContain("import { z } from 'zod'")
  })

  it('字符串 → z.string()', () => {
    const r = jsonToZod('"hello"', opts)
    expect(r.output).toContain('z.string()')
  })

  it('整数 → z.number().int()', () => {
    const r = jsonToZod('42', opts)
    expect(r.output).toContain('z.number().int()')
  })

  it('浮点数 → z.number()', () => {
    const r = jsonToZod('3.14', opts)
    expect(r.output).toContain('z.number()')
    expect(r.output).not.toContain('z.number().int()')
  })

  it('inferInt=false 时整数也是 z.number()', () => {
    const r = jsonToZod('42', { ...opts, inferInt: false })
    expect(r.output).not.toContain('.int()')
  })

  it('布尔 → z.boolean()', () => {
    const r = jsonToZod('true', opts)
    expect(r.output).toContain('z.boolean()')
  })

  it('null → z.null()', () => {
    const r = jsonToZod('null', opts)
    expect(r.output).toContain('z.null()')
  })

  it('空数组 → z.array(z.unknown())', () => {
    const r = jsonToZod('[]', opts)
    expect(r.output).toContain('z.array(z.unknown())')
  })

  it('字符串数组 → z.array(z.string())', () => {
    const r = jsonToZod('["a","b"]', opts)
    expect(r.output).toContain('z.array(z.string())')
  })

  it('简单对象生成 z.object()', () => {
    const r = jsonToZod('{"name":"Alice","age":30}', opts)
    expect(r.error).toBe('')
    expect(r.output).toContain('z.object(')
    expect(r.output).toContain('name: z.string()')
    expect(r.output).toContain('age: z.number().int()')
  })

  it('嵌套对象生成多个 schema', () => {
    const r = jsonToZod('{"user":{"id":1,"active":true}}', opts)
    expect(r.output).toContain('userSchema')
    expect(r.output).toContain('rootSchema')
    expect(r.output).toContain('id: z.number().int()')
    expect(r.output).toContain('active: z.boolean()')
  })

  it('可选字段选项', () => {
    const r = jsonToZod('{"x":1}', { ...opts, optionalFields: true })
    expect(r.output).toContain('.optional()')
  })

  it('不加 export', () => {
    const r = jsonToZod('{"x":1}', { ...opts, addExport: false })
    expect(r.output).not.toContain('export const')
  })

  it('自定义根名称', () => {
    const r = jsonToZod('{"x":1}', { ...opts, rootName: 'user' })
    expect(r.output).toContain('userSchema')
  })
})

describe('inferTypeLine', () => {
  it('生成 infer 类型行', () => {
    const line = inferTypeLine('root', true)
    expect(line).toBe('export type Root = z.infer<typeof rootSchema>')
  })

  it('无 export', () => {
    const line = inferTypeLine('user', false)
    expect(line).toBe('type User = z.infer<typeof userSchema>')
  })
})
