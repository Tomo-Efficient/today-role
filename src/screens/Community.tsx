import { useMemo, useState } from 'react'
import { Heart, MessageCircle, Send, Share2, Users } from 'lucide-react'
import type { Post } from '../types'
import type { Role } from '../types'
import { BackHeader, Screen, Sheet } from '../components/ui'
import { hash } from '../lib/daily'

export function Community({
  posts,
  comments,
  onLike,
  onComment,
  onBack,
  onGotoWorkshop,
  onUseRole,
  rolePool,
}: {
  posts: Post[]
  comments: Record<string, { id: string; author: string; text: string; timeLabel: string }[]>
  onLike: (id: string) => void
  onComment: (id: string, text: string) => void
  onBack: () => void
  onGotoWorkshop: () => void
  onUseRole: (role: Role) => void
  rolePool: Role[]
}) {
  const [tab, setTab] = useState<'all' | 'hot'>('all')
  const [commentFor, setCommentFor] = useState<Post | null>(null)
  const [draft, setDraft] = useState('')
  const [shareFor, setShareFor] = useState<Post | null>(null)

  const ranking = useMemo(() => {
    return [...rolePool]
      .map((r) => ({ role: r, count: 800 + (hash(r.id) % 4200) }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8)
  }, [rolePool])

  const list = tab === 'all' ? posts : [...posts].sort((a, b) => b.likes - a.likes)

  return (
    <Screen>
      <BackHeader
        title="交流社区"
        subtitle="分享你的角色体验"
        tone="blue"
        icon={<Users size={26} strokeWidth={2.6} />}
        onBack={onBack}
      />

      <div className="px-5 pb-12 pt-5">
        <div className="flex rounded-2xl bg-brand-soft p-1">
          {(
            [
              ['all', '全部分享'],
              ['hot', '热门角色'],
            ] as const
          ).map(([k, label]) => (
            <button
              key={k}
              onClick={() => setTab(k)}
              className={`press flex-1 rounded-xl py-2.5 text-[15px] font-extrabold transition ${
                tab === k ? 'bg-white text-brand-ink shadow-card' : 'text-brand-sub'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {tab === 'hot' && (
          <div className="mt-4 overflow-hidden rounded-3xl border-2 border-[#E0F5FF] bg-[#F7FCFF]">
            <div className="flex items-center justify-between px-4 pb-1 pt-4">
              <h3 className="text-[17px] font-extrabold text-brand-ink">热门角色榜</h3>
              <span className="text-[12px] font-bold text-brand-sub">近 7 天</span>
            </div>
            <div className="divide-y divide-[#EAF6FC]">
              {ranking.map((item, i) => (
                <div key={item.role.id} className="flex items-center gap-3 px-4 py-3">
                  <span
                    className={`w-5 text-center text-[15px] font-extrabold ${
                      i === 0 ? 'text-brand-yellow' : i < 3 ? 'text-brand-blue' : 'text-[#B0B7BD]'
                    }`}
                  >
                    {i + 1}
                  </span>
                  <span className="text-2xl">{item.role.emoji}</span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[14px] font-extrabold text-brand-ink">{item.role.name}</div>
                    <div className="text-[11px] font-semibold text-brand-sub">
                      {item.count.toLocaleString()} 人体验
                    </div>
                  </div>
                  <button
                    onClick={() => onUseRole(item.role)}
                    className="press rounded-full bg-white px-3 py-1.5 text-[12px] font-extrabold text-brand-blue shadow-[0_2px_0_rgba(28,176,246,0.25)]"
                  >
                    体验
                  </button>
                </div>
              ))}
            </div>
            <div className="px-4 pb-4 pt-3">
              <button
                onClick={onGotoWorkshop}
                className="press flex w-full items-center justify-between rounded-2xl bg-white px-4 py-3 text-left shadow-card"
              >
                <span>
                  <span className="block text-[14px] font-extrabold text-brand-ink">发现更多角色</span>
                  <span className="mt-0.5 block text-[11px] font-semibold text-brand-sub">
                    探索社区中的热门角色，开启你的体验之旅
                  </span>
                </span>
                <span className="text-[13px] font-extrabold text-brand-blue">前往角色工坊 ›</span>
              </button>
            </div>
          </div>
        )}

        {tab === 'all' && (
          <div className="mt-4 space-y-4">
            {list.map((p) => (
              <article key={p.id} className="card animate-floatIn p-5">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">{p.roleEmoji}</span>
                  <div className="min-w-0">
                    <div className="text-[15px] font-extrabold text-brand-ink">{p.author}</div>
                    <div className="truncate text-[12px] font-semibold text-brand-sub">
                      {p.roleEmoji} {p.roleName} · {p.timeLabel}
                    </div>
                  </div>
                  {p.mine && (
                    <span className="ml-auto pill bg-[#EAFBE7] text-[11px] text-brand-green">我的</span>
                  )}
                </div>

                <p className="mt-3.5 text-[15px] font-medium leading-relaxed text-[#4B5563]">{p.content}</p>

                <div className="mt-3 flex flex-wrap gap-2">
                  {p.tags.map((t) => (
                    <span key={t} className="pill bg-[#E0F5FF] px-2.5 py-1 text-[12px] text-[#1899D6]">
                      #{t}
                    </span>
                  ))}
                </div>

                <div className="mt-4 flex items-center gap-6 border-t border-brand-line pt-3 text-[13px] font-extrabold text-brand-sub">
                  <button
                    onClick={() => onLike(p.id)}
                    className={`press flex items-center gap-1.5 ${p.liked ? 'text-brand-red' : ''}`}
                  >
                    <Heart size={18} strokeWidth={2.4} fill={p.liked ? '#FF4B4B' : 'none'} />
                    {p.likes}
                  </button>
                  <button onClick={() => setCommentFor(p)} className="press flex items-center gap-1.5">
                    <MessageCircle size={18} strokeWidth={2.4} />
                    {p.comments}
                  </button>
                  <button onClick={() => setShareFor(p)} className="press flex items-center gap-1.5">
                    <Share2 size={17} strokeWidth={2.4} />
                    {p.shares}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      <Sheet open={!!commentFor} onClose={() => setCommentFor(null)} title="评论">
        {commentFor && (
          <div>
            <p className="rounded-2xl bg-brand-soft px-4 py-3 text-[14px] font-medium leading-relaxed text-[#6B7280]">
              {commentFor.content}
            </p>
            <div className="mt-4 space-y-3">
              {(comments[commentFor.id] ?? []).length === 0 && (
                <p className="py-6 text-center text-[13px] font-semibold text-[#B0B7BD]">
                  还没有评论，快来抢沙发
                </p>
              )}
              {(comments[commentFor.id] ?? []).map((c) => (
                <div key={c.id} className="flex gap-2.5">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#E0F5FF] text-[13px] font-extrabold text-[#1899D6]">
                    {c.author.slice(0, 1)}
                  </div>
                  <div>
                    <div className="text-[12px] font-extrabold text-brand-ink">
                      {c.author}
                      <span className="ml-2 font-semibold text-[#B0B7BD]">{c.timeLabel}</span>
                    </div>
                    <p className="mt-0.5 text-[14px] font-medium text-[#4B5563]">{c.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 flex items-center gap-2 rounded-2xl border border-brand-line px-3 py-2">
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="写下你的想法"
                className="flex-1 bg-transparent text-[14px] font-semibold text-brand-ink outline-none placeholder:font-medium placeholder:text-[#B0B7BD]"
              />
              <button
                onClick={() => {
                  if (!draft.trim()) return
                  onComment(commentFor.id, draft.trim())
                  setDraft('')
                }}
                className="press flex h-9 w-9 items-center justify-center rounded-full bg-brand-blue text-white"
                aria-label="发送"
              >
                <Send size={16} strokeWidth={2.6} />
              </button>
            </div>
          </div>
        )}
      </Sheet>

      <Sheet open={!!shareFor} onClose={() => setShareFor(null)} title="分享到">
        <div className="grid grid-cols-4 gap-3 pb-4">
          {['微信', '朋友圈', '微博', '复制链接'].map((s) => (
            <button
              key={s}
              onClick={() => setShareFor(null)}
              className="press flex flex-col items-center gap-2 rounded-2xl bg-brand-soft py-4 text-[12px] font-extrabold text-brand-sub"
            >
              <Share2 size={20} strokeWidth={2.4} />
              {s}
            </button>
          ))}
        </div>
      </Sheet>
    </Screen>
  )
}
