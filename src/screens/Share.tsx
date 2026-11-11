import { useEffect, useRef, useState } from 'react'
import { Download, Lightbulb, Palette, Share2 } from 'lucide-react'
import type { DayState, Role } from '../types'
import { BackHeader, Screen } from '../components/ui'
import { downloadShareImage, renderShareImage } from '../lib/share'

type StyleKey = 'classic' | 'color' | 'minimal'

const STYLES: { key: StyleKey; label: string; emoji: string; ring: string; bg: string }[] = [
  { key: 'color', label: '彩色风格', emoji: '🎨', ring: 'border-brand-green', bg: 'bg-[#EAFBE7]' },
  { key: 'minimal', label: '简约风格', emoji: '🌟', ring: 'border-brand-red', bg: 'bg-[#FFE9E9]' },
  { key: 'classic', label: '经典风格', emoji: '✨', ring: 'border-brand-blue', bg: 'bg-[#E0F5FF]' },
]

export function Share({
  role,
  day,
  dateLabel,
  onBack,
  onShared,
  toast,
}: {
  role: Role
  day: DayState
  dateLabel: string
  onBack: () => void
  onShared: (feeling: string) => void
  toast: (m: string) => void
}) {
  const [style, setStyle] = useState<StyleKey>('classic')
  const [preview, setPreview] = useState<string | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  const feeling =
    day.tasks
      .map((t) => t.note)
      .filter(Boolean)
      .join(' ') || '今天，我换了种活法。'

  useEffect(() => {
    const canvas = renderShareImage({
      role,
      done: day.tasks.map((t) => t.done),
      feeling,
      dateLabel,
      style,
    })
    canvasRef.current = canvas
    setPreview(canvas.toDataURL('image/png'))
  }, [role, day.tasks, feeling, dateLabel, style])

  const save = () => {
    if (!canvasRef.current) return
    downloadShareImage(canvasRef.current, `角色盲盒-${role.name}.png`)
    toast('分享图已保存到相册！')
  }

  return (
    <Screen>
      <BackHeader
        title="分享体验"
        subtitle="生成精美分享图"
        tone="purple"
        icon={<Share2 size={24} strokeWidth={2.6} />}
        onBack={onBack}
      />

      <div className="px-5 pb-12 pt-5">
        <div className="overflow-hidden rounded-[28px] border-2 border-[#EAF3F8] bg-white shadow-card">
          {preview ? (
            <img src={preview} alt="分享图预览" className="block w-full" />
          ) : (
            <div className="flex aspect-[3/4] items-center justify-center text-sm font-bold text-[#B0B7BD]">
              生成中…
            </div>
          )}
        </div>

        <button onClick={save} className="btn-primary mt-5">
          <Download size={20} strokeWidth={2.8} />
          保存到相册
        </button>

        <button
          onClick={() => {
            onShared(feeling)
            toast('已分享到社区！')
          }}
          className="btn-ghost mt-3"
        >
          <Share2 size={18} strokeWidth={2.6} />
          分享到社区
        </button>

        <div className="mt-5 flex items-start gap-2 rounded-2xl border-2 border-[#BEE7FF] bg-[#E0F5FF] px-4 py-3">
          <Lightbulb size={18} strokeWidth={2.4} className="mt-0.5 shrink-0 text-[#1899D6]" />
          <p className="text-[13px] font-bold leading-relaxed text-[#2B7DA8]">
            分享你的体验，让更多人发现这个有趣的角色！
          </p>
        </div>

        <h3 className="mt-7 flex items-center gap-2 text-[17px] font-extrabold text-brand-ink">
          <Palette size={18} strokeWidth={2.6} className="text-brand-purple" />
          更多分享样式
        </h3>
        <div className="mt-3 grid grid-cols-3 gap-3">
          {STYLES.map((s) => (
            <button
              key={s.key}
              onClick={() => setStyle(s.key)}
              className={`press flex h-[104px] flex-col items-center justify-center gap-1.5 rounded-2xl border-2 transition ${
                s.ring
              } ${s.bg} ${style === s.key ? 'ring-2 ring-offset-2 ring-brand-ink/10' : 'opacity-90'}`}
            >
              <span className="text-2xl">{s.emoji}</span>
              <span className="text-[12px] font-extrabold text-brand-ink">{s.label}</span>
            </button>
          ))}
        </div>
      </div>
    </Screen>
  )
}
