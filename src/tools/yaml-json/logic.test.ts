import { describe, it, expect } from 'vitest'
import { jsonToYaml, yamlToJson, convert } from './logic'

describe('jsonToYaml', () => {
  it('converts simple object', () => {
    const result = jsonToYaml('{"name":"Alice","age":30}')
    expect(result).toContain('name: Alice')
    expect(result).toContain('age: 30')
  })

  it('converts array', () => {
    const result = jsonToYaml('[1,2,3]')
    expect(result).toContain('- 1')
    expect(result).toContain('- 2')
  })

  it('converts nested object', () => {
    const result = jsonToYaml('{"user":{"id":1,"roles":["admin","user"]}}')
    expect(result).toContain('user:')
    expect(result).toContain('id: 1')
    expect(result).toContain('- admin')
  })

  it('throws on invalid JSON', () => {
    expect(() => jsonToYaml('{bad')).toThrow()
  })
})

describe('yamlToJson', () => {
  it('converts simple YAML', () => {
    const result = yamlToJson('name: Alice\nage: 30')
    const obj = JSON.parse(result)
    expect(obj.name).toBe('Alice')
    expect(obj.age).toBe(30)
  })

  it('converts YAML list', () => {
    const result = yamlToJson('- 1\n- 2\n- 3')
    expect(JSON.parse(result)).toEqual([1, 2, 3])
  })

  it('converts nested YAML', () => {
    const input = 'user:\n  id: 1\n  roles:\n    - admin\n    - user'
    const obj = JSON.parse(yamlToJson(input))
    expect(obj.user.id).toBe(1)
    expect(obj.user.roles).toEqual(['admin', 'user'])
  })

  it('throws on invalid YAML', () => {
    expect(() => yamlToJson(': :')).toThrow()
  })
})

describe('convert', () => {
  it('routes json-to-yaml', () => {
    const result = convert('{"a":1}', 'json-to-yaml')
    expect(result).toContain('a: 1')
  })

  it('routes yaml-to-json', () => {
    const result = convert('a: 1', 'yaml-to-json')
    expect(JSON.parse(result).a).toBe(1)
  })
})
