export interface ParsedUrl {
  href: string
  protocol: string
  host: string
  hostname: string
  port: string
  pathname: string
  search: string
  hash: string
  params: { key: string; value: string }[]
}

export function parseUrl(input: string): ParsedUrl {
  const raw = input.trim()
  const withProtocol = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`
  const url = new URL(withProtocol)
  const params: { key: string; value: string }[] = []
  url.searchParams.forEach((value, key) => params.push({ key, value }))
  return {
    href: url.href,
    protocol: url.protocol,
    host: url.host,
    hostname: url.hostname,
    port: url.port,
    pathname: url.pathname,
    search: url.search,
    hash: url.hash,
    params,
  }
}
