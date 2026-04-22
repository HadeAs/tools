'use client'

import { useState, useMemo } from 'react'
import { usePersistedState } from '@/hooks/use-persisted-state'
import { Input } from '@/components/ui/input'
import { ToolErrorBoundary } from '@/components/error-boundary'
import { unitCategories, convertUnit, formatResult, UNIT_CATEGORY_LABELS, type UnitCategory } from './logic'

export default function UnitConverter() {
  const [category, setCategory] = usePersistedState<UnitCategory>('tool:unit-converter:category', 'length')
  const [fromKey, setFromKey] = usePersistedState('tool:unit-converter:from', 'm')
  const [toKey, setToKey] = usePersistedState('tool:unit-converter:to', 'cm')
  const [inputVal, setInputVal] = usePersistedState('tool:unit-converter:value', '')

  const units = unitCategories[category].units

  const fromSafe = units.some(u => u.key === fromKey) ? fromKey : units[0].key
  const toSafe   = units.some(u => u.key === toKey)   ? toKey   : units[1]?.key ?? units[0].key

  const result = useMemo(() => {
    const n = Number(inputVal)
    if (!inputVal.trim() || isNaN(n)) return null
    try { return formatResult(convertUnit(n, fromSafe, toSafe, category)) }
    catch { return null }
  }, [inputVal, fromSafe, toSafe, category])

  const changeCategory = (cat: UnitCategory) => {
    setCategory(cat)
    const u = unitCategories[cat].units
    setFromKey(u[0].key)
    setToKey(u[1]?.key ?? u[0].key)
  }

  return (
    <ToolErrorBoundary>
      <div className="max-w-lg space-y-4">
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">类别</p>
          <div className="flex flex-wrap gap-2">
            {UNIT_CATEGORY_LABELS.map(cat => (
              <button
                key={cat}
                onClick={() => changeCategory(cat)}
                className={`rounded-md border px-3 py-1.5 text-xs font-medium transition-colors ${
                  category === cat
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'bg-card hover:border-primary/50'
                }`}
              >
                {unitCategories[cat].label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">数值</p>
          <Input
            value={inputVal}
            onChange={e => setInputVal(e.target.value)}
            placeholder="输入数值"
            type="number"
            className="font-mono"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          {([['从', fromSafe, setFromKey], ['到', toSafe, setToKey]] as const).map(([label, val, setter]) => (
            <div key={label} className="space-y-1">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
              <select
                value={val}
                onChange={e => setter(e.target.value)}
                className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
              >
                {units.map(u => (
                  <option key={u.key} value={u.key}>{u.label}</option>
                ))}
              </select>
            </div>
          ))}
        </div>

        {result !== null && (
          <div className="rounded-lg border bg-muted px-4 py-3">
            <p className="text-xs text-muted-foreground mb-1">
              {inputVal} {units.find(u => u.key === fromSafe)?.label} =
            </p>
            <p className="font-mono text-2xl font-semibold">
              {result} <span className="text-base font-normal text-muted-foreground">{units.find(u => u.key === toSafe)?.label}</span>
            </p>
          </div>
        )}
      </div>
    </ToolErrorBoundary>
  )
}
