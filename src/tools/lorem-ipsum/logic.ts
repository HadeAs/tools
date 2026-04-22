const WORDS = 'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi aliquip commodo consequat duis aute irure reprehenderit voluptate velit esse cillum fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt culpa qui officia deserunt mollit anim id est laborum'.split(' ')

const ZH_WORDS = '的一是在不了有和人这中大为上个国我以要他时来用们生到作地于出就分对成会可主发年动同工也能下过子说产种面而方后多定行学法所民得经十三之进着等部度家电力里如水化高自二理起小物现实加量都两体制机当使点从业本去把性好应开它合还因由其些然前外天政四日那社义事平形相全表间样与关各重新线内数正心力理明景物若景美'.split('')

function pick<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)] }

function sentence(words: string[]): string {
  const len = 6 + Math.floor(Math.random() * 10)
  const ws = Array.from({ length: len }, () => pick(words))
  const s = ws.join(' ')
  return s.charAt(0).toUpperCase() + s.slice(1) + '.'
}

function zhSentence(): string {
  const len = 15 + Math.floor(Math.random() * 20)
  return Array.from({ length: len }, () => pick(ZH_WORDS)).join('') + '。'
}

function paragraph(lang: 'en' | 'zh'): string {
  const count = 3 + Math.floor(Math.random() * 4)
  return Array.from({ length: count }, () => lang === 'zh' ? zhSentence() : sentence(WORDS)).join(' ')
}

export function generate(type: 'words' | 'sentences' | 'paragraphs', count: number, lang: 'en' | 'zh'): string {
  if (type === 'words') {
    const words = lang === 'zh'
      ? Array.from({ length: count }, () => pick(ZH_WORDS))
      : Array.from({ length: count }, () => pick(WORDS))
    return lang === 'zh' ? words.join('') : words.join(' ')
  }
  if (type === 'sentences') {
    return Array.from({ length: count }, () => lang === 'zh' ? zhSentence() : sentence(WORDS)).join(' ')
  }
  return Array.from({ length: count }, () => paragraph(lang)).join('\n\n')
}
