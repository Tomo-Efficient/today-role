export interface Role {
  id: number;
  title: string;
  description: string;
  tasks: string[];
  emoji: string;
  color: string;
  category?: string;
}

export interface UserProgress {
  completedTasks: boolean[];
  completedAt?: Date;
  shared: boolean;
  notes?: string[]; // 每个任务的心得记录
}

export interface RoleSwapRecord {
  timestamp: string;
  fromRoleId: number;
  toRoleId: number;
}

// 新增：成就系统相关类型
export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: Date;
  progress?: {
    current: number;
    target: number;
  };
}

export interface UserStats {
  totalDays: number;
  consecutiveDays: number;
  lastActiveDate: string;
  totalTasksCompleted: number;
  totalRolesExperienced: number;
  achievements: Achievement[];
}

// 新增：分享图配置
export interface ShareImageConfig {
  role: Role;
  progress: UserProgress;
  notes?: string[];
  date: string;
  userName?: string;
  theme?: 'light' | 'dark';
}