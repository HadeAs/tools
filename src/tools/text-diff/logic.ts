import { diffWords } from 'diff'

export type DiffPart = { type: 'equal' | 'added' | 'removed'; value: string }

export function computeDiff(original: string, modified: string): DiffPart[] {
  return diffWords(original, modified).map(part => ({
    type: part.added ? 'added' : part.removed ? 'removed' : 'equal',
    value: part.value,
  }))
}
