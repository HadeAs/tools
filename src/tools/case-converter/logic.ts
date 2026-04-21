function words(input: string): string[] {
  return input
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[_\-\s]+/g, ' ')
    .trim().split(' ').filter(Boolean)
}

export const toCamel = (s: string) => words(s).map((w, i) => i === 0 ? w.toLowerCase() : w[0].toUpperCase() + w.slice(1).toLowerCase()).join('')
export const toPascal = (s: string) => words(s).map(w => w[0].toUpperCase() + w.slice(1).toLowerCase()).join('')
export const toSnake = (s: string) => words(s).map(w => w.toLowerCase()).join('_')
export const toKebab = (s: string) => words(s).map(w => w.toLowerCase()).join('-')
export const toUpper = (s: string) => words(s).map(w => w.toUpperCase()).join('_')
export const toLower = (s: string) => words(s).map(w => w.toLowerCase()).join(' ')
