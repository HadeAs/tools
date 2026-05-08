export type Options = {
  rootName: string        // 根接口名称
  useInterface: boolean   // true = interface，false = type
  addExport: boolean      // 是否添加 export
  optionalFields: boolean // 字段是否可选（加 ?）
}

export const defaultOptions: Options = {
  rootName: 'Root',
  useInterface: true,
  addExport: true,
  optionalFields: false,
}

/** 将任意字符串转为合法的 PascalCase 标识符 */
function toPascalCase(s: string): string {
  return s
    .replace(/[^a-zA-Z0-9_$]/g, '_')
    .replace(/(?:^|_)(\w)/g, (_, c: string) => c.toUpperCase())
    || 'Unknown'
}

/** 推断单个值的类型字符串，遇到嵌套 object 时递归生成 interface 并记录到 defs */
function inferType(
  value: unknown,
  name: string,
  defs: Map<string, string>,
  opts: Options,
): string {
  if (value === null) return 'null'
  if (value === undefined) return 'undefined'

  const t = typeof value
  if (t === 'string') return 'string'
  if (t === 'number') return 'number'
  if (t === 'boolean') return 'boolean'

  if (Array.isArray(value)) {
    if (value.length === 0) return 'unknown[]'
    const childName = name.endsWith('s')
      ? name.slice(0, -1)  // items → item
      : name + 'Item'
    const types = [...new Set(value.map(item => inferType(item, childName, defs, opts)))]
    const inner = types.length === 1 ? types[0] : `(${types.join(' | ')})`
    return `${inner}[]`
  }

  if (t === 'object') {
    const interfaceName = toPascalCase(name)
    // 避免重复定义：如果已存在同名 interface 但内容不同，则加数字后缀
    const fields = Object.entries(value as Record<string, unknown>)
      .map(([key, val]) => {
        const safeName = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key) ? key : JSON.stringify(key)
        const fieldType = inferType(val, key, defs, opts)
        const opt = opts.optionalFields ? '?' : ''
        return `  ${safeName}${opt}: ${fieldType};`
      })
      .join('\n')

    const exportKw = opts.addExport ? 'export ' : ''
    const body = `{\n${fields}\n}`
    const decl = opts.useInterface
      ? `${exportKw}interface ${interfaceName} ${body}`
      : `${exportKw}type ${interfaceName} = ${body}`

    // 若名称已被占用，检查是否相同内容，相同则复用
    if (!defs.has(interfaceName)) {
      defs.set(interfaceName, decl)
    }
    return interfaceName
  }

  return 'unknown'
}

export type ConvertResult = {
  output: string
  error: string
}

export function jsonToTs(input: string, opts: Options = defaultOptions): ConvertResult {
  if (!input.trim()) return { output: '', error: '' }

  let parsed: unknown
  try {
    parsed = JSON.parse(input)
  } catch (e) {
    return { output: '', error: `JSON 解析失败：${e instanceof Error ? e.message : '格式错误'}` }
  }

  const defs = new Map<string, string>()
  const rootType = inferType(parsed, opts.rootName, defs, opts)

  // 如果根类型不是一个接口名（即是基础类型或数组），额外生成一个 Root type alias
  let output: string
  if (defs.has(rootType)) {
    // 根类型是接口——接口们已在 defs 里
    const allDefs = [...defs.values()]
    output = allDefs.join('\n\n')
  } else {
    // 根类型是原始类型或数组
    const exportKw = opts.addExport ? 'export ' : ''
    const rootAlias = opts.useInterface
      ? `${exportKw}type ${opts.rootName} = ${rootType}`
      : `${exportKw}type ${opts.rootName} = ${rootType}`
    const allDefs = [...defs.values(), rootAlias]
    output = allDefs.join('\n\n')
  }

  return { output, error: '' }
}
