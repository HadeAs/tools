import { useState, useEffect, useCallback } from 'react'

export function usePersistedState<T>(key: string, defaultValue: T): [T, (v: T) => void] {
  // Always initialise with defaultValue so server and client first render match.
  const [value, setValue] = useState<T>(defaultValue)

  // After hydration, pull the stored value from localStorage.
  useEffect(() => {
    try {
      const stored = localStorage.getItem(key)
      if (stored !== null) setValue(JSON.parse(stored) as T)
    } catch {}
  }, [key])

  // Write to localStorage only when the caller explicitly sets a new value,
  // not during rehydration — avoids briefly overwriting stored data with defaultValue.
  const set = useCallback((v: T) => {
    setValue(v)
    try { localStorage.setItem(key, JSON.stringify(v)) } catch {}
  }, [key])

  return [value, set]
}
