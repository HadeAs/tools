import { describe, it, expect } from 'vitest'
import { jsonToXml, defaultOptions } from './logic'

const opts = defaultOptions

describe('jsonToXml', () => {
  it('空输入返回空字符串', () => {
    expect(jsonToXml('', opts).output).toBe('')
    expect(jsonToXml('  ', opts).output).toBe('')
  })

  it('无效 JSON 返回 error', () => {
    const r = jsonToXml('{bad}', opts)
    expect(r.error).toBeTruthy()
    expect(r.output).toBe('')
  })

  it('包含 XML 声明', () => {
    const r = jsonToXml('{"x":1}', opts)
    expect(r.output).toContain('<?xml version="1.0" encoding="UTF-8"?>')
  })

  it('不含 XML 声明（declaration=false）', () => {
    const r = jsonToXml('{"x":1}', { ...opts, declaration: false })
    expect(r.output).not.toContain('<?xml')
  })

  it('字符串值', () => {
    const r = jsonToXml('{"name":"Alice"}', { ...opts, declaration: false })
    expect(r.output).toContain('<name>Alice</name>')
  })

  it('数字值', () => {
    const r = jsonToXml('{"age":30}', { ...opts, declaration: false })
    expect(r.output).toContain('<age>30</age>')
  })

  it('布尔值', () => {
    const r = jsonToXml('{"active":true}', { ...opts, declaration: false })
    expect(r.output).toContain('<active>true</active>')
  })

  it('null → 自闭合标签', () => {
    const r = jsonToXml('{"x":null}', { ...opts, declaration: false })
    expect(r.output).toContain('<x />')
  })

  it('嵌套对象', () => {
    const r = jsonToXml('{"user":{"id":1}}', { ...opts, declaration: false })
    expect(r.output).toContain('<user>')
    expect(r.output).toContain('<id>1</id>')
    expect(r.output).toContain('</user>')
  })

  it('数组用 item 子元素', () => {
    const r = jsonToXml('{"tags":["a","b"]}', { ...opts, declaration: false })
    expect(r.output).toContain('<tags>')
    expect(r.output).toContain('<item>a</item>')
    expect(r.output).toContain('<item>b</item>')
    expect(r.output).toContain('</tags>')
  })

  it('空数组 → 自闭合', () => {
    const r = jsonToXml('{"items":[]}', { ...opts, declaration: false })
    expect(r.output).toContain('<items />')
  })

  it('XML 特殊字符转义', () => {
    const r = jsonToXml('{"msg":"<hello> & \\"world\\""}', { ...opts, declaration: false })
    expect(r.output).toContain('&lt;hello&gt;')
    expect(r.output).toContain('&amp;')
    expect(r.output).toContain('&quot;')
  })

  it('自定义根标签', () => {
    const r = jsonToXml('{"x":1}', { ...opts, declaration: false, rootTag: 'data' })
    expect(r.output).toContain('<data>')
    expect(r.output).toContain('</data>')
  })

  it('压缩模式（indent=0）', () => {
    const r = jsonToXml('{"a":1}', { ...opts, declaration: false, indent: 0 })
    expect(r.output).not.toContain('\n')
  })

  it('原始字符串作为根', () => {
    const r = jsonToXml('"hello"', { ...opts, declaration: false })
    expect(r.output).toContain('<root>hello</root>')
  })
})
