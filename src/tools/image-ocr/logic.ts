export const OCR_LANGS = 'chi_sim+eng'

// 高精度浮点模型，中文识别质量明显优于默认整数模型
export const BEST_LANG_PATH = 'https://tessdata.projectnaptha.com/4.0.0_best'

const CJK = '\\u4e00-\\u9fff\\u3400-\\u4dbf\\u3000-\\u303f\\uff00-\\uffef'

// 清洗 OCR 原始输出：去掉中文字符间被误插的空格、行尾空白、多余空行
export function cleanOcrText(raw: string): string {
  return raw
    .replace(new RegExp(`(?<=[${CJK}]) +(?=[${CJK}])`, 'g'), '')
    .replace(/[ \t]+$/gm, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

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
