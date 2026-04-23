import CryptoJS from 'crypto-js'

export type AesMode = 'encrypt' | 'decrypt'

export function aesEncrypt(text: string, key: string): string {
  if (!text || !key) return ''
  return CryptoJS.AES.encrypt(text, key).toString()
}

export function aesDecrypt(ciphertext: string, key: string): string {
  if (!ciphertext || !key) return ''
  const bytes = CryptoJS.AES.decrypt(ciphertext, key)
  const result = bytes.toString(CryptoJS.enc.Utf8)
  if (!result) throw new Error('解密失败，请检查密钥或密文是否正确')
  return result
}
