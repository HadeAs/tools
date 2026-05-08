import { describe, it, expect } from 'vitest'
import { parseCIDR, splitSubnets } from './logic'

describe('parseCIDR', () => {
  it('解析 /24 网段', () => {
    const r = parseCIDR('192.168.1.0/24')
    expect(r.ok).toBe(true)
    if (!r.ok) return
    expect(r.info.networkAddress).toBe('192.168.1.0')
    expect(r.info.broadcastAddress).toBe('192.168.1.255')
    expect(r.info.subnetMask).toBe('255.255.255.0')
    expect(r.info.wildcardMask).toBe('0.0.0.255')
    expect(r.info.firstHost).toBe('192.168.1.1')
    expect(r.info.lastHost).toBe('192.168.1.254')
    expect(r.info.totalHosts).toBe(256)
    expect(r.info.usableHosts).toBe(254)
    expect(r.info.isPrivate).toBe(true)
    expect(r.info.ipClass).toBe('C')
  })

  it('解析 /16 网段', () => {
    const r = parseCIDR('10.0.0.0/16')
    expect(r.ok).toBe(true)
    if (!r.ok) return
    expect(r.info.networkAddress).toBe('10.0.0.0')
    expect(r.info.broadcastAddress).toBe('10.0.255.255')
    expect(r.info.subnetMask).toBe('255.255.0.0')
    expect(r.info.totalHosts).toBe(65536)
    expect(r.info.usableHosts).toBe(65534)
    expect(r.info.isPrivate).toBe(true)
    expect(r.info.ipClass).toBe('A')
  })

  it('解析 /32（单个主机）', () => {
    const r = parseCIDR('8.8.8.8/32')
    expect(r.ok).toBe(true)
    if (!r.ok) return
    expect(r.info.networkAddress).toBe('8.8.8.8')
    expect(r.info.broadcastAddress).toBe('8.8.8.8')
    expect(r.info.totalHosts).toBe(1)
    expect(r.info.usableHosts).toBe(1)
    expect(r.info.isPrivate).toBe(false)
  })

  it('解析 /0（全路由）', () => {
    const r = parseCIDR('0.0.0.0/0')
    expect(r.ok).toBe(true)
    if (!r.ok) return
    expect(r.info.networkAddress).toBe('0.0.0.0')
    expect(r.info.broadcastAddress).toBe('255.255.255.255')
    expect(r.info.totalHosts).toBe(4294967296)
  })

  it('主机 IP 自动对齐到网络地址', () => {
    const r = parseCIDR('192.168.1.100/24')
    expect(r.ok).toBe(true)
    if (!r.ok) return
    expect(r.info.networkAddress).toBe('192.168.1.0')
    expect(r.info.ip).toBe('192.168.1.100') // 保留原始 IP
  })

  it('纯 IP 不带前缀默认 /32', () => {
    const r = parseCIDR('10.0.0.1')
    expect(r.ok).toBe(true)
    if (!r.ok) return
    expect(r.info.prefix).toBe(32)
  })

  it('二进制展示格式', () => {
    const r = parseCIDR('192.168.1.0/24')
    expect(r.ok).toBe(true)
    if (!r.ok) return
    expect(r.info.ipBinary).toMatch(/^\d{8}\.\d{8}\.\d{8}\.\d{8}$/)
    expect(r.info.maskBinary).toBe('11111111.11111111.11111111.00000000')
  })

  it('无效前缀返回错误', () => {
    expect(parseCIDR('192.168.1.0/33').ok).toBe(false)
    expect(parseCIDR('192.168.1.0/-1').ok).toBe(false)
  })

  it('无效 IP 返回错误', () => {
    expect(parseCIDR('999.168.1.0/24').ok).toBe(false)
    expect(parseCIDR('abc/24').ok).toBe(false)
  })
})

describe('splitSubnets', () => {
  it('将 /24 拆分为 /26', () => {
    const subnets = splitSubnets('192.168.1.0/24', 26)
    expect(subnets).toHaveLength(4)
    expect(subnets[0]).toBe('192.168.1.0/26')
    expect(subnets[1]).toBe('192.168.1.64/26')
    expect(subnets[2]).toBe('192.168.1.128/26')
    expect(subnets[3]).toBe('192.168.1.192/26')
  })

  it('新前缀小于等于原前缀时返回空数组', () => {
    expect(splitSubnets('192.168.1.0/24', 24)).toHaveLength(0)
    expect(splitSubnets('192.168.1.0/24', 23)).toHaveLength(0)
  })
})
