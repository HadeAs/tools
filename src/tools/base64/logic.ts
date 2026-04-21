export function encode(input: string): string {
  return btoa(unescape(encodeURIComponent(input)))
}

export function decode(input: string): string {
  try { return decodeURIComponent(escape(atob(input))) }
  catch { throw new Error('Invalid Base64 string') }
}
