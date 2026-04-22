function escapeCsvField(val: unknown): string {
  const s = typeof val === 'object' ? JSON.stringify(val) : String(val ?? '')
  return s.includes(',') || s.includes('"') || s.includes('\n')
    ? `"${s.replace(/"/g, '""')}"`
    : s
}

export function jsonToCsv(jsonStr: string): string {
  const data = JSON.parse(jsonStr)
  if (!Array.isArray(data)) throw new Error('JSON 必须是对象数组')
  if (data.length === 0) return ''
  const headers = Object.keys(data[0])
  const rows = [headers.join(','), ...data.map(row => headers.map(h => escapeCsvField(row[h])).join(','))]
  return rows.join('\n')
}

function parseCsvLine(line: string): string[] {
  const result: string[] = []
  let cur = ''
  let inQ = false
  for (let i = 0; i < line.length; i++) {
    if (line[i] === '"') {
      if (inQ && line[i + 1] === '"') { cur += '"'; i++ }
      else inQ = !inQ
    } else if (line[i] === ',' && !inQ) {
      result.push(cur); cur = ''
    } else {
      cur += line[i]
    }
  }
  result.push(cur)
  return result
}

export function csvToJson(csvStr: string): string {
  const lines = csvStr.trim().split('\n').filter(Boolean)
  if (lines.length < 2) throw new Error('CSV 至少需要标题行和一行数据')
  const headers = parseCsvLine(lines[0])
  const result = lines.slice(1).map(line => {
    const vals = parseCsvLine(line)
    return Object.fromEntries(headers.map((h, i) => [h, vals[i] ?? '']))
  })
  return JSON.stringify(result, null, 2)
}
