/** 本地日期键 YYYY-MM-DD（按用户所在时区） */
export function dateKey(d: Date = new Date()): string {
  const y = d.getFullYear()
  const m = `${d.getMonth() + 1}`.padStart(2, '0')
  const day = `${d.getDate()}`.padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function formatCn(d: Date = new Date()): string {
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`
}

/** 32-bit FNV-1a，用于「同一用户 + 同一天 → 同一角色」的确定性随机 */
export function hash(input: string): number {
  let h = 0x811c9dc5
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i)
    h = Math.imul(h, 0x01000193)
  }
  return h >>> 0
}

/**
 * 每日角色：确定性随机。
 * offset 用于「换一个角色」，在同一天内按偏移量取下一个不重复的位置。
 */
export function pickRoleIndex(seed: string, length: number, offset = 0): number {
  if (length <= 0) return 0
  const base = hash(seed) % length
  return (base + offset) % length
}

export function streakOf(days: Record<string, { submitted: boolean }>): number {
  let n = 0
  const d = new Date()
  for (;;) {
    const key = dateKey(d)
    const day = days[key]
    if (day && day.submitted) {
      n++
      d.setDate(d.getDate() - 1)
    } else break
  }
  return n
}

export function daysBetween(a: string, b: string): number {
  return Math.abs(new Date(a).getTime() - new Date(b).getTime()) / 86400000
}
