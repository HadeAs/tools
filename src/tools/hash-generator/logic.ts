import CryptoJS from 'crypto-js'

export function md5Hash(input: string): string {
  return CryptoJS.MD5(input).toString()
}

export function sha1Hash(input: string): string {
  return CryptoJS.SHA1(input).toString()
}

export async function sha256Hash(input: string): Promise<string> {
  const encoded = new TextEncoder().encode(input)
  const buffer = await crypto.subtle.digest('SHA-256', encoded)
  return Array.from(new Uint8Array(buffer)).map(b => b.toString(16).padStart(2, '0')).join('')
}
