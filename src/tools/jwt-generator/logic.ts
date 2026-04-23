import CryptoJS from 'crypto-js'

export type Algorithm = 'HS256' | 'HS384' | 'HS512'

function base64UrlEncode(str: string): string {
  const bytes = new TextEncoder().encode(str)
  let binary = ''
  for (const byte of bytes) binary += String.fromCharCode(byte)
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}

function hmacSign(data: string, secret: string, alg: Algorithm): string {
  let hash: CryptoJS.lib.WordArray
  if (alg === 'HS256') hash = CryptoJS.HmacSHA256(data, secret)
  else if (alg === 'HS384') hash = CryptoJS.HmacSHA384(data, secret)
  else hash = CryptoJS.HmacSHA512(data, secret)
  return CryptoJS.enc.Base64.stringify(hash)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')
}

export function generateJWT(payloadJson: string, secret: string, alg: Algorithm = 'HS256'): string {
  JSON.parse(payloadJson) // validate
  const header = base64UrlEncode(JSON.stringify({ alg, typ: 'JWT' }))
  const payload = base64UrlEncode(payloadJson)
  const signature = hmacSign(`${header}.${payload}`, secret, alg)
  return `${header}.${payload}.${signature}`
}

export const DEFAULT_PAYLOAD = JSON.stringify(
  { sub: '1234567890', name: 'John Doe', iat: 1516239022 },
  null, 2
)
