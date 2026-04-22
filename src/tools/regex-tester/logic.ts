export type RegexResult = {
  matches: string[]
  groups: (string | undefined)[][]
  indices: number[]
  error?: string
}

export function testRegex(pattern: string, input: string, flags: string): RegexResult {
  try {
    const globalFlags = flags.includes('g') ? flags : flags + 'g'
    const regex = new RegExp(pattern, globalFlags)
    const matches: string[] = []
    const groups: (string | undefined)[][] = []
    const indices: number[] = []
    let m: RegExpExecArray | null
    while ((m = regex.exec(input)) !== null) {
      matches.push(m[0])
      indices.push(m.index)
      groups.push(Array.from(m).slice(1) as (string | undefined)[])
    }
    return { matches, groups, indices }
  } catch (e) {
    return { matches: [], groups: [], indices: [], error: (e as Error).message }
  }
}

export function replaceRegex(pattern: string, input: string, flags: string, replacement: string): string {
  const regex = new RegExp(pattern, flags)
  return input.replace(regex, replacement)
}
