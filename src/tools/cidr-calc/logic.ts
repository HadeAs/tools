export type CIDRInfo = {
  // 输入
  ip: string
  prefix: number
  // 地址信息
  networkAddress: string
  broadcastAddress: string
  firstHost: string
  lastHost: string
  subnetMask: string
  wildcardMask: string
  // 统计
  totalHosts: number
  usableHosts: number
  // 类别
  ipClass: string
  isPrivate: boolean
  // 二进制展示
  ipBinary: string
  maskBinary: string
}

export type ParseResult =
  | { ok: true; info: CIDRInfo }
  | { ok: false; error: string }

/** 将点分十进制 IP 转为 32 位无符号整数 */
function ipToNum(ip: string): number {
  const parts = ip.split('.')
  if (parts.length !== 4) throw new Error('无效 IP 地址')
  return parts.reduce((acc, part) => {
    const n = parseInt(part, 10)
    if (isNaN(n) || n < 0 || n > 255) throw new Error(`无效的八位组：${part}`)
    return (acc * 256 + n) >>> 0
  }, 0)
}

/** 将 32 位无符号整数转为点分十进制 IP */
function numToIp(num: number): string {
  return [
    (num >>> 24) & 0xff,
    (num >>> 16) & 0xff,
    (num >>> 8) & 0xff,
    num & 0xff,
  ].join('.')
}

/** 将 32 位整数转为 8位.8位.8位.8位 二进制字符串 */
function numToBinary(num: number): string {
  return [
    (num >>> 24) & 0xff,
    (num >>> 16) & 0xff,
    (num >>> 8) & 0xff,
    num & 0xff,
  ]
    .map(b => b.toString(2).padStart(8, '0'))
    .join('.')
}

function getIpClass(firstOctet: number): string {
  if (firstOctet < 128) return 'A'
  if (firstOctet < 192) return 'B'
  if (firstOctet < 224) return 'C'
  if (firstOctet < 240) return 'D (多播)'
  return 'E (保留)'
}

function isPrivateIp(num: number): boolean {
  // 10.0.0.0/8
  if ((num >>> 24) === 10) return true
  // 172.16.0.0/12
  if ((num >>> 20) === (172 * 16 + 1)) return true
  // 192.168.0.0/16
  if ((num >>> 16) === (192 * 256 + 168)) return true
  // 127.0.0.0/8 (loopback)
  if ((num >>> 24) === 127) return true
  return false
}

export function parseCIDR(cidr: string): ParseResult {
  const trimmed = cidr.trim()

  // 支持纯 IP（默认 /32）和 CIDR
  const hasMask = trimmed.includes('/')
  const [ipPart, prefixPart] = hasMask ? trimmed.split('/') : [trimmed, '32']

  // 验证前缀
  const prefix = parseInt(prefixPart, 10)
  if (isNaN(prefix) || prefix < 0 || prefix > 32) {
    return { ok: false, error: '前缀长度必须在 0–32 之间' }
  }

  // 验证 IP
  if (!/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(ipPart)) {
    return { ok: false, error: '请输入合法的 IPv4 地址（如 192.168.1.0/24）' }
  }

  let ipNum: number
  try {
    ipNum = ipToNum(ipPart)
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : '无效 IP' }
  }

  // 子网掩码（prefix=0 时掩码为 0）
  const mask = prefix === 0 ? 0 : (~0 << (32 - prefix)) >>> 0
  const networkNum = (ipNum & mask) >>> 0
  const broadcastNum = (networkNum | (~mask >>> 0)) >>> 0

  const totalHosts = prefix >= 32 ? 1 : prefix === 31 ? 2 : Math.pow(2, 32 - prefix)
  const usableHosts = prefix >= 31 ? totalHosts : totalHosts - 2

  const firstOctet = (ipNum >>> 24) & 0xff

  return {
    ok: true,
    info: {
      ip: ipPart,
      prefix,
      networkAddress: numToIp(networkNum),
      broadcastAddress: numToIp(broadcastNum),
      firstHost: prefix >= 31 ? numToIp(networkNum) : numToIp(networkNum + 1),
      lastHost: prefix >= 31 ? numToIp(broadcastNum) : numToIp(broadcastNum - 1),
      subnetMask: numToIp(mask),
      wildcardMask: numToIp(~mask >>> 0),
      totalHosts,
      usableHosts,
      ipClass: getIpClass(firstOctet),
      isPrivate: isPrivateIp(ipNum),
      ipBinary: numToBinary(ipNum),
      maskBinary: numToBinary(mask),
    },
  }
}

/** 将一个网段按给定新前缀划分子网 */
export function splitSubnets(cidr: string, newPrefix: number): string[] {
  const result = parseCIDR(cidr)
  if (!result.ok) return []
  const { prefix } = result.info
  if (newPrefix <= prefix || newPrefix > 32) return []
  const count = Math.pow(2, newPrefix - prefix)
  const blockSize = Math.pow(2, 32 - newPrefix)

  try {
    const baseNum = ipToNum(result.info.networkAddress)
    return Array.from({ length: count }, (_, i) => {
      const net = (baseNum + i * blockSize) >>> 0
      return `${numToIp(net)}/${newPrefix}`
    })
  } catch {
    return []
  }
}
