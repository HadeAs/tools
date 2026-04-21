export type RegexResult = {
  matches: string[]
  indices: number[]
  error?: string
}

export function testRegex(pattern: string, input: string, flags: string): RegexResult {
  try {
    const globalFlags = flags.includes('g') ? flags : flags + 'g'
    const regex = new RegExp(pattern, globalFlags)
    const matches: string[] = []
    const indices: number[] = []
    let m: RegExpExecArray | null
    while ((m = regex.exec(input)) !== null) {
      matches.push(m[0])
      indices.push(m.index)
    }
    return { matches, indices }
  } catch (e) {
    return { matches: [], indices: [], error: (e as Error).message }
  }
}
