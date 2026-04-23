export type TransformConfig = {
  translateX: number
  translateY: number
  rotate: number
  scaleX: number
  scaleY: number
  skewX: number
  skewY: number
}

export const DEFAULT_TRANSFORM: TransformConfig = {
  translateX: 0,
  translateY: 0,
  rotate: 0,
  scaleX: 1,
  scaleY: 1,
  skewX: 0,
  skewY: 0,
}

export function generateTransformCSS(config: TransformConfig): string {
  const parts: string[] = []

  if (config.translateX !== 0 || config.translateY !== 0)
    parts.push(`translate(${config.translateX}px, ${config.translateY}px)`)

  if (config.rotate !== 0)
    parts.push(`rotate(${config.rotate}deg)`)

  if (config.scaleX !== 1 || config.scaleY !== 1) {
    parts.push(config.scaleX === config.scaleY
      ? `scale(${config.scaleX})`
      : `scale(${config.scaleX}, ${config.scaleY})`)
  }

  if (config.skewX !== 0 || config.skewY !== 0)
    parts.push(`skew(${config.skewX}deg, ${config.skewY}deg)`)

  return parts.length > 0 ? parts.join(' ') : 'none'
}

export function generateFullCSS(config: TransformConfig): string {
  const value = generateTransformCSS(config)
  return `transform: ${value};`
}
