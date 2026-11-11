export type Task = {
  text: string
  hint?: string
}

export type Role = {
  id: string
  emoji: string
  name: string
  desc: string
  tasks: Task[]
  tags: string[]
  /** 自定义角色创建者 */
  author?: string
  custom?: boolean
}

export type TaskState = {
  done: boolean
  note: string
}

export type DayState = {
  /** YYYY-MM-DD */
  date: string
  roleId: string
  rerollsLeft: number
  tasks: TaskState[]
  submitted: boolean
  liked: boolean
  sharedToCommunity: boolean
}

export type Post = {
  id: string
  author: string
  roleEmoji: string
  roleName: string
  content: string
  tags: string[]
  likes: number
  comments: number
  shares: number
  timeLabel: string
  liked?: boolean
  mine?: boolean
}

export type User = {
  id: string
  name: string
  email?: string
  guest?: boolean
}

export type DB = {
  user: User | null
  customRoles: Role[]
  days: Record<string, DayState>
  posts: Post[]
  comments: Record<string, { id: string; author: string; text: string; timeLabel: string }[]>
}
