import { useMemo, useState } from 'react'
import { Heart, History as HistoryIcon, MessageCircle } from 'lucide-react'
import type { DayState, Post, Role } from '../types'
import { BackHeader, Screen, Sheet } from '../components/ui'
import { findRole } from '../data/roles'

export function History({
  days,
  customRoles,
  posts,
  onBack,
}: {
  days: Record<string, DayState>
  customRoles: Role[]
  posts: Post[]
  onBack: () => void
}) {
  const [detail, setDetail] = useState<{ day: DayState; role: Role } | null>(null)

  const rows = useMemo(() => {
    return Object.keys(days)
      .sort()
      .reverse()
      .map((k) => {
        const day = days[k]
        const role = findRole(day.roleId, customRoles)
        return role ? { key: k, day, role } : null
      })
      .filter((r): r is { key: string; day: DayState; role: Role } => !!r)
  }, [days, customRoles])

  const totalDays = rows.filter((r) => r.day.submitted).length
  const totalTasks = Object.values(days).reduce((n, d) => n + d.tasks.filter((t) => t.done).length, 0)
  const totalLikes = posts.filter((p) => p.mine).reduce((n, p) => n + p.likes, 0)

  return (
    <Screen>
      <BackHeader
        title="体验历史"
        subtitle="回顾你的成长轨迹"
        tone="red"
        icon={<HistoryIcon size={24} strokeWidth={2.6} />}
        onBack={onBack}
      />

      <div className="px-5 pb-12 pt-5">
        <div className="card flex items-center divide-x divide-brand-line px-2 py-5">
          <div className="flex-1 text-center">
            <div className="text-[26px] font-extrabold text-brand-ink">{totalDays}</div>
            <div className="mt-0.5 text-[12px] font-semibold text-brand-sub">总天数</div>
          </div>
          <div className="flex-1 text-center">
            <div className="text-[26px] font-extrabold text-brand-blue">{totalTasks}</div>
            <div className="mt-0.5 text-[12px] font-semibold text-brand-sub">完成任务</div>
          </div>
          <div className="flex-1 text-center">
            <div className="text-[26px] font-extrabold text-brand-red">{totalLikes}</div>
            <div className="mt-0.5 text-[12px] font-semibold text-brand-sub">总点赞</div>
          </div>
        </div>

        {rows.length === 0 && (
          <div className="mt-16 flex flex-col items-center">
            <div className="text-5xl">🗂️</div>
            <p className="mt-4 text-[15px] font-extrabold text-brand-ink">还没有体验记录</p>
            <p className="mt-1 text-[13px] font-medium text-brand-sub">完成今天的任务，开启你的角色博物馆</p>
          </div>
        )}

        <div className="mt-4 space-y-4">
          {rows.map(({ key, day, role }) => {
            const doneCount = day.tasks.filter((t) => t.done).length
            const note = day.tasks.map((t) => t.note).filter(Boolean).join(' ')
            return (
              <article key={key} className="card p-5">
                <div className="flex items-start gap-3">
                  <span className="text-3xl">{role.emoji}</span>
                  <div className="min-w-0 flex-1">
                    <div className="text-[16px] font-extrabold text-brand-ink">{role.name}</div>
                    <div className="mt-0.5 text-[12px] font-semibold text-brand-sub">{formatDate(key)}</div>
                  </div>
                  <span
                    className={`pill text-[11px] ${
                      doneCount === role.tasks.length
                        ? 'bg-[#EAFBE7] text-brand-green'
                        : 'bg-brand-soft text-brand-sub'
                    }`}
                  >
                    {doneCount === role.tasks.length ? '完成' : `${doneCount}/${role.tasks.length}`}
                  </span>
                </div>

                <p className="mt-3 text-[13px] font-semibold leading-relaxed text-[#6B7280]">{role.desc}</p>

                {note && (
                  <p className="mt-3 rounded-xl bg-brand-soft px-3 py-2.5 text-[13px] font-medium leading-relaxed text-[#6B7280]">
                    “{note.length > 60 ? note.slice(0, 60) + '…' : note}”
                  </p>
                )}

                <div className="mt-3 flex items-center justify-between border-t border-brand-line pt-3">
                  <div className="flex items-center gap-4 text-[12px] font-extrabold text-brand-sub">
                    <span className="flex items-center gap-1">
                      <Heart size={14} strokeWidth={2.6} /> {day.liked ? 12 : 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle size={14} strokeWidth={2.6} /> {day.liked ? 3 : 0}
                    </span>
                  </div>
                  <button
                    onClick={() => setDetail({ day, role })}
                    className="text-[13px] font-extrabold text-brand-blue"
                  >
                    查看详情
                  </button>
                </div>
              </article>
            )
          })}
        </div>
      </div>

      <Sheet open={!!detail} onClose={() => setDetail(null)} title={detail?.role.name}>
        {detail && (
          <div>
            <div className="flex items-center gap-3">
              <span className="text-4xl">{detail.role.emoji}</span>
              <div>
                <div className="text-[12px] font-bold text-brand-sub">{formatDate(dateKeyOf(detail.day))}</div>
                <div className="text-[15px] font-extrabold text-brand-ink">{detail.role.desc}</div>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {detail.role.tasks.map((t, i) => {
                const st = detail.day.tasks[i]
                return (
                  <div
                    key={i}
                    className={`rounded-2xl border-2 p-3.5 ${
                      st?.done ? 'border-[#D7F0BF] bg-[#FBFFF7]' : 'border-brand-line'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <span className={`mt-0.5 text-[15px] ${st?.done ? 'text-brand-green' : 'text-[#C4CBD1]'}`}>
                        {st?.done ? '✓' : '○'}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="text-[14px] font-bold text-brand-ink">{t.text}</div>
                        {st?.note && (
                          <p className="mt-1 text-[13px] font-medium leading-relaxed text-[#6B7280]">{st.note}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </Sheet>
    </Screen>
  )
}

function dateKeyOf(day: DayState): string {
  return day.date
}

function formatDate(k: string): string {
  const [y, m, d] = k.split('-')
  return `${y}年${Number(m)}月${Number(d)}日`
}
