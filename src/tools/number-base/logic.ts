export interface BaseResult {
  binary: string
  octal: string
  decimal: string
  hex: string
}

export function convertBase(input: string, fromBase: number): BaseResult {
  const n = parseInt(input.trim(), fromBase)
  if (isNaN(n)) throw new Error('无效的数值')
  return {
    binary: n.toString(2),
    octal: n.toString(8),
    decimal: n.toString(10),
    hex: n.toString(16).toUpperCase(),
  }
}
