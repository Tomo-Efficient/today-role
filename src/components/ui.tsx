import { type ReactNode, useEffect } from 'react'
import { ArrowLeft, X } from 'lucide-react'

export function Screen({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen w-full justify-center bg-white">
      <div className="w-full max-w-[460px] bg-white">
        {children}
      </div>
    </div>
  )
}

export function BackHeader({
  title,
  subtitle,
  icon,
  tone = 'blue',
  onBack,
}: {
  title: string
  subtitle?: string
  icon?: ReactNode
  tone?: 'blue' | 'purple' | 'yellow' | 'red' | 'green'
  onBack: () => void
}) {
  const tones: Record<string, string> = {
    blue: 'bg-brand-blue',
    purple: 'bg-brand-purple',
    yellow: 'bg-brand-yellow',
    red: 'bg-brand-red',
    green: 'bg-brand-green',
  }
  return (
    <div className="sticky top-0 z-30 border-b border-brand-line bg-white/95 backdrop-blur">
      <div className="flex items-center px-3 pt-3">
        <button
          onClick={onBack}
          data-testid="back"
          className="press flex items-center gap-2 rounded-full py-2 pl-2 pr-4 text-brand-ink"
          aria-label="返回"
        >
          <ArrowLeft size={22} strokeWidth={2.6} />
          <span className="text-sm font-bold text-brand-sub">返回</span>
        </button>
      </div>
      <div className="flex items-center gap-3 px-5 pb-4 pt-1">
        {icon && (
          <div className={`flex h-14 w-14 items-center justify-center rounded-2xl text-white ${tones[tone]}`}>
            {icon}
          </div>
        )}
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-brand-ink">{title}</h1>
          {subtitle && <p className="mt-0.5 text-sm font-medium text-brand-sub">{subtitle}</p>}
        </div>
      </div>
    </div>
  )
}

export function ProgressBar({ value, max, tone = 'green' }: { value: number; max: number; tone?: 'green' | 'blue' }) {
  const pct = max ? Math.min(100, (value / max) * 100) : 0
  return (
    <div className="h-3 w-full overflow-hidden rounded-full bg-[#EDEDED]">
      <div
        className={`h-full rounded-full transition-all duration-500 ${tone === 'green' ? 'bg-brand-green' : 'bg-brand-blue'}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}

export function Sheet({
  open,
  onClose,
  children,
  title,
}: {
  open: boolean
  onClose: () => void
  children: ReactNode
  title?: string
}) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="animate-floatIn relative w-full max-w-[430px] rounded-t-[28px] bg-white shadow-pop">
        <div className="flex items-center justify-between px-5 pb-2 pt-4">
          <h3 className="text-lg font-extrabold text-brand-ink">{title}</h3>
          <button onClick={onClose} className="press rounded-full p-2 text-brand-sub" aria-label="关闭">
            <X size={20} strokeWidth={2.6} />
          </button>
        </div>
        <div className="max-h-[76vh] overflow-y-auto px-5 pb-8">{children}</div>
      </div>
    </div>
  )
}

export function Toast({ message }: { message: string | null }) {
  if (!message) return null
  return (
    <div className="pointer-events-none fixed bottom-8 left-1/2 z-[60] -translate-x-1/2">
      <div className="animate-popIn rounded-2xl bg-brand-ink/92 px-5 py-3 text-sm font-bold text-white shadow-pop">
        {message}
      </div>
    </div>
  )
}

export function Stat({ value, label, tone = 'ink' }: { value: ReactNode; label: string; tone?: 'ink' | 'green' }) {
  return (
    <div className="flex-1 text-center">
      <div className={`text-2xl font-extrabold ${tone === 'green' ? 'text-brand-green' : 'text-brand-ink'}`}>{value}</div>
      <div className="mt-0.5 text-xs font-semibold text-brand-sub">{label}</div>
    </div>
  )
}
