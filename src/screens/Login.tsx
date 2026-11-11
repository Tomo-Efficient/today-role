import { useState } from 'react'
import { ArrowRight, Lock, Mail, User as UserIcon } from 'lucide-react'
import type { User } from '../types'
import { Screen } from '../components/ui'
import { makeGuest, userIdOf } from '../lib/storage'

export function Login({ onLogin, toast }: { onLogin: (u: User) => void; toast: (m: string) => void }) {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')

  const submit = () => {
    if (!email.trim() || password.length < 6) {
      toast(mode === 'login' ? '请填写邮箱和至少 6 位密码' : '设置密码（至少6位）')
      return
    }
    onLogin({
      id: userIdOf(email),
      name: mode === 'register' && name.trim() ? name.trim() : email.split('@')[0],
      email: email.trim(),
    })
  }

  return (
    <Screen>
      <div className="flex min-h-[calc(100vh-48px)] flex-col justify-center px-6 py-10">
        <div className="animate-floatIn flex flex-col items-center">
          <div className="text-6xl" style={{ filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.12))' }}>
            🎭
          </div>
          <h1 className="mt-4 text-[34px] font-extrabold tracking-tight text-brand-ink">重开么</h1>
          <p className="mt-2 text-[15px] font-semibold text-brand-sub">每天开一个角色盲盒，用陌生人的眼睛过一天</p>
        </div>

        <div className="mt-9 flex rounded-2xl bg-brand-soft p-1">
          {(['login', 'register'] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`press flex-1 rounded-xl py-2.5 text-[15px] font-extrabold transition ${
                mode === m ? 'bg-white text-brand-ink shadow-card' : 'text-brand-sub'
              }`}
            >
              {m === 'login' ? '登录' : '注册'}
            </button>
          ))}
        </div>

        <div className="mt-6 space-y-4">
          {mode === 'register' && (
            <Field icon={<UserIcon size={19} strokeWidth={2.4} />} label="用户名">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="输入用户名"
                className="w-full bg-transparent text-[15px] font-semibold text-brand-ink outline-none placeholder:font-medium placeholder:text-[#B0B7BD]"
              />
            </Field>
          )}
          <Field icon={<Mail size={19} strokeWidth={2.4} />} label="邮箱">
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="输入邮箱"
              inputMode="email"
              className="w-full bg-transparent text-[15px] font-semibold text-brand-ink outline-none placeholder:font-medium placeholder:text-[#B0B7BD]"
            />
          </Field>
          <Field icon={<Lock size={19} strokeWidth={2.4} />} label="密码">
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="输入密码"
              className="w-full bg-transparent text-[15px] font-semibold text-brand-ink outline-none placeholder:font-medium placeholder:text-[#B0B7BD]"
            />
          </Field>
        </div>

        <button onClick={submit} className="btn-primary mt-7">
          {mode === 'login' ? '登录' : '注册'}
        </button>

        <button
          onClick={() => onLogin(makeGuest())}
          className="btn-ghost mt-4"
        >
          跳过登录，直接体验
          <ArrowRight size={19} strokeWidth={2.8} />
        </button>

        <p className="mt-7 text-center text-xs font-medium text-[#9AA0A6]">
          注册即表示同意
          <button onClick={() => toast('服务条款（演示占位）')} className="mx-1 font-bold text-brand-blue">
            服务条款
          </button>
          和
          <button onClick={() => toast('隐私政策（演示占位）')} className="mx-1 font-bold text-brand-blue">
            隐私政策
          </button>
        </p>
      </div>
    </Screen>
  )
}

function Field({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-2 text-[13px] font-extrabold text-[#6B7280]">{label}</div>
      <div className="flex items-center gap-3 rounded-2xl border-2 border-brand-line bg-white px-4 py-3.5 focus-within:border-brand-blue">
        <span className="text-[#9AA0A6]">{icon}</span>
        {children}
      </div>
    </div>
  )
}
