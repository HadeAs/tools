export type Point = { x: number; y: number }

export type TextLayer = {
  id: string
  text: string
  x: number        // percentage of canvas width  (0-100)
  y: number        // percentage of canvas height (0-100)
  fontSize: number
  fontFamily: string
  color: string
  opacity: number  // 0-100
  bold: boolean
  italic: boolean
  bgColor: string
  bgOpacity: number // 0-100
  padding: number
}

export type DrawStroke = {
  id: string
  points: Point[]
  color: string
  size: number
  opacity: number  // 0-100
}

export function createTextLayer(id: string): TextLayer {
  return {
    id,
    text: '在此输入文字',
    x: 50,
    y: 45,
    fontSize: 48,
    fontFamily: 'sans-serif',
    color: '#ffffff',
    opacity: 100,
    bold: true,
    italic: false,
    bgColor: '#000000',
    bgOpacity: 0,
    padding: 8,
  }
}

export function fontString(layer: Pick<TextLayer, 'bold' | 'italic' | 'fontSize' | 'fontFamily'>): string {
  const style: string[] = []
  if (layer.italic) style.push('italic')
  if (layer.bold) style.push('bold')
  return [...style, `${layer.fontSize}px`, layer.fontFamily].join(' ')
}

export function drawStroke(ctx: CanvasRenderingContext2D, stroke: DrawStroke): void {
  if (stroke.points.length < 2) {
    // Single dot
    if (stroke.points.length === 1) {
      ctx.save()
      ctx.globalAlpha = stroke.opacity / 100
      ctx.fillStyle = stroke.color
      ctx.beginPath()
      ctx.arc(stroke.points[0].x, stroke.points[0].y, stroke.size / 2, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()
    }
    return
  }
  ctx.save()
  ctx.globalAlpha = stroke.opacity / 100
  ctx.strokeStyle = stroke.color
  ctx.lineWidth = stroke.size
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  ctx.beginPath()
  ctx.moveTo(stroke.points[0].x, stroke.points[0].y)
  for (let i = 1; i < stroke.points.length - 1; i++) {
    const mx = (stroke.points[i].x + stroke.points[i + 1].x) / 2
    const my = (stroke.points[i].y + stroke.points[i + 1].y) / 2
    ctx.quadraticCurveTo(stroke.points[i].x, stroke.points[i].y, mx, my)
  }
  const last = stroke.points[stroke.points.length - 1]
  ctx.lineTo(last.x, last.y)
  ctx.stroke()
  ctx.restore()
}

export function drawTextLayer(
  ctx: CanvasRenderingContext2D,
  layer: TextLayer,
  canvasWidth: number,
  canvasHeight: number,
): void {
  ctx.save()
  ctx.font = fontString(layer)
  ctx.textBaseline = 'top'

  const x = (layer.x / 100) * canvasWidth
  const y = (layer.y / 100) * canvasHeight
  const lines = layer.text.split('\n')
  const lineHeight = layer.fontSize * 1.25
  const maxWidth = Math.max(...lines.map(l => ctx.measureText(l).width), 0)
  const totalHeight = lines.length * lineHeight

  if (layer.bgOpacity > 0) {
    ctx.globalAlpha = layer.bgOpacity / 100
    ctx.fillStyle = layer.bgColor
    ctx.fillRect(x - layer.padding, y - layer.padding, maxWidth + layer.padding * 2, totalHeight + layer.padding * 2)
  }

  ctx.globalAlpha = layer.opacity / 100
  ctx.fillStyle = layer.color
  lines.forEach((line, i) => ctx.fillText(line, x, y + i * lineHeight))

  ctx.restore()
}

export type TextBounds = { x: number; y: number; width: number; height: number }

export function getTextBounds(
  ctx: CanvasRenderingContext2D,
  layer: TextLayer,
  canvasWidth: number,
  canvasHeight: number,
): TextBounds {
  ctx.font = fontString(layer)
  const lines = layer.text.split('\n')
  const maxWidth = Math.max(...lines.map(l => ctx.measureText(l).width), 0)
  const lineHeight = layer.fontSize * 1.25
  return {
    x: (layer.x / 100) * canvasWidth - layer.padding,
    y: (layer.y / 100) * canvasHeight - layer.padding,
    width: maxWidth + layer.padding * 2,
    height: lines.length * lineHeight + layer.padding * 2,
  }
}
