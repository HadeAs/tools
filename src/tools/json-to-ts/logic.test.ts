import { describe, it, expect } from 'vitest'
import { jsonToTs, defaultOptions } from './logic'

const opts = defaultOptions

describe('jsonToTs', () => {
  it('空输入返回空字符串', () => {
    expect(jsonToTs('', opts).output).toBe('')
    expect(jsonToTs('  ', opts).output).toBe('')
  })

  it('无效 JSON 返回 error', () => {
    const r = jsonToTs('{bad json}', opts)
    expect(r.error).toBeTruthy()
    expect(r.output).toBe('')
  })

  it('基础类型：字符串', () => {
    const r = jsonToTs('"hello"', opts)
    expect(r.error).toBe('')
    expect(r.output).toContain('type Root = string')
  })

  it('基础类型：数字', () => {
    const r = jsonToTs('42', opts)
    expect(r.output).toContain('type Root = number')
  })

  it('基础类型：布尔', () => {
    const r = jsonToTs('true', opts)
    expect(r.output).toContain('type Root = boolean')
  })

  it('null 值', () => {
    const r = jsonToTs('null', opts)
    expect(r.output).toContain('type Root = null')
  })

  it('简单对象生成 interface', () => {
    const r = jsonToTs('{"name":"Alice","age":30}', opts)
    expect(r.error).toBe('')
    expect(r.output).toContain('export interface Root')
    expect(r.output).toContain('name: string;')
    expect(r.output).toContain('age: number;')
  })

  it('嵌套对象生成多个 interface', () => {
    const r = jsonToTs('{"user":{"id":1,"email":"a@b.com"}}', opts)
    expect(r.output).toContain('export interface Root')
    expect(r.output).toContain('export interface User')
    expect(r.output).toContain('user: User;')
    expect(r.output).toContain('id: number;')
    expect(r.output).toContain('email: string;')
  })

  it('数组字段', () => {
    const r = jsonToTs('{"tags":["a","b"]}', opts)
    expect(r.output).toContain('tags: string[];')
  })

  it('空数组为 unknown[]', () => {
    const r = jsonToTs('{"items":[]}', opts)
    expect(r.output).toContain('items: unknown[];')
  })

  it('对象数组生成嵌套 interface', () => {
    const r = jsonToTs('{"users":[{"id":1},{"id":2}]}', opts)
    expect(r.output).toContain('users: User[];')
    expect(r.output).toContain('export interface User')
  })

  it('可选字段选项', () => {
    const r = jsonToTs('{"name":"Alice"}', { ...opts, optionalFields: true })
    expect(r.output).toContain('name?: string;')
  })

  it('不加 export', () => {
    const r = jsonToTs('{"x":1}', { ...opts, addExport: false })
    expect(r.output).not.toContain('export')
    expect(r.output).toContain('interface Root')
  })

  it('使用 type 而非 interface', () => {
    const r = jsonToTs('{"x":1}', { ...opts, useInterface: false })
    expect(r.output).toContain('export type Root =')
  })

  it('自定义根接口名', () => {
    const r = jsonToTs('{"x":1}', { ...opts, rootName: 'MyModel' })
    expect(r.output).toContain('interface MyModel')
  })
})
