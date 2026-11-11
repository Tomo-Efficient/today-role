import type { Role } from '../types'

const W = 1080
const H = 1440

function wrap(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const lines: string[] = []
  let line = ''
  for (const ch of text) {
    const next = line + ch
    if (ctx.measureText(next).width > maxWidth && line) {
      lines.push(line)
      line = ch
    } else {
      line = next
    }
  }
  if (line) lines.push(line)
  return lines
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

export type ShareInput = {
  role: Role
  done: boolean[]
  feeling: string
  dateLabel: string
  style?: 'classic' | 'color' | 'minimal'
}

export function renderShareImage(input: ShareInput): HTMLCanvasElement {
  const { role, done, feeling, dateLabel, style = 'classic' } = input
  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')!
  const font = (size: number, weight = '600') =>
    `${weight} ${size}px -apple-system, "PingFang SC", "Microsoft YaHei", sans-serif`

  // 背景
  const bg = ctx.createLinearGradient(0, 0, W, H)
  if (style === 'color') {
    bg.addColorStop(0, '#E0F5FF')
    bg.addColorStop(0.5, '#FFF3D6')
    bg.addColorStop(1, '#EAFBE7')
  } else if (style === 'minimal') {
    bg.addColorStop(0, '#FFFFFF')
    bg.addColorStop(1, '#F7F7F7')
  } else {
    bg.addColorStop(0, '#E8F8FF')
    bg.addColorStop(0.55, '#FFFFFF')
    bg.addColorStop(1, '#F6FFF0')
  }
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, W, H)

  // 顶部品牌
  ctx.textAlign = 'left'
  ctx.fillStyle = '#58CC02'
  ctx.font = font(32, '800')
  ctx.fillText('重开么', 80, 100)
  ctx.textAlign = 'right'
  ctx.fillStyle = '#9AA0A6'
  ctx.font = font(28, '600')
  ctx.fillText('每日一个身份', W - 80, 100)

  // 角色 emoji
  ctx.textAlign = 'center'
  ctx.font = `150px "Apple Color Emoji", "Segoe UI Emoji", sans-serif`
  ctx.fillText(role.emoji, W / 2, 320)

  // 角色名
  ctx.fillStyle = '#3C3C3C'
  ctx.font = font(66, '800')
  const titleLines = wrap(ctx, role.name, W - 200)
  let y = 420
  titleLines.forEach((l) => {
    ctx.fillText(l, W / 2, y)
    y += 84
  })

  // 描述
  ctx.fillStyle = '#777777'
  ctx.font = font(34, '500')
  const descLines = wrap(ctx, role.desc, W - 240)
  y += 6
  descLines.slice(0, 3).forEach((l) => {
    ctx.fillText(l, W / 2, y)
    y += 50
  })

  // 任务卡
  const cardY = y + 40
  const cardH = 96 + role.tasks.length * 86
  ctx.save()
  ctx.shadowColor = 'rgba(0,0,0,0.06)'
  ctx.shadowBlur = 30
  ctx.shadowOffsetY = 8
  ctx.fillStyle = '#FFFFFF'
  roundRect(ctx, 90, cardY, W - 180, cardH, 40)
  ctx.fill()
  ctx.restore()

  ctx.textAlign = 'left'
  role.tasks.forEach((t, i) => {
    const ty = cardY + 78 + i * 86
    const cx = 150
    ctx.beginPath()
    ctx.arc(cx, ty - 10, 22, 0, Math.PI * 2)
    ctx.fillStyle = done[i] ? '#58CC02' : '#E5E7EB'
    ctx.fill()
    if (done[i]) {
      ctx.strokeStyle = '#FFFFFF'
      ctx.lineWidth = 6
      ctx.lineCap = 'round'
      ctx.beginPath()
      ctx.moveTo(cx - 9, ty - 10)
      ctx.lineTo(cx - 2, ty - 2)
      ctx.lineTo(cx + 10, ty - 20)
      ctx.stroke()
    }
    ctx.fillStyle = done[i] ? '#3C3C3C' : '#9AA0A6'
    ctx.font = font(32, '700')
    const lines = wrap(ctx, t.text, W - 320)
    ctx.fillText(lines[0] + (lines.length > 1 ? '…' : ''), 195, ty)
  })

  // 我的感受
  let fy = cardY + cardH + 70
  ctx.textAlign = 'center'
  ctx.fillStyle = '#9AA0A6'
  ctx.font = font(28, '700')
  ctx.fillText('我的感受', W / 2, fy)
  fy += 56
  ctx.fillStyle = '#3C3C3C'
  ctx.font = font(34, '600')
  const feelLines = wrap(ctx, `“${feeling.trim() || '今天，我换了种活法。'}”`, W - 220)
  feelLines.slice(0, 6).forEach((l) => {
    ctx.fillText(l, W / 2, fy)
    fy += 52
  })

  // 底部
  const by = H - 90
  ctx.strokeStyle = '#E5E7EB'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(90, by - 70)
  ctx.lineTo(W - 90, by - 70)
  ctx.stroke()

  ctx.textAlign = 'left'
  ctx.fillStyle = '#9AA0A6'
  ctx.font = font(28, '600')
  ctx.fillText(dateLabel, 90, by)

  ctx.textAlign = 'right'
  ctx.fillStyle = '#58CC02'
  ctx.font = font(28, '800')
  ctx.fillText('重开么 · 角色盲盒', W - 90, by)

  return canvas
}

export function downloadShareImage(canvas: HTMLCanvasElement, filename: string) {
  const url = canvas.toDataURL('image/png')
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  return url
}
