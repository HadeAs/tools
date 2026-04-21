export type TextStats = {
  words: number
  chars: number
  charsNoSpaces: number
  lines: number
  sentences: number
  chineseChars: number
}

export function countStats(text: string): TextStats {
  const chineseChars = (text.match(/[一-龥]/g) || []).length
  const latinWords = text.trim() ? text.trim().split(/\s+/).filter(w => /[a-zA-Z0-9]/.test(w)).length : 0
  return {
    words: latinWords,
    chars: text.length,
    charsNoSpaces: text.replace(/\s/g, '').length,
    lines: text ? text.split('\n').length : 0,
    sentences: text.trim() ? text.split(/[.!?。！？]+/).filter(s => s.trim()).length : 0,
    chineseChars,
  }
}
