import * as Diff from 'diff'

export function normalizeJson(input: string): string {
  return JSON.stringify(JSON.parse(input), null, 2)
}

export type DiffLine = {
  value: string
  type: 'added' | 'removed' | 'unchanged'
}

export function diffJson(left: string, right: string): DiffLine[] {
  const a = normalizeJson(left)
  const b = normalizeJson(right)
  const changes = Diff.diffLines(a, b)
  const result: DiffLine[] = []
  for (const change of changes) {
    const lines = change.value.split('\n').filter((_, i, arr) => i < arr.length - 1 || change.value.endsWith('\n') ? true : change.value !== '')
    const type = change.added ? 'added' : change.removed ? 'removed' : 'unchanged'
    for (const line of lines) {
      if (line !== undefined) result.push({ value: line, type })
    }
  }
  return result
}

export function isSame(left: string, right: string): boolean {
  return normalizeJson(left) === normalizeJson(right)
}
