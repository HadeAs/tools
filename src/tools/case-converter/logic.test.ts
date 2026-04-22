import { describe, it, expect } from 'vitest'
import { toCamel, toSnake, toPascal, toKebab, toUpper, toLower } from './logic'

describe('case-converter', () => {
  it('converts to camelCase', () => expect(toCamel('hello world')).toBe('helloWorld'))
  it('converts to snake_case', () => expect(toSnake('Hello World')).toBe('hello_world'))
  it('converts to PascalCase', () => expect(toPascal('hello world')).toBe('HelloWorld'))
  it('converts to kebab-case', () => expect(toKebab('Hello World')).toBe('hello-world'))
  it('converts to UPPER_CASE', () => expect(toUpper('hello world')).toBe('HELLO_WORLD'))
  it('converts to lowercase', () => expect(toLower('HELLO WORLD')).toBe('hello world'))
  it('splits camelCase input', () => expect(toSnake('helloWorld')).toBe('hello_world'))
  it('splits PascalCase input', () => expect(toKebab('HelloWorld')).toBe('hello-world'))
  it('handles hyphen-separated input', () => expect(toCamel('hello-world')).toBe('helloWorld'))
  it('handles underscore-separated input', () => expect(toPascal('hello_world')).toBe('HelloWorld'))
  it('handles multiple spaces', () => expect(toSnake('hello   world')).toBe('hello_world'))
})
