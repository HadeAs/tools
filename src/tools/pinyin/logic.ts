import { pinyin } from 'pinyin-pro'

export type ToneType = 'symbol' | 'num' | 'none'

export function convertToPinyin(text: string, toneType: ToneType): string {
  if (!text.trim()) return ''
  return pinyin(text, { toneType })
}

export function convertToArray(text: string, toneType: ToneType): string[] {
  if (!text.trim()) return []
  return pinyin(text, { toneType, type: 'array' })
}
