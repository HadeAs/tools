export type Options = {
  rootName: string       // 根 schema 变量名（不含 Schema 后缀）
  addExport: boolean     // 是否导出
  optionalFields: boolean // 所有字段加 .optional()
  inferInt: boolean      // 整数推断为 z.number().int()
}

export const defaultOptions: Options = {
  rootName: 'root',
  addExport: true,
  optionalFields: false,
  inferInt: true,
}

/** 首字母小写的 camelCase */
function toCamelCase(s: string): string {
  const pascal = s
    .replace(/[^a-zA-Z0-9_$]/g, '_')
    .replace(/(?:^|_)(\w)/g, (_, c: string) => c.toUpperCase())
  return pascal.charAt(0).toLowerCase() + pascal.slice(1)
}

/** 推断单个值的 zod 表达式，遇到对象时递归注册 schema */
function inferZod(
  value: unknown,
  name: string,
  schemas: Map<string, string>,
  opts: Options,
): string {
  if (value === null) return 'z.null()'
  if (value === undefined) return 'z.undefined()'

  const t = typeof value
  if (t === 'string') return 'z.string()'
  if (t === 'number') return (opts.inferInt && Number.isInteger(value)) ? 'z.number().int()' : 'z.number()'
  if (t === 'boolean') return 'z.boolean()'

  if (Array.isArray(value)) {
    if (value.length === 0) return 'z.array(z.unknown())'
    const childName = name.endsWith('s') ? name.slice(0, -1) : name + 'Item'
    const types = [...new Set(value.map(item => inferZod(item, childName, schemas, opts)))]
    const inner = types.length === 1
      ? types[0]
      : `z.union([${types.join(', ')}])`
    return `z.array(${inner})`
  }

  if (t === 'object') {
    const varName = toCamelCase(name) + 'Schema'
    const fields = Object.entries(value as Record<string, unknown>)
      .map(([key, val]) => {
        const safeName = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key) ? key : JSON.stringify(key)
        const fieldSchema = inferZod(val, key, schemas, opts)
        const opt = opts.optionalFields ? '.optional()' : ''
        return `  ${safeName}: ${fieldSchema}${opt},`
      })
      .join('\n')

    const exportKw = opts.addExport ? 'export ' : ''
    const decl = `${exportKw}const ${varName} = z.object({\n${fields}\n})`

    if (!schemas.has(varName)) {
      schemas.set(varName, decl)
    }
    return varName
  }

  return 'z.unknown()'
}

export type ConvertResult = {
  output: string
  error: string
}

export function jsonToZod(input: string, opts: Options = defaultOptions): ConvertResult {
  if (!input.trim()) return { output: '', error: '' }

  let parsed: unknown
  try {
    parsed = JSON.parse(input)
  } catch (e) {
    return { output: '', error: `JSON 解析失败：${e instanceof Error ? e.message : '格式错误'}` }
  }

  const schemas = new Map<string, string>()
  const rootVarName = toCamelCase(opts.rootName) + 'Schema'
  const rootExpr = inferZod(parsed, opts.rootName, schemas, opts)

  const exportKw = opts.addExport ? 'export ' : ''

  let lines: string[]

  if (schemas.has(rootVarName)) {
    // 根类型是对象，schemas 里已有定义，直接输出所有 schemas
    lines = [...schemas.values()]
  } else {
    // 根类型是原始值或数组
    lines = [
      ...[...schemas.values()],
      `${exportKw}const ${rootVarName} = ${rootExpr}`,
    ]
  }

  // 顶部加 import 提示
  const header = `import { z } from 'zod'`
  const output = [header, '', ...lines].join('\n')

  return { output, error: '' }
}

/** 生成对应 TypeScript 类型的推断语句（infer） */
export function inferTypeLine(rootName: string, addExport: boolean): string {
  const varName = toCamelCase(rootName) + 'Schema'
  const typeName = rootName.charAt(0).toUpperCase() + rootName.slice(1)
  const exportKw = addExport ? 'export ' : ''
  return `${exportKw}type ${typeName} = z.infer<typeof ${varName}>`
}
