import { useState } from 'react'
import {
  Check,
  ChevronDown,
  Flame,
  History,
  Share2,
  Sparkles,
  Trophy,
  User as UserIcon,
  Users,
} from 'lucide-react'
import type { DayState, Role, User } from '../types'
import { ProgressBar, Screen } from '../components/ui'
import { TASK_HINTS } from '../data/roles'

export type HomeProps = {
  user: User
  role: Role
  day: DayState
  streak: number
  unlocked: number
  onToggleNote: (index: number, note: string) => void
  onCompleteWithoutNote: (index: number) => void
  onEditNote: (index: number) => void
  onReroll: () => void
  onNavigate: (route: 'community' | 'share' | 'achievements' | 'history') => void
  onOpenProfile: () => void
  toast: (m: string) => void
}

export function Home({
  user,
  role,
  day,
  streak,
  unlocked,
  onToggleNote,
  onCompleteWithoutNote,
  onReroll,
  onNavigate,
  onOpenProfile,
  toast,
}: HomeProps) {
  const [open, setOpen] = useState<number | null>(null)
  const [draft, setDraft] = useState('')
  const doneCount = day.tasks.filter((t) => t.done).length
  const allDone = doneCount === role.tasks.length

  const expand = (i: number) => {
    setOpen((cur) => {
      const next = cur === i ? null : i
      setDraft(next === null ? '' : day.tasks[i].note)
      return next
    })
  }

  return (
    <Screen>
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur">
        <div className="relative flex items-center justify-between px-5 py-3">
          <div className="pointer-events-none absolute -bottom-px left-1/2 h-px w-screen -translate-x-1/2 bg-brand-line" />
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎭</span>
            <span className="text-[19px] font-extrabold tracking-tight text-brand-ink">重开么</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 rounded-full bg-brand-yellow px-3 py-1.5 text-white shadow-[0_3px_0_#E5A400]">
              <Flame size={16} strokeWidth={3} fill="white" />
              <span className="text-sm font-extrabold">{streak}</span>
            </div>
            <div className="flex items-center gap-1 rounded-full bg-brand-green px-3 py-1.5 text-white shadow-[0_3px_0_#46A302]">
              <Trophy size={16} strokeWidth={2.8} />
              <span className="text-sm font-extrabold">{unlocked}</span>
            </div>
            <button onClick={onOpenProfile} className="press ml-1 text-[#9AA0A6]" aria-label="我的">
              <UserIcon size={22} strokeWidth={2.4} />
            </button>
          </div>
        </div>
      </div>

      <div className="px-5 pb-10 pt-5">
        {/* 角色卡 */}
        <section className="card animate-floatIn p-6">
          <div className="flex items-start gap-3">
            <div className="animate-shine text-5xl leading-none">{role.emoji}</div>
            <div className="pt-1">
              <div className="text-[13px] font-bold text-brand-sub">角色盲盒</div>
              <h2 className="mt-0.5 text-[26px] font-extrabold leading-tight tracking-tight text-brand-ink">
                {role.name}
              </h2>
            </div>
          </div>

          <p className="mt-4 text-[15px] font-semibold leading-relaxed text-[#6B7280]">{role.desc}</p>

          <div className="mt-6 flex items-center justify-between text-sm font-extrabold">
            <span className="text-brand-ink">今日进度</span>
            <span className="text-brand-green">
              {doneCount}/{role.tasks.length}
            </span>
          </div>
          <div className="mt-2.5">
            <ProgressBar value={doneCount} max={role.tasks.length} />
          </div>

          <button
            onClick={onReroll}
            className="btn-ghost mt-5 h-12 text-[15px]"
            disabled={day.rerollsLeft <= 0}
            style={day.rerollsLeft <= 0 ? { opacity: 0.55 } : undefined}
          >
            <Sparkles size={18} strokeWidth={2.6} />
            换一个角色
          </button>
          {day.rerollsLeft <= 0 && (
            <p className="mt-2 text-center text-[11px] font-bold text-[#B0B7BD]">
              今日已换过一次 · 明天 0 点刷新
            </p>
          )}
        </section>

        {/* 今日任务 */}
        <section className="card mt-4 p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-[19px] font-extrabold text-brand-ink">今日任务</h3>
            <span className="text-sm font-extrabold text-brand-sub">
              {doneCount}/{role.tasks.length}
            </span>
          </div>

          <div className="space-y-3">
            {role.tasks.map((task, i) => {
              const st = day.tasks[i]
              const isOpen = open === i
              return (
                <div
                  key={i}
                  className={`overflow-hidden rounded-2xl border-2 transition ${
                    st.done ? 'border-[#D7F0BF] bg-[#FBFFF7]' : 'border-brand-line bg-white'
                  }`}
                >
                  <button
                    onClick={() => expand(i)}
                    data-testid={`task-${i}`}
                    className="flex w-full items-center gap-3 px-4 py-4 text-left"
                  >
                    <span
                      onClick={(e) => {
                        e.stopPropagation()
                        if (!st.done) onCompleteWithoutNote(i)
                      }}
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 transition ${
                        st.done ? 'border-brand-green bg-brand-green text-white' : 'border-brand-line text-transparent'
                      }`}
                    >
                      <Check size={16} strokeWidth={3.4} />
                    </span>
                    <span
                      className={`flex-1 text-[15px] font-bold leading-snug ${
                        st.done ? 'text-[#8BA97A]' : 'text-brand-ink'
                      }`}
                    >
                      {task.text}
                    </span>
                    <ChevronDown
                      size={18}
                      strokeWidth={2.8}
                      className={`shrink-0 text-[#B0B7BD] transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    />
                  </button>

                  {isOpen && (
                    <div className="animate-floatIn border-t border-dashed border-brand-line px-4 pb-4 pt-3">
                      <div className="rounded-xl bg-[#F7FBFF] px-3 py-2.5 text-[13px] font-semibold leading-relaxed text-[#5B87A6]">
                        💡 {task.hint ?? TASK_HINTS[i] ?? TASK_HINTS[0]}
                      </div>

                      {st.note && !draft ? (
                        <div className="mt-3">
                          <div className="mb-1.5 flex items-center gap-2">
                            <span className="text-[13px] font-extrabold text-brand-ink">我的心得</span>
                            <span className="pill bg-[#EAFBE7] text-[11px] text-brand-green">已提交</span>
                          </div>
                          <p className="rounded-xl bg-brand-soft px-3 py-2.5 text-[14px] font-medium leading-relaxed text-[#6B7280]">
                            {st.note}
                          </p>
                          <button
                            onClick={() => setDraft(st.note)}
                            className="mt-2 text-[13px] font-extrabold text-brand-blue"
                          >
                            编辑心得
                          </button>
                        </div>
                      ) : (
                        <div className="mt-3">
                          <textarea
                            value={draft}
                            onChange={(e) => setDraft(e.target.value)}
                            rows={3}
                            placeholder="描述你的感受、发现或灵感"
                            className="w-full resize-none rounded-xl border border-brand-line bg-white px-3 py-2.5 text-[14px] font-medium text-brand-ink outline-none placeholder:text-[#B0B7BD] focus:border-brand-blue"
                          />
                          <div className="mt-2 flex gap-2">
                            <button
                              data-testid="submit-note"
                              onClick={() => {
                                if (!draft.trim()) {
                                  toast('写点什么再提交吧～')
                                  return
                                }
                                onToggleNote(i, draft.trim())
                                setDraft('')
                                setOpen(null)
                                toast('心得已提交！')
                              }}
                              className="press flex-1 rounded-xl bg-brand-green py-2.5 text-[14px] font-extrabold text-white shadow-[0_3px_0_#46A302]"
                            >
                              提交心得
                            </button>
                            <button
                              onClick={() => {
                                onCompleteWithoutNote(i)
                                setOpen(null)
                                toast('任务完成！')
                              }}
                              className="press rounded-xl border border-brand-line px-4 py-2.5 text-[14px] font-extrabold text-brand-sub"
                            >
                              跳过
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {allDone && (
            <button
              onClick={() => onNavigate('share')}
              className="animate-floatIn mt-4 flex w-full items-center justify-between rounded-2xl bg-[#EAFBE7] px-4 py-3 text-left"
            >
              <span className="text-[14px] font-extrabold text-[#3E8E02]">今日体验完成！去生成分享图 ›</span>
              <Sparkles size={18} strokeWidth={2.6} className="text-brand-green" />
            </button>
          )}
        </section>

        {/* 四个入口 */}
        <section className="mt-4 grid grid-cols-2 gap-3">
          <Tile
            testId="nav-community"
            tone="blue"
            icon={<Users size={26} strokeWidth={2.6} />}
            title="交流社区"
            sub="分享你的体验"
            onClick={() => onNavigate('community')}
          />
          <Tile
            testId="nav-share"
            tone="purple"
            icon={<Share2 size={24} strokeWidth={2.6} />}
            title="生成分享图"
            sub="记录精彩时刻"
            onClick={() => onNavigate('share')}
          />
          <Tile
            testId="nav-achievements"
            tone="yellow"
            icon={<Trophy size={24} strokeWidth={2.6} />}
            title="查看成就"
            sub={`${unlocked}枚已解锁`}
            onClick={() => onNavigate('achievements')}
          />
          <Tile
            testId="nav-history"
            tone="red"
            icon={<History size={24} strokeWidth={2.6} />}
            title="体验历史"
            sub="回顾成长轨迹"
            onClick={() => onNavigate('history')}
          />
        </section>

        <p className="mt-8 text-center text-xs font-medium text-[#B0B7BD]">
          每天 0 点刷新 · 今日身份仅属于 {user.name}
        </p>
      </div>
    </Screen>
  )
}

function Tile({
  testId,
  tone,
  icon,
  title,
  sub,
  onClick,
}: {
  testId: string
  tone: 'blue' | 'purple' | 'yellow' | 'red'
  icon: React.ReactNode
  title: string
  sub: string
  onClick: () => void
}) {
  const map = {
    blue: { bg: 'bg-brand-blue', shadow: 'shadow-[0_4px_0_#1899D6]' },
    purple: { bg: 'bg-brand-purple', shadow: 'shadow-[0_4px_0_#A568CC]' },
    yellow: { bg: 'bg-brand-yellow', shadow: 'shadow-[0_4px_0_#E5A400]' },
    red: { bg: 'bg-brand-red', shadow: 'shadow-[0_4px_0_#E63F3F]' },
  }[tone]

  return (
    <button
      data-testid={testId}
      onClick={onClick}
      className={`press flex h-[124px] flex-col items-center justify-center rounded-2xl text-white ${map.bg} ${map.shadow}`}
    >
      {icon}
      <span className="mt-2 text-[15px] font-extrabold">{title}</span>
      <span className="mt-0.5 text-[11px] font-semibold text-white/85">{sub}</span>
    </button>
  )
}
