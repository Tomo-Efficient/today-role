import { UserProgress } from '@/types';

const STORAGE_KEY = 'today-role-progress';
const SWAP_HISTORY_KEY = 'today-role-swap-history';

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