import { describe, it, expect } from 'vitest'
import { jsonToCsv, csvToJson } from './logic'

describe('json-csv', () => {
  it('converts json array to csv', () => {
    const csv = jsonToCsv('[{"name":"Alice","age":30},{"name":"Bob","age":25}]')
    expect(csv).toBe('name,age\nAlice,30\nBob,25')
  })
  it('escapes fields with commas', () => {
    const csv = jsonToCsv('[{"a":"hello, world"}]')
    expect(csv).toBe('a\n"hello, world"')
  })
  it('escapes fields with quotes', () => {
    const csv = jsonToCsv('[{"a":"say \\"hi\\""}]')
    expect(csv).toContain('""hi""')
  })
  it('throws if not array', () => {
    expect(() => jsonToCsv('{"a":1}')).toThrow()
  })
  it('converts csv to json', () => {
    const json = JSON.parse(csvToJson('name,age\nAlice,30\nBob,25'))
    expect(json).toEqual([{ name: 'Alice', age: '30' }, { name: 'Bob', age: '25' }])
  })
  it('handles quoted csv fields', () => {
    const json = JSON.parse(csvToJson('a,b\n"hello, world",test'))
    expect(json[0].a).toBe('hello, world')
  })
  it('throws if csv has no data rows', () => {
    expect(() => csvToJson('name,age')).toThrow()
  })
})
