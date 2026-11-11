import type { DB, Post, User } from '../types'

const KEY = 'juese-manghe:db:v1'

export const SEED_POSTS: Post[] = [
  {
    id: 'p1',
    author: '小猫咪爱咖啡',
    roleEmoji: '🐱',
    roleName: '猫咖咖啡馆的店长',
    content:
      '今天体验猫咖店长的角色，发现慢下来观察世界真的很美妙。学会了用猫的视角看待生活，一切都变得温柔了起来。推荐大家都来试试这个角色！',
    tags: ['治愈', '慢生活'],
    likes: 234,
    comments: 45,
    shares: 12,
    timeLabel: '2小时前',
  },
  {
    id: 'p2',
    author: '街头艺术家小王',
    roleEmoji: '🎨',
    roleName: '街头涂鸦艺术家',
    content:
      '用色彩表达内心，在城市的角落留下自己的印记。今天完成了第一幅涂鸦，虽然只是简单的速写，但那种创作的自由感太棒了！',
    tags: ['艺术', '创作'],
    likes: 567,
    comments: 89,
    shares: 34,
    timeLabel: '5小时前',
  },
  {
    id: 'p3',
    author: '书店守护者',
    roleEmoji: '📚',
    roleName: '独立书店的老板',
    content:
      '安静地坐在书店里，为每一位客人推荐最适合他们的书。这种连接人与书的感觉真的很奇妙，仿佛成为了知识的摆渡人。',
    tags: ['阅读', '分享'],
    likes: 432,
    comments: 67,
    shares: 23,
    timeLabel: '昨天',
  },
  {
    id: 'p4',
    author: '植物语者',
    roleEmoji: '🌱',
    roleName: '植物园管理员',
    content:
      '照顾植物的过程就是和生命对话。今天观察到一株小苗破土而出，那种生命力让我重新思考了成长的意义。',
    tags: ['自然', '成长'],
    likes: 198,
    comments: 34,
    shares: 8,
    timeLabel: '昨天',
  },
  {
    id: 'p5',
    author: '夜班电台',
    roleEmoji: '📻',
    roleName: '深夜电台主播',
    content:
      '凌晨一点，戴上耳机对着空气说了一段话。原来有些话，不需要有人听也可以说完。这大概就是深夜电台存在的意义。',
    tags: ['治愈', '独处'],
    likes: 321,
    comments: 52,
    shares: 19,
    timeLabel: '2天前',
  },
  {
    id: 'p6',
    author: '三行诗收集人',
    roleEmoji: '🚌',
    roleName: '公交诗人',
    content: '在回家的9路车上写了三行诗：窗玻璃上是别人的脸，我的脸在擦肩而过，城市这么挤，我们却各有各的空。',
    tags: ['诗意', '日常'],
    likes: 689,
    comments: 103,
    shares: 57,
    timeLabel: '3天前',
  },
]

export const DEFAULT_DB: DB = {
  user: null,
  customRoles: [],
  days: {},
  posts: SEED_POSTS,
  comments: {},
}

export function loadDB(): DB {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return { ...DEFAULT_DB }
    const parsed = JSON.parse(raw) as Partial<DB>
    return {
      user: parsed.user ?? null,
      customRoles: parsed.customRoles ?? [],
      days: parsed.days ?? {},
      posts: parsed.posts?.length ? parsed.posts : SEED_POSTS,
      comments: parsed.comments ?? {},
    }
  } catch {
    return { ...DEFAULT_DB }
  }
}

export function saveDB(db: DB) {
  try {
    localStorage.setItem(KEY, JSON.stringify(db))
  } catch {
    /* 忽略配额错误 */
  }
}

export function makeGuest(): User {
  return { id: `guest-${Math.random().toString(36).slice(2, 8)}`, name: '体验用户', guest: true }
}

/** 本地账号：邮箱 → 稳定 id，便于同一邮箱换设备也保持同一角色序列 */
export function userIdOf(email: string): string {
  return `u-${email.trim().toLowerCase()}`
}
