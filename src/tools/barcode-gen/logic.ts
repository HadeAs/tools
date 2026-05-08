export type BarcodeFormat =
  | 'CODE128'
  | 'CODE39'
  | 'EAN13'
  | 'EAN8'
  | 'UPC'
  | 'ITF14'
  | 'MSI'
  | 'pharmacode'

export type Options = {
  format: BarcodeFormat
  lineColor: string
  background: string
  width: number       // 条码宽度倍率 1-4
  height: number      // 条码高度 px
  displayValue: boolean
  fontSize: number
  margin: number
}

export const defaultOptions: Options = {
  format: 'CODE128',
  lineColor: '#000000',
  background: '#ffffff',
  width: 2,
  height: 80,
  displayValue: true,
  fontSize: 14,
  margin: 10,
}

export const FORMAT_LIST: { value: BarcodeFormat; label: string; placeholder: string; hint: string }[] = [
  { value: 'CODE128',    label: 'Code 128',   placeholder: 'Hello, World!',  hint: '支持 ASCII 全字符集，通用格式' },
  { value: 'CODE39',     label: 'Code 39',    placeholder: 'HELLO WORLD',    hint: '大写字母、数字和部分符号' },
  { value: 'EAN13',      label: 'EAN-13',     placeholder: '5901234123457',  hint: '13 位数字（含校验位），商品条码' },
  { value: 'EAN8',       label: 'EAN-8',      placeholder: '96385074',       hint: '8 位数字（含校验位），小商品条码' },
  { value: 'UPC',        label: 'UPC-A',      placeholder: '012345678905',   hint: '12 位数字，北美零售标准' },
  { value: 'ITF14',      label: 'ITF-14',     placeholder: '10012345678902', hint: '14 位数字，物流箱码' },
  { value: 'MSI',        label: 'MSI',        placeholder: '12345678',       hint: '数字，用于仓储货架标签' },
  { value: 'pharmacode', label: 'Pharmacode', placeholder: '1234',           hint: '3–131583 整数，制药行业' },
]

/** 验证条码内容（客户端快速校验，实际校验由 JsBarcode 完成） */
export function validateInput(value: string, format: BarcodeFormat): string {
  if (!value.trim()) return '请输入条码内容'
  switch (format) {
    case 'EAN13':
      if (!/^\d{12,13}$/.test(value)) return 'EAN-13 需要 12 或 13 位数字'
      break
    case 'EAN8':
      if (!/^\d{7,8}$/.test(value)) return 'EAN-8 需要 7 或 8 位数字'
      break
    case 'UPC':
      if (!/^\d{11,12}$/.test(value)) return 'UPC-A 需要 11 或 12 位数字'
      break
    case 'ITF14':
      if (!/^\d{13,14}$/.test(value)) return 'ITF-14 需要 13 或 14 位数字'
      break
    case 'MSI':
      if (!/^\d+$/.test(value)) return 'MSI 只支持数字'
      break
    case 'pharmacode':
      if (!/^\d+$/.test(value)) return 'Pharmacode 只支持数字'
      if (parseInt(value) < 3 || parseInt(value) > 131583) return 'Pharmacode 范围：3–131583'
      break
  }
  return ''
}
