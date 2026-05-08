export type Options = {
  rootTag: string      // 根元素标签名
  indent: number       // 缩进空格数（0 = 压缩）
  declaration: boolean // 是否输出 <?xml ... ?> 声明
  arraySuffix: string  // 数组子元素后缀（"item" → <itemsItem>）
}

export const defaultOptions: Options = {
  rootTag: 'root',
  indent: 2,
  declaration: true,
  arraySuffix: 'item',
}

/** XML 特殊字符转义 */
function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

/** 将字符串变为合法 XML 标签名（不能以数字开头，无空格） */
function toTagName(s: string): string {
  const clean = s.replace(/[^a-zA-Z0-9_.-]/g, '_')
  return /^[^a-zA-Z_]/.test(clean) ? `_${clean}` : clean || 'item'
}

function serialize(
  value: unknown,
  tag: string,
  depth: number,
  opts: Options,
): string {
  const pad = ' '.repeat(opts.indent * depth)
  const safetag = toTagName(tag)

  if (value === null || value === undefined) {
    return `${pad}<${safetag} />`
  }

  const t = typeof value
  if (t === 'string' || t === 'number' || t === 'boolean') {
    return `${pad}<${safetag}>${escapeXml(String(value))}</${safetag}>`
  }

  if (Array.isArray(value)) {
    // 数组：每个元素用 <tag> 包裹（不额外加 wrapper）
    if (value.length === 0) {
      return `${pad}<${safetag} />`
    }
    return value
      .map(item => serialize(item, safetag, depth, opts))
      .join(opts.indent > 0 ? '\n' : '')
  }

  if (t === 'object') {
    const entries = Object.entries(value as Record<string, unknown>)
    if (entries.length === 0) {
      return `${pad}<${safetag} />`
    }
    const childPad = ' '.repeat(opts.indent * (depth + 1))
    const nl = opts.indent > 0 ? '\n' : ''
    const children = entries
      .map(([key, val]) => {
        if (Array.isArray(val)) {
          // 数组：用 <key> 包一层，每个元素再用 <arraySuffix> 包
          const items = val.length === 0
            ? `${childPad}<${toTagName(key)} />`
            : val.map(item =>
                serialize(item, opts.arraySuffix, depth + 2, opts)
              ).join(nl)
          return opts.indent > 0
            ? `${childPad}<${toTagName(key)}>${nl}${items}${nl}${childPad}</${toTagName(key)}>`
            : `<${toTagName(key)}>${items}</${toTagName(key)}>`
        }
        return serialize(val, key, depth + 1, opts)
      })
      .join(nl)

    return opts.indent > 0
      ? `${pad}<${safetag}>${nl}${children}${nl}${pad}</${safetag}>`
      : `<${safetag}>${children}</${safetag}>`
  }

  return `${pad}<${safetag}>${escapeXml(String(value))}</${safetag}>`
}

export type ConvertResult = {
  output: string
  error: string
}

export function jsonToXml(input: string, opts: Options = defaultOptions): ConvertResult {
  if (!input.trim()) return { output: '', error: '' }

  let parsed: unknown
  try {
    parsed = JSON.parse(input)
  } catch (e) {
    return { output: '', error: `JSON 解析失败：${e instanceof Error ? e.message : '格式错误'}` }
  }

  const body = serialize(parsed, opts.rootTag, 0, opts)
  const decl = opts.declaration ? '<?xml version="1.0" encoding="UTF-8"?>\n' : ''
  return { output: decl + body, error: '' }
}
