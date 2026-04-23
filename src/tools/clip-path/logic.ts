export type ClipShapeType = 'circle' | 'ellipse' | 'inset' | 'polygon'

export type CircleShape = { type: 'circle'; radius: number; cx: number; cy: number }
export type EllipseShape = { type: 'ellipse'; rx: number; ry: number; cx: number; cy: number }
export type InsetShape = { type: 'inset'; top: number; right: number; bottom: number; left: number; radius: number }
export type PolygonShape = { type: 'polygon'; preset: string; custom: string }

export type ClipShape = CircleShape | EllipseShape | InsetShape | PolygonShape

export const POLYGON_PRESETS: Record<string, { label: string; points: string }> = {
  triangle:  { label: '三角形', points: '50% 0%, 100% 100%, 0% 100%' },
  diamond:   { label: '菱形',   points: '50% 0%, 100% 50%, 50% 100%, 0% 50%' },
  pentagon:  { label: '五边形', points: '50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%' },
  hexagon:   { label: '六边形', points: '25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%' },
  star:      { label: '五角星', points: '50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%' },
  arrow:     { label: '箭头',   points: '0% 20%, 60% 20%, 60% 0%, 100% 50%, 60% 100%, 60% 80%, 0% 80%' },
  custom:    { label: '自定义', points: '' },
}

export const DEFAULT_SHAPES: Record<ClipShapeType, ClipShape> = {
  circle:  { type: 'circle',  radius: 50, cx: 50, cy: 50 },
  ellipse: { type: 'ellipse', rx: 50, ry: 35, cx: 50, cy: 50 },
  inset:   { type: 'inset',   top: 10, right: 10, bottom: 10, left: 10, radius: 0 },
  polygon: { type: 'polygon', preset: 'triangle', custom: POLYGON_PRESETS.triangle.points },
}

export function generateClipPathCSS(shape: ClipShape): string {
  switch (shape.type) {
    case 'circle':
      return `circle(${shape.radius}% at ${shape.cx}% ${shape.cy}%)`
    case 'ellipse':
      return `ellipse(${shape.rx}% ${shape.ry}% at ${shape.cx}% ${shape.cy}%)`
    case 'inset':
      return shape.radius > 0
        ? `inset(${shape.top}% ${shape.right}% ${shape.bottom}% ${shape.left}% round ${shape.radius}px)`
        : `inset(${shape.top}% ${shape.right}% ${shape.bottom}% ${shape.left}%)`
    case 'polygon': {
      const points = shape.preset === 'custom' ? shape.custom : (POLYGON_PRESETS[shape.preset]?.points ?? shape.custom)
      return `polygon(${points})`
    }
  }
}

export function generateFullCSS(shape: ClipShape): string {
  return `clip-path: ${generateClipPathCSS(shape)};`
}
