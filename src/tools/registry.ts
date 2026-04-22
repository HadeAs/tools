import {
  Code2, Key, Link, Regex, Clock,
  Eye, AlignLeft, FileText, CaseSensitive,
  Lock, Hash as HashIcon, QrCode, Palette,
  Fingerprint, Binary, CalendarClock,
  ShieldCheck, FileCode, Table, Image, Ruler, Type,
  ArrowLeftRight, Globe, List, Server, Scale,
} from 'lucide-react'
import type { ComponentType } from 'react'

export type ToolCategory = 'developer' | 'text' | 'encoding' | 'conversion'

export type ToolMeta = {
  slug: string
  name: string
  description: string
  category: ToolCategory
  icon: ComponentType<{ className?: string }>
}

export const tools: ToolMeta[] = [
  { slug: 'json-formatter', name: 'JSON 格式化', description: '格式化、压缩和验证 JSON', category: 'developer', icon: Code2 },
  { slug: 'base64', name: 'Base64', description: 'Base64 字符串编码与解码', category: 'developer', icon: Key },
  { slug: 'url-encoder', name: 'URL 编码器', description: 'URL 组件编码与解码', category: 'developer', icon: Link },
  { slug: 'regex-tester', name: '正则测试器', description: '测试正则表达式并高亮匹配结果', category: 'developer', icon: Regex },
  { slug: 'timestamp', name: '时间戳转换', description: 'Unix 时间戳与可读日期互转', category: 'developer', icon: Clock },
  { slug: 'markdown-preview', name: 'Markdown 预览', description: '实时预览 Markdown 渲染效果', category: 'text', icon: Eye },
  { slug: 'word-counter', name: '字数统计', description: '统计单词、字符和行数', category: 'text', icon: AlignLeft },
  { slug: 'text-diff', name: '文本对比', description: '对比两段文本并高亮差异', category: 'text', icon: FileText },
  { slug: 'case-converter', name: '大小写转换', description: '在 camelCase、snake_case、PascalCase 等命名风格间转换', category: 'text', icon: CaseSensitive },
  { slug: 'hash-generator', name: '哈希生成器', description: '生成 MD5、SHA-1 和 SHA-256 哈希值', category: 'encoding', icon: Lock },
  { slug: 'jwt-decoder', name: 'JWT 解析器', description: '解析并查看 JWT Token 内容', category: 'encoding', icon: HashIcon },
  { slug: 'qr-generator', name: '二维码生成器', description: '将文本或 URL 生成二维码', category: 'encoding', icon: QrCode },
  { slug: 'color-converter', name: '颜色转换器', description: '在 HEX、RGB 和 HSL 格式之间转换颜色', category: 'conversion', icon: Palette },
  { slug: 'uuid-generator', name: 'UUID 生成器', description: '生成 UUID v4 随机标识符', category: 'developer', icon: Fingerprint },
  { slug: 'number-base', name: '进制转换', description: '在二进制、八进制、十进制、十六进制之间转换', category: 'conversion', icon: Binary },
  { slug: 'cron-parser',        name: 'Cron 解析器',    description: '解析 Cron 表达式并显示下次执行时间',  category: 'developer',  icon: CalendarClock },
  { slug: 'password-generator', name: '密码生成器',     description: '生成安全随机密码，可配置长度与字符类型', category: 'developer',  icon: ShieldCheck },
  { slug: 'html-entities',      name: 'HTML 实体编码',  description: 'HTML 特殊字符编码与解码',              category: 'encoding',   icon: FileCode },
  { slug: 'json-csv',           name: 'JSON / CSV 转换', description: 'JSON 数组与 CSV 格式互转',            category: 'conversion', icon: Table },
  { slug: 'image-base64',       name: '图片转 Base64',  description: '上传图片并输出 Base64 Data URL',       category: 'encoding',   icon: Image },
  { slug: 'css-units',          name: 'CSS 单位换算',   description: 'px / rem / em / vw / vh / pt 互转',   category: 'conversion', icon: Ruler },
  { slug: 'lorem-ipsum',        name: 'Lorem Ipsum',    description: '生成中英文占位文本，支持单词/句子/段落', category: 'text',       icon: Type },
  { slug: 'yaml-json',          name: 'YAML / JSON 转换', description: 'YAML 与 JSON 格式互转',               category: 'conversion', icon: ArrowLeftRight },
  { slug: 'url-parser',         name: 'URL 解析器',      description: '解析 URL 各组成部分及查询参数',         category: 'developer',  icon: Globe },
  { slug: 'line-tools',         name: '行操作工具',      description: '排序、去重、删除空行、反转、打乱行',     category: 'text',       icon: List },
  { slug: 'http-status',        name: 'HTTP 状态码',     description: '查询 HTTP 状态码含义与说明',            category: 'developer',  icon: Server },
  { slug: 'unit-converter',     name: '单位换算',        description: '长度、重量、温度、数据存储单位互转',     category: 'conversion', icon: Scale },
]

export function getToolBySlug(slug: string): ToolMeta | undefined {
  return tools.find(t => t.slug === slug)
}

export function getToolsByCategory(category: ToolCategory): ToolMeta[] {
  return tools.filter(t => t.category === category)
}

export function getRelatedTools(currentSlug: string, count = 4): ToolMeta[] {
  const current = getToolBySlug(currentSlug)
  if (!current) return []
  const sameCategory = tools.filter(t => t.slug !== currentSlug && t.category === current.category)
  const result = sameCategory.slice(0, count)
  if (result.length < 2) {
    const others = tools.filter(t => t.slug !== currentSlug && t.category !== current.category)
    result.push(...others.slice(0, count - result.length))
  }
  return result.slice(0, count)
}

export const categoryLabels: Record<ToolCategory, string> = {
  developer: '开发者工具',
  text: '文本处理',
  encoding: '编码与加密',
  conversion: '转换工具',
}
