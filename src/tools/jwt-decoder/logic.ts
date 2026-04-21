export interface JWTDecoded {
  header: Record<string, unknown>
  payload: Record<string, unknown>
  signature: string
}

function base64UrlDecode(str: string): string {
  const padded = str.replace(/-/g, '+').replace(/_/g, '/').padEnd(str.length + (4 - str.length % 4) % 4, '=')
  return atob(padded)
}

export function decodeJWT(token: string): JWTDecoded {
  const parts = token.split('.')
  if (parts.length !== 3) throw new Error('Invalid JWT: must have 3 parts')
  try {
    return {
      header: JSON.parse(base64UrlDecode(parts[0])),
      payload: JSON.parse(base64UrlDecode(parts[1])),
      signature: parts[2],
    }
  } catch {
    throw new Error('Invalid JWT: could not decode')
  }
}
