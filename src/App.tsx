import { useCallback, useEffect, useMemo, useState } from 'react'
import type { DB, DayState, Post, Role, User } from './types'
import { ROLES, findRole } from './data/roles'
import { dateKey, formatCn, pickRoleIndex } from './lib/daily'
import { DEFAULT_DB, loadDB, saveDB } from './lib/storage'
import { Sheet, Toast } from './components/ui'
import { Login } from './screens/Login'
import { Home } from './screens/Home'
import { Community } from './screens/Community'
import { Share } from './screens/Share'
import { Achievements, computeStreak } from './screens/Achievements'
import { History } from './screens/History'
import { Workshop } from './screens/Workshop'
import { expectNever } from './lib/unreachable'

type Route = 'home' | 'community' | 'share' | 'achievements' | 'history' | 'workshop'

function buildDay(db: DB, user: User, key: string): DayState {
  const pool = [...ROLES, ...db.customRoles]
  const role = pool[pickRoleIndex(`${user.id}:${key}`, pool.length)]
  return {
    date: key,
    roleId: role.id,
    rerollsLeft: 1,
    tasks: role.tasks.map(() => ({ done: false, note: '' })),
    submitted: false,
    liked: false,
    sharedToCommunity: false,
  }
}

export default function App() {
  const [db, setDb] = useState<DB>(() => (typeof window === 'undefined' ? DEFAULT_DB : loadDB()))
  const [route, setRoute] = useState<Route>('home')
  const [toastMsg, setToastMsg] = useState<string | null>(null)
  const [todayKey, setTodayKey] = useState(() => dateKey())
  const [profileOpen, setProfileOpen] = useState(false)

  const toast = useCallback((m: string) => {
    setToastMsg(m)
    window.setTimeout(() => setToastMsg(null), 1800)
  }, [])

  useEffect(() => saveDB(db), [db])

  useEffect(() => {
    const t = window.setInterval(() => setTodayKey(dateKey()), 60_000)
    return () => window.clearInterval(t)
  }, [])

  const user = db.user

  useEffect(() => {
    if (!user) return
    setDb((prev) => {
      if (prev.days[todayKey]) return prev
      return { ...prev, days: { ...prev.days, [todayKey]: buildDay(prev, user, todayKey) } }
    })
  }, [todayKey, user])

  const day = db.days[todayKey]
  const pool = useMemo(() => [...ROLES, ...db.customRoles], [db.customRoles])
  const role = day ? findRole(day.roleId, db.customRoles) : undefined

  const achievements = useMemo(() => {
    let unlocked = 0
    const unique = new Set(Object.values(db.days).map((d) => d.roleId))
    const submitted = Object.values(db.days).filter((d) => d.submitted).length
    const allDone = Object.values(db.days).filter(
      (d) => d.tasks.length > 0 && d.tasks.every((t) => t.done),
    ).length
    const shared = Object.values(db.days).filter((d) => d.sharedToCommunity).length
    const streak = computeStreak(db.days)
    if (submitted >= 1) unlocked++
    if (streak >= 3) unlocked++
    if (unique.size >= 10) unlocked++
    if (allDone >= 5) unlocked++
    if (shared >= 10) unlocked++
    if (unique.size >= 50) unlocked++
    return { unlocked, streak }
  }, [db.days])

  const updateToday = useCallback(
    (patch: Partial<DayState> | ((d: DayState) => Partial<DayState>)) => {
      setDb((prev) => {
        const cur = prev.days[todayKey]
        if (!cur) return prev
        const next = typeof patch === 'function' ? patch(cur) : patch
        return { ...prev, days: { ...prev.days, [todayKey]: { ...cur, ...next } } }
      })
    },
    [todayKey],
  )

  if (!user) {
    return (
      <>
        <Login onLogin={(u) => setDb((prev) => ({ ...prev, user: u }))} toast={toast} />
        <Toast message={toastMsg} />
      </>
    )
  }

  if (!day || !role) {
    return <div className="flex min-h-screen items-center justify-center text-sm font-bold text-[#B0B7BD]">加载中…</div>
  }

  const setRole = (r: Role) => {
    updateToday({
      roleId: r.id,
      tasks: r.tasks.map(() => ({ done: false, note: '' })),
      submitted: false,
      liked: false,
      sharedToCommunity: false,
    })
  }

  /** 换角色前保护已有进度，避免误清空 */
  const guardedSetRole = (r: Role) => {
    if (r.id === day.roleId) return true
    const hasProgress = day.tasks.some((t) => t.done || t.note)
    if (hasProgress && !window.confirm('换角色会清空今天的任务进度和心得，确定吗？')) return false
    setRole(r)
    return true
  }

  const reroll = () => {
    if (day.rerollsLeft <= 0) {
      toast('今天已经换过一次啦，明天再来')
      return
    }
    const idx = pool.findIndex((r) => r.id === day.roleId)
    const next = pool[(idx + 1) % pool.length]
    if (!guardedSetRole(next)) return
    updateToday({ rerollsLeft: day.rerollsLeft - 1 })
    toast(`今日角色：${next.name}`)
  }

  const completeWithoutNote = (i: number) =>
    updateToday((d) => {
      const tasks = d.tasks.map((t, j) => (j === i ? { ...t, done: true } : t))
      return { tasks, submitted: true }
    })

  const submitNote = (i: number, note: string) =>
    updateToday((d) => {
      const tasks = d.tasks.map((t, j) => (j === i ? { ...t, done: true, note } : t))
      return { tasks, submitted: true }
    })

  const shareToCommunity = (feeling: string) => {
    const post: Post = {
      id: `p-${Date.now()}`,
      author: user.name,
      roleEmoji: role.emoji,
      roleName: role.name,
      content: feeling,
      tags: role.tags.slice(0, 2),
      likes: 0,
      comments: 0,
      shares: 0,
      timeLabel: '刚刚',
      mine: true,
    }
    setDb((prev) => ({ ...prev, posts: [post, ...prev.posts] }))
    updateToday({ sharedToCommunity: true })
  }

  switch (route) {
    case 'community':
      return (
        <>
          <Community
            posts={db.posts}
            comments={db.comments}
            rolePool={pool}
            onBack={() => setRoute('home')}
            onLike={(id) =>
              setDb((prev) => ({
                ...prev,
                posts: prev.posts.map((p) =>
                  p.id === id
                    ? { ...p, liked: !p.liked, likes: p.likes + (p.liked ? -1 : 1) }
                    : p,
                ),
              }))
            }
            onComment={(id, text) =>
              setDb((prev) => {
                const list = prev.comments[id] ?? []
                return {
                  ...prev,
                  comments: {
                    ...prev.comments,
                    [id]: [
                      ...list,
                      { id: `c-${Date.now()}`, author: user.name, text, timeLabel: '刚刚' },
                    ],
                  },
                  posts: prev.posts.map((p) =>
                    p.id === id ? { ...p, comments: p.comments + 1 } : p,
                  ),
                }
              })
            }
            onGotoWorkshop={() => setRoute('workshop')}
            onUseRole={(r) => {
              if (guardedSetRole(r)) {
                setRoute('home')
                toast(`今日角色：${r.name}`)
              }
            }}
          />
          <Toast message={toastMsg} />
        </>
      )
    case 'share':
      return (
        <>
          <Share
            role={role}
            day={day}
            dateLabel={formatCn()}
            onBack={() => setRoute('home')}
            onShared={shareToCommunity}
            toast={toast}
          />
          <Toast message={toastMsg} />
        </>
      )
    case 'achievements':
      return (
        <>
          <Achievements days={db.days} onBack={() => setRoute('home')} />
          <Toast message={toastMsg} />
        </>
      )
    case 'history':
      return (
        <>
          <History
            days={db.days}
            customRoles={db.customRoles}
            posts={db.posts}
            onBack={() => setRoute('home')}
          />
          <Toast message={toastMsg} />
        </>
      )
    case 'workshop':
      return (
        <>
          <Workshop
            customRoles={db.customRoles}
            onBack={() => setRoute('home')}
            onCreate={(r) => {
              setDb((prev) => ({ ...prev, customRoles: [r, ...prev.customRoles] }))
              setRole(r)
              setRoute('home')
            }}
            onUseRole={(r) => {
              if (guardedSetRole(r)) {
                setRoute('home')
                toast(`今日角色：${r.name}`)
              }
            }}
            toast={toast}
          />
          <Toast message={toastMsg} />
        </>
      )
    case 'home':
      break
    default:
      return expectNever(route)
  }

  return (
    <>
      <Home
        user={user}
        role={role}
        day={day}
        streak={achievements.streak}
        unlocked={achievements.unlocked}
        onToggleNote={submitNote}
        onCompleteWithoutNote={completeWithoutNote}
        onEditNote={() => undefined}
        onReroll={reroll}
        onNavigate={(r) => setRoute(r)}
        onOpenProfile={() => setProfileOpen(true)}
        toast={toast}
      />
      <Sheet open={profileOpen} onClose={() => setProfileOpen(false)} title="我的">
        <div className="flex items-center gap-3 rounded-2xl bg-brand-soft px-4 py-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-green text-xl font-extrabold text-white">
            {user.name.slice(0, 1)}
          </div>
          <div className="min-w-0">
            <div className="text-[16px] font-extrabold text-brand-ink">{user.name}</div>
            <div className="truncate text-[12px] font-semibold text-brand-sub">
              {user.guest ? '游客体验中 · 数据保存在本机' : user.email}
            </div>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <button
            onClick={() => {
              setProfileOpen(false)
              setRoute('workshop')
            }}
            className="press w-full rounded-2xl border-2 border-brand-line py-3 text-[14px] font-extrabold text-brand-ink"
          >
            我的角色工坊
          </button>
          <button
            onClick={() => {
              setDb((prev) => ({ ...prev, user: null }))
              setProfileOpen(false)
              setRoute('home')
            }}
            className="press w-full rounded-2xl border-2 border-brand-line py-3 text-[14px] font-extrabold text-brand-ink"
          >
            退出登录
          </button>
          <button
            onClick={() => {
              if (!window.confirm('清空所有体验记录、成就和自定义角色？此操作不可恢复。')) return
              setDb((prev) => ({
                ...prev,
                days: {},
                customRoles: [],
                posts: prev.posts.filter((p) => !p.mine),
                comments: {},
              }))
              setProfileOpen(false)
              toast('已清空本机数据')
            }}
            className="press w-full rounded-2xl border-2 border-[#FFD9D9] py-3 text-[14px] font-extrabold text-brand-red"
          >
            清空体验数据
          </button>
        </div>

        <p className="mt-4 text-center text-[11px] font-medium leading-relaxed text-[#B0B7BD]">
          当前为本地演示版：账号、记录与社区内容均保存在浏览器 localStorage。
          <br />
          后续接入服务端即可多端同步。
        </p>
      </Sheet>
      <Toast message={toastMsg} />
    </>
  )
}
