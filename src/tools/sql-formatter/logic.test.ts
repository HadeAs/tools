import { describe, it, expect } from 'vitest'
import { formatSQL } from './logic'

describe('formatSQL', () => {
  it('uppercases keywords', () => {
    const result = formatSQL('select * from users')
    expect(result).toContain('SELECT')
    expect(result).toContain('FROM')
  })

  it('formats a basic SELECT with WHERE', () => {
    const result = formatSQL('select id,name from users where id=1')
    expect(result).toContain('SELECT')
    expect(result).toContain('WHERE')
    expect(result).toContain('id = 1')
  })

  it('formats a JOIN query', () => {
    const result = formatSQL('select u.name,o.id from users u join orders o on u.id=o.user_id')
    expect(result).toContain('JOIN')
    expect(result).toContain('ON')
  })

  it('works with MySQL dialect', () => {
    const result = formatSQL('select * from `users` where `id` = 1', 'mysql')
    expect(result).toContain('SELECT')
  })

  it('works with PostgreSQL dialect', () => {
    const result = formatSQL('select id::text from users', 'postgresql')
    expect(result).toContain('SELECT')
  })

  it('returns formatted multi-line output', () => {
    const result = formatSQL('select a,b,c from t where a=1 and b=2')
    expect(result.split('\n').length).toBeGreaterThan(1)
  })
})
