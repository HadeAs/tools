export type TextStats = {
  words: number
  chars: number
  charsNoSpaces: number
  lines: number
  sentences: number
}

export function countStats(text: string): TextStats {
  return {
    words: text.trim() ? text.trim().split(/\s+/).length : 0,
    chars: text.length,
    charsNoSpaces: text.replace(/\s/g, '').length,
    lines: text.split('\n').length,
    sentences: text.trim() ? text.split(/[.!?]+/).filter(s => s.trim()).length : 0,
  }
}
