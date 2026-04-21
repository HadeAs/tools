export interface BaseResult {
  binary: string
  octal: string
  decimal: string
  hex: string
}

const VALID_CHARS: Record<number, RegExp> = {
  2:  /^-?[01]+$/,
  8:  /^-?[0-7]+$/,
  10: /^-?[0-9]+$/,
  16: /^-?[0-9a-fA-F]+$/,
}

const BASE_NAMES: Record<number, string> = {
  2: '二进制（仅含 0 和 1）',
  8: '八进制（仅含 0-7）',
  10: '十进制（仅含 0-9）',
  16: '十六进制（仅含 0-9 和 A-F）',
}

export function convertBase(input: string, fromBase: number): BaseResult {
  const s = input.trim()
  const pattern = VALID_CHARS[fromBase]
  if (pattern && !pattern.test(s)) {
    throw new Error(`输入含有非法字符，${BASE_NAMES[fromBase] ?? '请检查输入'}`)
  }
  const n = parseInt(s, fromBase)
  if (isNaN(n)) throw new Error('无效的数值')
  return {
    binary: n.toString(2),
    octal: n.toString(8),
    decimal: n.toString(10),
    hex: n.toString(16).toUpperCase(),
  }
}
