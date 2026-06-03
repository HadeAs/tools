export const OCR_LANGS = 'chi_sim+eng'

const MAX_SIZE = 10 * 1024 * 1024 // 10MB

export function validateImageFile(file: File): string | null {
  if (!file.type.startsWith('image/')) return '请选择图片文件'
  if (file.size > MAX_SIZE) return '图片过大，请控制在 10MB 以内'
  return null
}

export function formatConfidence(confidence: number): string {
  const clamped = Math.max(0, Math.min(100, confidence))
  return `${Math.round(clamped)}%`
}

export function formatProgress(progress: number): number {
  return Math.round(Math.max(0, Math.min(1, progress)) * 100)
}
