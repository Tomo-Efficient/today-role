import { useState } from 'react'
import { ArrowLeft, Plus, Sparkles } from 'lucide-react'
import type { Role } from '../types'
import { BackHeader, Screen } from '../components/ui'

const EMOJIS = ['🦊', '🐳', '🌙', '🍊', '🎧', '🧵', '🕯️', '🪐', '🧋', '🪴', '🎪', '🧭', '🍃', '🛠️', '🖋️', '🎠']

const SEED_COMMUNITY: Role[] = [
  {
    id: 'custom-seed-1',
    emoji: '🌙',
    name: '月亮收集者',
    desc: '每晚记住月亮的形状，替忙的人保管一点黑夜。',
    tags: ['治愈型', '夜晚'],
    tasks: [
      { text: '今晚抬头看一眼月亮' },
      { text: '用一句话描述它的样子' },
      { text: '把它存进你的"月亮账本"' },
    ],
    author: '晚安俱乐部',
    custom: true,
  },
  {
    id: 'custom-seed-2',
    emoji: '🧋',
    name: '奶茶店老板娘',
    desc: '记住每个熟客的口味，也记住他们今天的表情。',
    tags: ['社交型', '日常'],
    tasks: [
      { text: '为一个人记住一个小偏好' },
      { text: '主动问一句"今天还好吗"' },
      { text: '记录一个陌生人的小故事' },
    ],
    author: '加珍珠不加糖',
    custom: true,
  },
]

export function Workshop({
  customRoles,
  onBack,
  onCreate,
  onUseRole,
  toast,
}: {
  customRoles: Role[]
  onBack: () => void
  onCreate: (role: Role) => void
  onUseRole: (role: Role) => void
  toast: (m: string) => void
}) {
  const [view, setView] = useState<'list' | 'create'>('list')
  const all = [...customRoles, ...SEED_COMMUNITY]

  if (view === 'create') {
    return <CreateRole onBack={() => setView('list')} onCreate={onCreate} toast={toast} />
  }

  return (
    <Screen>
      <BackHeader
        title="角色工坊"
        subtitle="创造你的专属角色"
        tone="purple"
        icon={<Sparkles size={24} strokeWidth={2.6} />}
        onBack={onBack}
      />

      <div className="px-5 pb-12 pt-5">
        <div className="rounded-3xl bg-gradient-to-br from-[#F3E8FF] to-[#E0F5FF] p-5">
          <div className="text-[17px] font-extrabold text-brand-ink">发挥创意，定制角色</div>
          <p className="mt-1.5 text-[13px] font-semibold leading-relaxed text-[#6B7280]">
            创建专属于你的角色，设计独特的体验任务，与社区分享你的创意！
          </p>
          <button
            onClick={() => setView('create')}
            className="press mt-4 flex items-center gap-1.5 rounded-full bg-brand-purple px-4 py-2.5 text-[14px] font-extrabold text-white shadow-[0_3px_0_#A568CC]"
          >
            <Plus size={17} strokeWidth={3} />
            创建新角色
          </button>
        </div>

        <h3 className="mt-6 text-[17px] font-extrabold text-brand-ink">社区作品</h3>
        <div className="mt-3 space-y-3">
          {all.map((r) => (
            <div key={r.id} className="card p-5">
              <div className="flex items-start gap-3">
                <span className="text-3xl">{r.emoji}</span>
                <div className="min-w-0 flex-1">
                  <div className="text-[16px] font-extrabold text-brand-ink">{r.name}</div>
                  <div className="mt-1 text-[13px] font-semibold leading-relaxed text-[#6B7280]">{r.desc}</div>
                  <div className="mt-2 text-[11px] font-bold text-[#B0B7BD]">创建者：{r.author ?? '我'}</div>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {r.tasks.map((t, i) => (
                  <span
                    key={i}
                    className="rounded-lg bg-brand-soft px-2 py-1 text-[11px] font-semibold text-brand-sub"
                  >
                    {i + 1}. {t.text.length > 14 ? t.text.slice(0, 14) + '…' : t.text}
                  </span>
                ))}
              </div>
              <button
                onClick={() => onUseRole(r)}
                className="press mt-3 w-full rounded-xl border-2 border-[#E9D9FB] bg-white py-2.5 text-[13px] font-extrabold text-brand-purple"
              >
                使用此角色
              </button>
            </div>
          ))}
        </div>
      </div>
    </Screen>
  )
}

function CreateRole({
  onBack,
  onCreate,
  toast,
}: {
  onBack: () => void
  onCreate: (role: Role) => void
  toast: (m: string) => void
}) {
  const [emoji, setEmoji] = useState('🦊')
  const [name, setName] = useState('')
  const [desc, setDesc] = useState('')
  const [tasks, setTasks] = useState(['', '', ''])

  const submit = () => {
    if (!name.trim() || !desc.trim() || tasks.some((t) => !t.trim())) {
      toast('把名称、描述和三项任务都填完吧～')
      return
    }
    onCreate({
      id: `custom-${Date.now()}`,
      emoji,
      name: name.trim(),
      desc: desc.trim(),
      tags: ['自定义'],
      tasks: tasks.map((t) => ({ text: t.trim() })),
      author: '我',
      custom: true,
    })
    toast('角色创建成功！')
  }

  return (
    <Screen>
      <div className="sticky top-0 z-30 border-b border-brand-line bg-white/95 backdrop-blur">
        <div className="flex items-center gap-2 px-4 pt-3">
          <button onClick={onBack} className="press flex h-10 w-10 items-center justify-center rounded-full">
            <ArrowLeft size={22} strokeWidth={2.6} />
          </button>
          <span className="text-sm font-bold text-brand-sub">返回</span>
          <button
            onClick={submit}
            className="press ml-auto rounded-full bg-brand-green px-4 py-2 text-[13px] font-extrabold text-white shadow-[0_3px_0_#46A302]"
          >
            创建
          </button>
        </div>
        <div className="px-5 pb-4 pt-2">
          <h1 className="text-2xl font-extrabold text-brand-ink">创建新角色</h1>
        </div>
      </div>

      <div className="space-y-5 px-5 pb-12 pt-5">
        <div>
          <div className="mb-2 text-[13px] font-extrabold text-[#6B7280]">角色图标</div>
          <div className="grid grid-cols-8 gap-2">
            {EMOJIS.map((e) => (
              <button
                key={e}
                onClick={() => setEmoji(e)}
                className={`flex h-10 items-center justify-center rounded-xl text-xl transition ${
                  emoji === e ? 'bg-[#EAFBE7] ring-2 ring-brand-green' : 'bg-brand-soft'
                }`}
              >
                {e}
              </button>
            ))}
          </div>
        </div>

        <Input label="角色名称" value={name} onChange={setName} placeholder="例如：咖啡店老板" />
        <Input
          label="角色描述"
          value={desc}
          onChange={setDesc}
          placeholder="描述这个角色的特点和意义"
          multiline
        />

        <div>
          <div className="mb-2 text-[13px] font-extrabold text-[#6B7280]">三项任务</div>
          <div className="space-y-2.5">
            {tasks.map((t, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-soft text-[12px] font-extrabold text-brand-sub">
                  {i + 1}
                </span>
                <input
                  value={t}
                  onChange={(e) => setTasks(tasks.map((x, j) => (j === i ? e.target.value : x)))}
                  placeholder={`任务 ${i + 1}`}
                  className="w-full rounded-xl border border-brand-line px-3 py-2.5 text-[14px] font-semibold text-brand-ink outline-none placeholder:font-medium placeholder:text-[#B0B7BD] focus:border-brand-blue"
                />
              </div>
            ))}
          </div>
        </div>

        <button onClick={submit} className="btn-primary mt-2">
          创建角色
        </button>
        <p className="text-center text-[12px] font-medium text-[#B0B7BD]">
          创建后可在「角色工坊」和「热门角色」中随时使用
        </p>
      </div>
    </Screen>
  )
}

function Input({
  label,
  value,
  onChange,
  placeholder,
  multiline,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder: string
  multiline?: boolean
}) {
  return (
    <div>
      <div className="mb-2 text-[13px] font-extrabold text-[#6B7280]">{label}</div>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          placeholder={placeholder}
          className="w-full resize-none rounded-2xl border border-brand-line px-3.5 py-3 text-[14px] font-semibold text-brand-ink outline-none placeholder:font-medium placeholder:text-[#B0B7BD] focus:border-brand-blue"
        />
      ) : (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-2xl border border-brand-line px-3.5 py-3 text-[14px] font-semibold text-brand-ink outline-none placeholder:font-medium placeholder:text-[#B0B7BD] focus:border-brand-blue"
        />
      )}
    </div>
  )
}
