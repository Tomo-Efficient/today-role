import { UserProgress, UserStats, Achievement } from '@/types';

const STORAGE_KEY = 'today-role-progress';
const SWAP_HISTORY_KEY = 'today-role-swap-history';
const USER_STATS_KEY = 'today-role-user-stats';
const ACHIEVEMENTS_KEY = 'today-role-achievements';

export function getStoredProgress(roleId: number): UserProgress | null {
  if (typeof window === 'undefined') return null;

  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return null;

  const allProgress = JSON.parse(data);
  return allProgress[roleId] || null;
}

export function saveProgress(roleId: number, progress: UserProgress): void {
  if (typeof window === 'undefined') return;

  const data = localStorage.getItem(STORAGE_KEY);
  const allProgress = data ? JSON.parse(data) : {};

  allProgress[roleId] = {
    ...progress,
    completedAt: new Date().toISOString()
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(allProgress));
}

// 记录角色更换历史
export function recordRoleSwap(userId: string, fromRoleId: number, toRoleId: number): void {
  if (typeof window === 'undefined') return;

  const today = new Date().toISOString().split('T')[0];
  const key = `${SWAP_HISTORY_KEY}-${userId}-${today}`;

  const history = localStorage.getItem(key);
  const swapHistory = history ? JSON.parse(history) : [];

  swapHistory.push({
    timestamp: new Date().toISOString(),
    fromRoleId,
    toRoleId
  });

  localStorage.setItem(key, JSON.stringify(swapHistory));
}

// 获取今日更换记录
export function getTodaySwapCount(userId: string): number {
  if (typeof window === 'undefined') return 0;

  const today = new Date().toISOString().split('T')[0];
  const key = `${SWAP_HISTORY_KEY}-${userId}-${today}`;

  const history = localStorage.getItem(key);
  if (!history) return 0;

  const swapHistory = JSON.parse(history);
  return swapHistory.length;
}

export function clearProgress(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}

// 新增：用户统计功能
export function getUserStats(userId: string = 'default'): UserStats {
  if (typeof window === 'undefined') return getDefaultStats();

  const key = `${USER_STATS_KEY}-${userId}`;
  const data = localStorage.getItem(key);

  if (!data) return getDefaultStats();

  const stats = JSON.parse(data);
  return {
    ...stats,
    lastActiveDate: stats.lastActiveDate || new Date().toISOString()
  };
}

export function updateUserStats(userId: string = 'default', updates: Partial<UserStats>): void {
  if (typeof window === 'undefined') return;

  const key = `${USER_STATS_KEY}-${userId}`;
  const currentStats = getUserStats(userId);

  const today = new Date().toISOString().split('T')[0];
  const lastDate = currentStats.lastActiveDate.split('T')[0];

  // 更新连续天数
  let consecutiveDays = currentStats.consecutiveDays;
  if (today !== lastDate) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    if (lastDate === yesterdayStr) {
      consecutiveDays += 1;
    } else {
      consecutiveDays = 1;
    }
  }

  const newStats: UserStats = {
    ...currentStats,
    ...updates,
    consecutiveDays,
    lastActiveDate: new Date().toISOString()
  };

  localStorage.setItem(key, JSON.stringify(newStats));

  // 检查并解锁成就
  checkAndUnlockAchievements(userId, newStats);
}

function getDefaultStats(): UserStats {
  return {
    totalDays: 0,
    consecutiveDays: 0,
    lastActiveDate: new Date().toISOString(),
    totalTasksCompleted: 0,
    totalRolesExperienced: 0,
    achievements: getDefaultAchievements()
  };
}

// 新增：成就系统
export function getAchievements(userId: string = 'default'): Achievement[] {
  if (typeof window === 'undefined') return getDefaultAchievements();

  const key = `${ACHIEVEMENTS_KEY}-${userId}`;
  const data = localStorage.getItem(key);

  if (!data) return getDefaultAchievements();
  return JSON.parse(data);
}

export function unlockAchievement(userId: string, achievementId: string): void {
  if (typeof window === 'undefined') return;

  const key = `${ACHIEVEMENTS_KEY}-${userId}`;
  const achievements = getAchievements(userId);

  const updatedAchievements = achievements.map(achievement => {
    if (achievement.id === achievementId && !achievement.unlocked) {
      return {
        ...achievement,
        unlocked: true,
        unlockedAt: new Date()
      };
    }
    return achievement;
  });

  localStorage.setItem(key, JSON.stringify(updatedAchievements));
}

function checkAndUnlockAchievements(userId: string, stats: UserStats): void {
  const achievements = getAchievements(userId);

  // 检查各种成就条件
  achievements.forEach(achievement => {
    if (!achievement.unlocked) {
      let shouldUnlock = false;

      switch (achievement.id) {
        case 'first_step':
          shouldUnlock = stats.totalDays >= 1;
          break;
        case 'three_day_streak':
          shouldUnlock = stats.consecutiveDays >= 3;
          break;
        case 'week_explorer':
          shouldUnlock = stats.consecutiveDays >= 7;
          break;
        case 'task_master':
          shouldUnlock = (achievement.progress?.current || 0) >= 10;
          break;
        case 'role_collector':
          shouldUnlock = stats.totalRolesExperienced >= 5;
          break;
        case 'perfect_day':
          // 这个成就会在其他地方解锁
          break;
      }

      if (shouldUnlock) {
        unlockAchievement(userId, achievement.id);
      }
    }
  });
}

function getDefaultAchievements(): Achievement[] {
  return [
    {
      id: 'first_step',
      title: '初体验',
      description: '第一次完成角色体验',
      icon: '🌱',
      unlocked: false
    },
    {
      id: 'three_day_streak',
      title: '渐入佳境',
      description: '连续体验3天',
      icon: '🔥',
      unlocked: false,
      progress: { current: 0, target: 3 }
    },
    {
      id: 'week_explorer',
      title: '七日探秘者',
      description: '连续体验7天',
      icon: '🏆',
      unlocked: false,
      progress: { current: 0, target: 7 }
    },
    {
      id: 'task_master',
      title: '任务达人',
      description: '完成10个任务',
      icon: '✅',
      unlocked: false,
      progress: { current: 0, target: 10 }
    },
    {
      id: 'role_collector',
      title: '角色收藏家',
      description: '体验过5种不同角色',
      icon: '🎭',
      unlocked: false
    },
    {
      id: 'perfect_day',
      title: '完美一日',
      description: '一天内完成所有任务',
      icon: '🌟',
      unlocked: false
    }
  ];
}

// 新增：保存任务心得
export function saveTaskNote(roleId: number, taskIndex: number, note: string): void {
  if (typeof window === 'undefined') return;

  const progress = getStoredProgress(roleId);
  if (!progress) return;

  const notes = progress.notes || [];
  notes[taskIndex] = note;

  saveProgress(roleId, {
    ...progress,
    notes
  });
}

// 新增：获取所有历史记录
export function getAllHistory(userId: string = 'default'): Array<{
  roleId: number;
  date: string;
  progress: UserProgress;
}> {
  if (typeof window === 'undefined') return [];

  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return [];

  const allProgress = JSON.parse(data);
  return Object.entries(allProgress)
    .map(([roleId, progress]: [string, any]) => ({
      roleId: parseInt(roleId),
      date: progress.completedAt?.split('T')[0] || new Date().toISOString().split('T')[0],
      progress: progress as UserProgress
    }))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}