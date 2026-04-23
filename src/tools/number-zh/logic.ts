const DIGITS = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖']
const UNIT4 = ['', '拾', '佰', '仟']
const SECTION_UNITS = ['', '万', '亿', '万亿']

function section4ToZh(n: number): string {
  if (n === 0) return ''
  const s = String(n).padStart(4, '0')
  let result = ''
  for (let i = 0; i < 4; i++) {
    const d = parseInt(s[i])
    if (d !== 0) {
      result += DIGITS[d] + UNIT4[3 - i]
    } else if (result && !result.endsWith('零')) {
      result += '零'
    }
  }
  return result.endsWith('零') ? result.slice(0, -1) : result
}

function intToZh(intStr: string): string {
  const num = intStr.replace(/^0+/, '') || '0'
  if (num === '0') return '零'

  const sections: number[] = []
  for (let i = num.length; i > 0; i -= 4) {
    sections.unshift(parseInt(num.slice(Math.max(0, i - 4), i)))
  }

  let result = ''
  for (let i = 0; i < sections.length; i++) {
    const sec = sections[i]
    const unit = SECTION_UNITS[sections.length - 1 - i]
    if (sec === 0) {
      if (result && !result.endsWith('零')) result += '零'
    } else {
      if (result && sec < 1000 && !result.endsWith('零')) result += '零'
      result += section4ToZh(sec) + unit
    }
  }
  // remove trailing zero from empty trailing sections
  while (result.endsWith('零')) result = result.slice(0, -1)
  return result
}

export function numberToZh(input: string): string {
  const trimmed = input.trim()
  if (!trimmed) throw new Error('请输入数字')

  const negative = trimmed.startsWith('-')
  const absStr = negative ? trimmed.slice(1) : trimmed

  if (!/^\d+(\.\d{0,2})?$/.test(absStr)) throw new Error('请输入有效数字（最多两位小数）')

  const dotIdx = absStr.indexOf('.')
  const intStr = dotIdx >= 0 ? absStr.slice(0, dotIdx) : absStr
  const decStr = dotIdx >= 0 ? absStr.slice(dotIdx + 1) : ''

  const jiao = decStr.length >= 1 ? parseInt(decStr[0]) : 0
  const fen = decStr.length >= 2 ? parseInt(decStr[1]) : 0

  const isZeroInt = intStr === '0'
  let result = isZeroInt ? '零元' : intToZh(intStr) + '元'

  if (jiao > 0) {
    result += DIGITS[jiao] + '角'
    if (fen > 0) result += DIGITS[fen] + '分'
  } else if (fen > 0) {
    result += '零' + DIGITS[fen] + '分'
  } else {
    result += '整'
  }

  return negative ? '负' + result : result
}
