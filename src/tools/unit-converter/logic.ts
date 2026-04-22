export type UnitCategory = 'length' | 'weight' | 'temperature' | 'data'

export interface Unit {
  key: string
  label: string
  toBase: (v: number) => number
  fromBase: (v: number) => number
}

export const unitCategories: Record<UnitCategory, { label: string; units: Unit[] }> = {
  length: {
    label: '长度',
    units: [
      { key: 'nm',  label: '纳米 (nm)',  toBase: v => v / 1e9,        fromBase: v => v * 1e9        },
      { key: 'mm',  label: '毫米 (mm)',  toBase: v => v / 1000,       fromBase: v => v * 1000       },
      { key: 'cm',  label: '厘米 (cm)',  toBase: v => v / 100,        fromBase: v => v * 100        },
      { key: 'm',   label: '米 (m)',     toBase: v => v,              fromBase: v => v              },
      { key: 'km',  label: '千米 (km)', toBase: v => v * 1000,       fromBase: v => v / 1000       },
      { key: 'in',  label: '英寸 (in)', toBase: v => v * 0.0254,     fromBase: v => v / 0.0254     },
      { key: 'ft',  label: '英尺 (ft)', toBase: v => v * 0.3048,     fromBase: v => v / 0.3048     },
      { key: 'yd',  label: '码 (yd)',   toBase: v => v * 0.9144,     fromBase: v => v / 0.9144     },
      { key: 'mi',  label: '英里 (mi)', toBase: v => v * 1609.344,   fromBase: v => v / 1609.344   },
      { key: 'nmi', label: '海里 (nmi)',toBase: v => v * 1852,        fromBase: v => v / 1852       },
    ],
  },
  weight: {
    label: '重量',
    units: [
      { key: 'mg',  label: '毫克 (mg)',  toBase: v => v / 1e6,        fromBase: v => v * 1e6        },
      { key: 'g',   label: '克 (g)',     toBase: v => v / 1000,       fromBase: v => v * 1000       },
      { key: 'kg',  label: '千克 (kg)', toBase: v => v,              fromBase: v => v              },
      { key: 't',   label: '吨 (t)',    toBase: v => v * 1000,       fromBase: v => v / 1000       },
      { key: 'lb',  label: '磅 (lb)',   toBase: v => v * 0.453592,   fromBase: v => v / 0.453592   },
      { key: 'oz',  label: '盎司 (oz)', toBase: v => v * 0.0283495,  fromBase: v => v / 0.0283495  },
      { key: 'jin', label: '斤 (斤)',   toBase: v => v * 0.5,        fromBase: v => v / 0.5        },
    ],
  },
  temperature: {
    label: '温度',
    units: [
      { key: 'C', label: '摄氏度 (°C)', toBase: v => v,               fromBase: v => v               },
      { key: 'F', label: '华氏度 (°F)', toBase: v => (v - 32) * 5/9, fromBase: v => v * 9/5 + 32   },
      { key: 'K', label: '开尔文 (K)',  toBase: v => v - 273.15,      fromBase: v => v + 273.15      },
    ],
  },
  data: {
    label: '数据',
    units: [
      { key: 'b',   label: '比特 (b)',      toBase: v => v / 8,           fromBase: v => v * 8           },
      { key: 'B',   label: '字节 (B)',      toBase: v => v,               fromBase: v => v               },
      { key: 'KB',  label: '千字节 (KB)',   toBase: v => v * 1024,        fromBase: v => v / 1024        },
      { key: 'MB',  label: '兆字节 (MB)',   toBase: v => v * 1024 ** 2,   fromBase: v => v / 1024 ** 2   },
      { key: 'GB',  label: '吉字节 (GB)',   toBase: v => v * 1024 ** 3,   fromBase: v => v / 1024 ** 3   },
      { key: 'TB',  label: '太字节 (TB)',   toBase: v => v * 1024 ** 4,   fromBase: v => v / 1024 ** 4   },
      { key: 'Kb',  label: '千比特 (Kb)',   toBase: v => v * 125,         fromBase: v => v / 125         },
      { key: 'Mb',  label: '兆比特 (Mb)',   toBase: v => v * 125_000,     fromBase: v => v / 125_000     },
      { key: 'Gb',  label: '吉比特 (Gb)',   toBase: v => v * 125_000_000, fromBase: v => v / 125_000_000 },
    ],
  },
}

export const UNIT_CATEGORY_LABELS: UnitCategory[] = ['length', 'weight', 'temperature', 'data']

export function convertUnit(value: number, fromKey: string, toKey: string, category: UnitCategory): number {
  const units = unitCategories[category].units
  const from = units.find(u => u.key === fromKey)
  const to = units.find(u => u.key === toKey)
  if (!from || !to) throw new Error('未知单位')
  return to.fromBase(from.toBase(value))
}

export function formatResult(n: number): string {
  if (!isFinite(n)) return '∞'
  if (n === 0) return '0'
  const abs = Math.abs(n)
  if (abs >= 1e-4 && abs < 1e12) {
    const s = n.toPrecision(10).replace(/\.?0+$/, '')
    return s
  }
  return n.toExponential(6).replace(/\.?0+e/, 'e')
}
