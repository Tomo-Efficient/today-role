'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import RoleCard from '@/components/RoleCard';
import TaskList from '@/components/TaskList';
import AchievementsPanel from '@/components/AchievementsPanel';
import HistoryPanel, { HistoryEntry } from '@/components/HistoryPanel';
import ShareImageModal from '@/components/ShareImageModal';
import { getTodaysRoleSequence, roleLibrary } from '@/lib/roles';
import {
  getStoredProgress,
  saveProgress,
  saveTaskNote,
  getUserStats,
  updateUserStats,
  getAchievements,
  getAllHistory
} from '@/lib/storage';
import { Role, UserProgress, UserStats, Achievement } from '@/types';

// 生成用户ID（保持不变）
function generateUserId() {
  if (typeof window === 'undefined') return 'default';
  let userId = localStorage.getItem('today-role-user-id');
  if (!userId) {
    userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('today-role-user-id', userId);
  }
  return userId;
}

export default function HomePage() {
  const [roleSequence, setRoleSequence] = useState<Role[]>([]);
  const [currentRoleIndex, setCurrentRoleIndex] = useState<number>(0);
  const [userId, setUserId] = useState<string>('default');
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isNewDay, setIsNewDay] = useState(false);
  const [isSwapping, setIsSwapping] = useState(false);

  // 新增状态
  const [showAchievements, setShowAchievements] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'info' | 'warning';
  } | null>(null);

  // 初始化
  useEffect(() => {
    const id = generateUserId();
    setUserId(id);

    const sequence = getTodaysRoleSequence(id);
    setRoleSequence(sequence);
    setCurrentRoleIndex(0);

    // 加载用户统计和成就
    setUserStats(getUserStats(id));
    setAchievements(getAchievements(id));
  }, []);

  // 加载当前角色进度
  useEffect(() => {
    if (roleSequence.length === 0 || currentRoleIndex >= roleSequence.length) return;

    const currentRole = roleSequence[currentRoleIndex];
    const stored = getStoredProgress(currentRole.id);

    if (stored) {
      setProgress(stored);
      const lastDate = new Date(stored.completedAt || '');
      const today = new Date();
      if (lastDate.toDateString() !== today.toDateString()) {
        setIsNewDay(true);
      }
    } else {
      setProgress({
        completedTasks: new Array(currentRole.tasks.length).fill(false),
        shared: false,
        notes: []
      });
    }
  }, [roleSequence, currentRoleIndex]);

  // 显示通知
  const showNotification = (message: string, type: 'success' | 'info' | 'warning' = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // 更新任务完成状态
  const updateTask = (taskIndex: number, completed: boolean) => {
    if (!roleSequence[currentRoleIndex] || !progress) return;

    const newCompleted = [...progress.completedTasks];
    newCompleted[taskIndex] = completed;

    const newProgress: UserProgress = {
      ...progress,
      completedTasks: newCompleted
    };

    setProgress(newProgress);
    saveProgress(roleSequence[currentRoleIndex].id, newProgress);

    // 更新用户统计
    if (completed) {
      updateUserStats(userId, {
        totalTasksCompleted: (userStats?.totalTasksCompleted || 0) + 1
      });

      // 检查是否完成所有任务（解锁"完美一日"成就）
      const allCompleted = newCompleted.every(task => task);
      if (allCompleted) {
        updateUserStats(userId, {
          totalDays: (userStats?.totalDays || 0) + 1
        });
        unlockAchievement('perfect_day');
        showNotification('🎉 恭喜完成今日所有任务！解锁"完美一日"成就', 'success');
      }
    }

    // 更新本地状态
    setUserStats(getUserStats(userId));
    setAchievements(getAchievements(userId));
  };

  // 保存任务心得
  const handleSaveNote = (taskIndex: number, note: string) => {
    if (!roleSequence[currentRoleIndex]) return;

    saveTaskNote(roleSequence[currentRoleIndex].id, taskIndex, note);

    // 更新本地进度状态
    if (progress) {
      const newNotes = [...(progress.notes || [])];
      newNotes[taskIndex] = note;
      setProgress({
        ...progress,
        notes: newNotes
      });
    }

    showNotification('心得已保存', 'success');
  };

  // 更换角色
  const handleSwapRole = () => {
    if (swapCount >= 3 || isSwapping || currentRoleIndex >= roleSequence.length - 1) return;

    setIsSwapping(true);

    setTimeout(() => {
      setCurrentRoleIndex(prev => prev + 1);
      setIsSwapping(false);

      // 更新角色体验统计
      updateUserStats(userId, {
        totalRolesExperienced: (userStats?.totalRolesExperienced || 0) + 1
      });
    }, 300);
  };

  // 解锁成就
  const unlockAchievement = (achievementId: string) => {
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

    setAchievements(updatedAchievements);
    localStorage.setItem(
      `today-role-achievements-${userId}`,
      JSON.stringify(updatedAchievements)
    );
  };

  // 分享功能
  const handleShare = () => {
    setShowShareModal(true);
  };

  const handleActualShare = async (imageUrl: string) => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: '我的今日角色体验',
          text: `🎭 今日体验了「${roleSequence[currentRoleIndex].title}」角色！`,
          url: imageUrl
        });
      } else {
        await navigator.clipboard.writeText(
          `🎭 今日角色：${roleSequence[currentRoleIndex].title}\n` +
          `${roleSequence[currentRoleIndex].description}\n` +
          `完成进度：${progress?.completedTasks.filter(Boolean).length}/${roleSequence[currentRoleIndex].tasks.length}个任务`
        );
        showNotification('分享内容已复制到剪贴板！', 'success');
      }

      // 标记为已分享
      if (progress) {
        const newProgress = { ...progress, shared: true };
        setProgress(newProgress);
        saveProgress(roleSequence[currentRoleIndex].id, newProgress);
      }
    } catch (error) {
      console.error('分享失败:', error);
      showNotification('分享失败，请重试', 'warning');
    }
  };

  // 重置当前角色进度
  const handleReset = () => {
    if (roleSequence[currentRoleIndex] && progress) {
      const newProgress: UserProgress = {
        completedTasks: new Array(roleSequence[currentRoleIndex].tasks.length).fill(false),
        shared: false,
        notes: []
      };
      setProgress(newProgress);
      saveProgress(roleSequence[currentRoleIndex].id, newProgress);
      showNotification('当前角色进度已重置！', 'info');
    }
  };

  const swapCount = currentRoleIndex;

  if (roleSequence.length === 0 || !progress || !userStats) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500 mb-4"></div>
        <p className="text-gray-600 animate-pulse">正在为你生成今日角色...</p>
      </div>
    );
  }

  const currentRole = roleSequence[currentRoleIndex];
  const completedCount = progress.completedTasks.filter(Boolean).length;
  const totalTasks = currentRole.tasks.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      {/* 通知 */}
      {notification && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-lg shadow-lg max-w-md w-full ${
            notification.type === 'success'
              ? 'bg-green-50 border border-green-200 text-green-700'
              : notification.type === 'warning'
              ? 'bg-amber-50 border border-amber-200 text-amber-700'
              : 'bg-blue-50 border border-blue-200 text-blue-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <span>{notification.message}</span>
            <button onClick={() => setNotification(null)} className="ml-4">
              ✕
            </button>
          </div>
        </motion.div>
      )}

      {/* 顶部导航 */}
      <header className="max-w-2xl mx-auto mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              今日角色
            </h1>
            <p className="text-gray-600 mt-1">每天一个身份，体验别样人生</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowAchievements(true)}
              className="px-3 py-1 text-sm text-gray-600 hover:text-amber-600 bg-white border border-gray-200 rounded-lg hover:shadow transition-shadow flex items-center gap-1"
              title="查看成就"
            >
              <span>🏆</span>
              <span>{achievements.filter(a => a.unlocked).length}/{achievements.length}</span>
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 bg-white border border-gray-200 rounded-lg hover:shadow transition-shadow"
              title="刷新页面"
            >
              🔄
            </button>
            <button
              onClick={handleReset}
              className="px-3 py-1 text-sm text-gray-600 hover:text-red-600 bg-white border border-gray-200 rounded-lg hover:shadow transition-shadow"
              title="重置当前角色进度"
            >
              ⏱️
            </button>
          </div>
        </div>

        {/* 统计信息栏 */}
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <div className="px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm">
            <span className="text-gray-700 font-medium">
              {new Date().toLocaleDateString('zh-CN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
          </div>

          <div className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm border border-blue-200 flex items-center gap-1">
            <span>🔥</span>
            <span>连续{userStats.consecutiveDays}天</span>
          </div>

          {swapCount > 0 && (
            <div className="px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-sm border border-amber-200">
              已更换 {swapCount} 次
            </div>
          )}

          <div className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm border border-green-200">
            {completedCount}/{totalTasks} 任务
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto">
        {/* 角色卡片 */}
        <RoleCard
          role={currentRole}
          progress={progress}
          onShare={handleShare}
          onSwap={handleSwapRole}
          swapCount={swapCount}
          isSwapping={isSwapping}
        />

        {/* 任务列表 */}
        <TaskList
          role={currentRole}
          progress={progress}
          onTaskUpdate={updateTask}
          onSaveNote={handleSaveNote}
        />

        {/* 新一天提示 */}
        {isNewDay && (
          <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl">
            <div className="flex items-center gap-3">
              <span className="text-2xl">✨</span>
              <div>
                <p className="text-blue-800 font-medium">新的一天开始了！</p>
                <p className="text-blue-600 text-sm mt-1">
                  今日角色已刷新，开启全新的体验之旅吧~
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 行动按钮组 */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => setShowShareModal(true)}
            className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:opacity-90 transition-opacity flex flex-col items-center justify-center"
          >
            <span className="text-2xl mb-2">🖼️</span>
            <span className="font-medium">生成分享图</span>
            <span className="text-sm opacity-90 mt-1">记录精彩时刻</span>
          </button>

          <button
            onClick={() => setShowAchievements(true)}
            className="p-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl hover:opacity-90 transition-opacity flex flex-col items-center justify-center"
          >
            <span className="text-2xl mb-2">🏆</span>
            <span className="font-medium">查看成就</span>
            <span className="text-sm opacity-90 mt-1">
              {achievements.filter(a => a.unlocked).length}项已解锁
            </span>
          </button>

          <button
            onClick={() => setShowHistory(true)}
            className="p-4 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl hover:opacity-90 transition-opacity flex flex-col items-center justify-center"
          >
            <span className="text-2xl mb-2">📜</span>
            <span className="font-medium">体验历史</span>
            <span className="text-sm opacity-90 mt-1">回顾成长轨迹</span>
          </button>
        </div>

        {/* 使用提示 */}
        <div className="mt-12 text-center text-gray-500 text-sm space-y-2">
          <p className="flex items-center justify-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            💡 完成任务后可记录心得
          </p>
          <p className="flex items-center justify-center gap-2">
            <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
            🖼️ 生成精美分享图，保存珍贵瞬间
          </p>
          <p className="flex items-center justify-center gap-2">
            <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
            🏆 连续体验解锁更多成就
          </p>
        </div>
      </main>

      {/* 成就面板 */}
      {showHistory && (
        <HistoryPanel
          entries={getAllHistory(userId)
            .map((item) => {
              const role = roleLibrary.find((r) => r.id === item.roleId);
              if (!role) return null;
              return {
                role,
                date: item.date,
                done: item.progress.completedTasks.filter(Boolean).length,
                notes: (item.progress.notes || []).filter(Boolean),
              } as HistoryEntry;
            })
            .filter((item): item is HistoryEntry => item !== null)}
          onClose={() => setShowHistory(false)}
        />
      )}

      {showAchievements && (
        <AchievementsPanel
          achievements={achievements}
          onClose={() => setShowAchievements(false)}
        />
      )}

      {/* 分享图生成模态框 */}
      {showShareModal && (
        <ShareImageModal
          role={currentRole}
          progress={progress}
          notes={progress.notes || []}
          onClose={() => setShowShareModal(false)}
          onShare={handleActualShare}
        />
      )}
    </div>
  );
}