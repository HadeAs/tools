import {
  Code2, Key, Link, Regex, Clock,
  Eye, AlignLeft, FileText, CaseSensitive,
  Lock, Hash as HashIcon, QrCode, Palette,
  Fingerprint, Binary, CalendarClock,
  ShieldCheck, FileCode, Table, Image, Ruler, Type,
  ArrowLeftRight, Globe, List, Server, Scale,
  CalendarDays, CalendarPlus, Cake,
  Columns2, KeyRound, ShieldAlert, Globe2, Paintbrush, Database,
  Square, Scissors, RotateCw, Languages, Repeat, Banknote, Frame,
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
  { slug: 'date-diff',          name: '日期差计算',      description: '计算两个日期之间的精确差值',             category: 'developer',  icon: CalendarDays },
  { slug: 'date-add',           name: '日期加减',        description: '在日期上加减年/月/周/天/小时/分钟/秒',   category: 'developer',  icon: CalendarPlus },
  { slug: 'age-calculator',     name: '年龄计算器',      description: '根据出生日期计算精确年龄与下次生日',     category: 'developer',  icon: Cake },
  { slug: 'json-diff',          name: 'JSON 对比',       description: '对比两段 JSON 并高亮差异',               category: 'developer',  icon: Columns2 },
  { slug: 'jwt-generator',      name: 'JWT 生成器',      description: '使用 HS256/384/512 生成 JWT Token',      category: 'encoding',   icon: KeyRound },
  { slug: 'aes-crypto',         name: 'AES 加解密',      description: '客户端 AES 对称加密与解密',              category: 'encoding',   icon: ShieldAlert },
  { slug: 'timezone',           name: '时区转换',        description: '全球主要时区时间对照转换',               category: 'developer',  icon: Globe2 },
  { slug: 'gradient-generator', name: '渐变生成器',      description: '可视化生成 CSS 线性/径向/锥形渐变',      category: 'conversion', icon: Paintbrush },
  { slug: 'sql-formatter',      name: 'SQL 格式化',      description: '格式化 SQL 语句，支持多种数据库方言',    category: 'developer',  icon: Database },
  { slug: 'box-shadow',         name: 'Box Shadow 生成器', description: '可视化生成 CSS box-shadow，支持多层叠加',  category: 'conversion', icon: Square },
  { slug: 'border-radius',      name: 'Border Radius 生成器', description: '可视化调整四角圆角，实时预览',          category: 'conversion', icon: Frame },
  { slug: 'clip-path',          name: 'Clip-Path 生成器', description: '圆形/椭圆/多边形裁剪路径生成',            category: 'conversion', icon: Scissors },
  { slug: 'css-transform',      name: 'CSS Transform',   description: '可视化调整位移/旋转/缩放/倾斜，实时预览',  category: 'conversion', icon: RotateCw },
  { slug: 'pinyin',             name: '汉字转拼音',      description: '汉字转拼音，支持声调符号/数字/无声调',     category: 'text',       icon: Languages },
  { slug: 'simp-trad',          name: '简繁转换',        description: '简体中文与繁體中文互相转换',               category: 'text',       icon: Repeat },
  { slug: 'number-zh',          name: '数字转中文大写',  description: '阿拉伯数字转人民币中文大写',               category: 'conversion', icon: Banknote },
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
