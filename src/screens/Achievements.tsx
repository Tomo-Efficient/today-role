import { Trophy } from 'lucide-react'
import type { DayState } from '../types'
import { BackHeader, Screen } from '../components/ui'
import { dateKey } from '../lib/daily'

export type AchievementDef = {
  id: string
  name: string
  desc: string
  goal: number
  metric: 'days' | 'streak' | 'unique' | 'allDone' | 'shared' | 'unique50'
}

export const ACHIEVEMENTS: AchievementDef[] = [
  { id: 'first', name: '初次启航', desc: '完成第一个角色体验', goal: 1, metric: 'days' },
  { id: 'streak3', name: '持之以恒', desc: '连续3天完成角色任务', goal: 3, metric: 'streak' },
  { id: 'explorer', name: '探索者', desc: '体验10个不同的角色', goal: 10, metric: 'unique' },
  { id: 'efficient', name: '高效行动家', desc: '单日完成所有任务5次', goal: 5, metric: 'allDone' },
  { id: 'sharer', name: '分享达人', desc: '分享体验心得10次', goal: 10, metric: 'shared' },
  { id: 'master', name: '角色大师', desc: '体验50个不同角色', goal: 50, metric: 'unique50' },
]

export type AchievementState = {
  def: AchievementDef
  value: number
  unlocked: boolean
  date?: string
}

export function computeAchievements(days: Record<string, DayState>): AchievementState[] {
  const keys = Object.keys(days).sort()
  const unique = new Set<string>()
  let allDone = 0
  let shared = 0
  let run = 0
  let lastKey: string | null = null

  const unlockDate: Record<string, string> = {}

  for (const k of keys) {
    const d = days[k]
    const prev = lastKey ? new Date(lastKey + 'T00:00:00') : null
    const cur = new Date(k + 'T00:00:00')
    const consecutive = prev && cur.getTime() - prev.getTime() === 86400000
    run = d.submitted ? (consecutive ? run + 1 : 1) : 0
    lastKey = k

    unique.add(d.roleId)
    if (d.tasks.length > 0 && d.tasks.every((t) => t.done)) allDone++
    if (d.sharedToCommunity) shared++

    const metrics: Record<string, number> = {
      days: d.submitted ? 1 : 0,
      streak: run,
      unique: unique.size,
      allDone,
      shared,
      unique50: unique.size,
    }
    for (const a of ACHIEVEMENTS) {
      if (!unlockDate[a.id] && metrics[a.metric] >= a.goal) {
        // 「完成1个体验」需要真的提交过
        if (a.id === 'first' && !d.submitted) continue
        unlockDate[a.id] = k
      }
    }
  }

  const current: Record<string, number> = {
    days: Object.values(days).filter((d) => d.submitted).length,
    streak: run,
    unique: unique.size,
    allDone,
    shared,
    unique50: unique.size,
  }

  return ACHIEVEMENTS.map((def) => ({
    def,
    value: Math.min(current[def.metric] ?? 0, def.goal),
    unlocked: !!unlockDate[def.id],
    date: unlockDate[def.id],
  }))
}

export function Achievements({
  days,
  onBack,
}: {
  days: Record<string, DayState>
  onBack: () => void
}) {
  const list = computeAchievements(days)
  const unlocked = list.filter((a) => a.unlocked).length
  const uniqueCount = new Set(Object.values(days).map((d) => d.roleId)).size
  const streak = computeStreak(days)

  return (
    <Screen>
      <BackHeader
        title="成就系统"
        subtitle={`已解锁 ${unlocked}/6 个成就`}
        tone="yellow"
        icon={<Trophy size={26} strokeWidth={2.6} />}
        onBack={onBack}
      />

      <div className="px-5 pb-12 pt-5">
        <div className="card flex items-center divide-x divide-brand-line px-2 py-5">
          <div className="flex-1 text-center">
            <div className="text-[26px] font-extrabold text-brand-green">{unlocked}</div>
            <div className="mt-0.5 text-[12px] font-semibold text-brand-sub">已解锁</div>
          </div>
          <div className="flex-1 text-center">
            <div className="text-[26px] font-extrabold text-brand-ink">{uniqueCount}</div>
            <div className="mt-0.5 text-[12px] font-semibold text-brand-sub">体验角色</div>
          </div>
          <div className="flex-1 text-center">
            <div className="text-[26px] font-extrabold text-brand-yellow">{streak}</div>
            <div className="mt-0.5 text-[12px] font-semibold text-brand-sub">连续天数</div>
          </div>
        </div>

        <div className="mt-4 space-y-3">
          {list.map((a) => (
            <div
              key={a.def.id}
              className={`card flex items-center gap-4 p-5 ${a.unlocked ? '' : 'opacity-95'}`}
            >
              <div
                className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${
                  a.unlocked ? 'bg-brand-yellow text-white shadow-[0_3px_0_#E5A400]' : 'bg-brand-soft text-[#C4CBD1]'
                }`}
              >
                <Trophy size={26} strokeWidth={2.4} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[16px] font-extrabold text-brand-ink">{a.def.name}</span>
                  {a.unlocked && (
                    <span className="pill bg-[#EAFBE7] px-2 py-0.5 text-[10px] text-brand-green">已解锁</span>
                  )}
                </div>
                <div className="mt-0.5 text-[13px] font-semibold text-brand-sub">{a.def.desc}</div>
                {a.unlocked ? (
                  <div className="mt-1 text-[11px] font-bold text-[#B0B7BD]">
                    {a.date ? `${formatDate(a.date)} 解锁` : '已解锁'}
                  </div>
                ) : (
                  <div className="mt-2">
                    <div className="h-2 w-full overflow-hidden rounded-full bg-[#EDEDED]">
                      <div
                        className="h-full rounded-full bg-brand-yellow transition-all"
                        style={{ width: `${(a.value / a.def.goal) * 100}%` }}
                      />
                    </div>
                    <div className="mt-1 text-[11px] font-bold text-[#B0B7BD]">
                      进度 {a.value}/{a.def.goal}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <p className="mt-6 text-center text-[13px] font-bold text-[#B0B7BD]">
          继续完成任务，解锁更多成就！🎉
        </p>
      </div>
    </Screen>
  )
}

export function computeStreak(days: Record<string, DayState>): number {
  let n = 0
  const d = new Date()
  for (;;) {
    const key = dateKey(d)
    if (days[key]?.submitted) {
      n++
      d.setDate(d.getDate() - 1)
    } else break
  }
  return n
}

function formatDate(k: string): string {
  const [y, m, dd] = k.split('-')
  return `${y}年${Number(m)}月${Number(dd)}日`
}
