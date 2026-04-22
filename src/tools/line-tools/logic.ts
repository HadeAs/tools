export type LineOp = 'sort-asc' | 'sort-desc' | 'dedupe' | 'remove-empty' | 'reverse' | 'shuffle' | 'trim'

export function processLines(input: string, op: LineOp): string {
  const lines = input.split('\n')
  switch (op) {
    case 'sort-asc':      return [...lines].sort((a, b) => a.localeCompare(b, 'zh-CN')).join('\n')
    case 'sort-desc':     return [...lines].sort((a, b) => b.localeCompare(a, 'zh-CN')).join('\n')
    case 'dedupe':        return [...new Set(lines)].join('\n')
    case 'remove-empty':  return lines.filter(l => l.trim() !== '').join('\n')
    case 'reverse':       return [...lines].reverse().join('\n')
    case 'trim':          return lines.map(l => l.trim()).join('\n')
    case 'shuffle': {
      const arr = [...lines]
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]]
      }
      return arr.join('\n')
    }
  }
}
