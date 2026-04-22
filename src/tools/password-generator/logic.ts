const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const LOWER = 'abcdefghijklmnopqrstuvwxyz'
const NUMS  = '0123456789'
const SYMS  = '!@#$%^&*()-_=+[]{}|;:,.<>?'

export interface PasswordOptions {
  length: number
  uppercase: boolean
  lowercase: boolean
  numbers: boolean
  symbols: boolean
}

export type Strength = 'weak' | 'medium' | 'strong'

function rand(max: number): number {
  const arr = new Uint32Array(1)
  crypto.getRandomValues(arr)
  return arr[0] % max
}

export function generatePassword(opts: PasswordOptions): string {
  const sets: string[] = []
  if (opts.uppercase) sets.push(UPPER)
  if (opts.lowercase) sets.push(LOWER)
  if (opts.numbers)   sets.push(NUMS)
  if (opts.symbols)   sets.push(SYMS)
  if (sets.length === 0) throw new Error('至少选择一种字符类型')

  const pool = sets.join('')
  const required = sets.map(s => s[rand(s.length)])
  const rest = Array.from({ length: opts.length - required.length }, () => pool[rand(pool.length)])
  const all = [...required, ...rest]

  for (let i = all.length - 1; i > 0; i--) {
    const j = rand(i + 1)
    ;[all[i], all[j]] = [all[j], all[i]]
  }
  return all.join('')
}

export function getStrength(pwd: string): Strength {
  let score = 0
  if (pwd.length >= 12) score++
  if (pwd.length >= 16) score++
  if (/[A-Z]/.test(pwd)) score++
  if (/[a-z]/.test(pwd)) score++
  if (/[0-9]/.test(pwd)) score++
  if (/[^A-Za-z0-9]/.test(pwd)) score++
  return score <= 2 ? 'weak' : score <= 4 ? 'medium' : 'strong'
}
