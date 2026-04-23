import { Converter } from 'opencc-js'

export type ConvDirection = 'cn-to-tw' | 'tw-to-cn'

let cnToTw: ((s: string) => string) | null = null
let twToCn: ((s: string) => string) | null = null

function getCnToTw() {
  if (!cnToTw) cnToTw = Converter({ from: 'cn', to: 'tw' })
  return cnToTw
}

function getTwToCn() {
  if (!twToCn) twToCn = Converter({ from: 'tw', to: 'cn' })
  return twToCn
}

export function convert(text: string, direction: ConvDirection): string {
  if (!text.trim()) return ''
  return direction === 'cn-to-tw' ? getCnToTw()(text) : getTwToCn()(text)
}
