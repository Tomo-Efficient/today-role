'use client';

import { useState, useEffect } from 'react';
import RoleCard from '@/components/RoleCard';
import TaskList from '@/components/TaskList';
import { getTodaysRoleSequence } from '@/lib/roles';
import { getStoredProgress, saveProgress } from '@/lib/storage';
import { Role, UserProgress } from '@/types';

// 生成简单的用户ID（实际应用中应从登录系统获取）
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
  const [isNewDay, setIsNewDay] = useState(false);
  const [isSwapping, setIsSwapping] = useState(false);

  // 初始化用户ID和角色序列
  useEffect(() => {
    const id = generateUserId();
    setUserId(id);

    const sequence = getTodaysRoleSequence(id);
    setRoleSequence(sequence);
    setCurrentRoleIndex(0);
  }, []);

  // 根据当前角色索引加载进度
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
        shared: false
      });
    }
  }, [roleSequence, currentRoleIndex]);

  // 计算更换次数（当前索引即为更换次数）
  const swapCount = currentRoleIndex;

  // 更换角色
  const handleSwapRole = () => {
    if (swapCount >= 3 || isSwapping || currentRoleIndex >= roleSequence.length - 1) return;

    setIsSwapping(true);

    // 模拟网络延迟，让切换有更好的视觉效果
    setTimeout(() => {
      setCurrentRoleIndex(prev => prev + 1);
      setIsSwapping(false);
    }, 300);
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
  };

  // 分享功能
  const handleShare = async () => {
    if (!roleSequence[currentRoleIndex] || !progress) return;

    const currentRole = roleSequence[currentRoleIndex];
    const completedCount = progress.completedTasks.filter(Boolean).length;
    const shareText = `🎭 今日角色：${currentRole.title}\n${currentRole.description}\n完成进度：${completedCount}/${currentRole.tasks.length}个任务\n\n—— 来自「今日角色」应用`;

    try {
      await navigator.clipboard.writeText(shareText);
      alert('✅ 分享内容已复制到剪贴板！');

      const newProgress = { ...progress, shared: true };
      setProgress(newProgress);
      saveProgress(currentRole.id, newProgress);
    } catch (error) {
      console.error('分享失败:', error);
      alert('⚠️ 无法复制到剪贴板，请手动复制以下内容：\n\n' + shareText);
    }
  };

  // 重置当前角色进度
  const handleReset = () => {
    if (roleSequence[currentRoleIndex] && progress && typeof window !== 'undefined') {
      const newProgress: UserProgress = {
        completedTasks: new Array(roleSequence[currentRoleIndex].tasks.length).fill(false),
        shared: false
      };
      setProgress(newProgress);
      saveProgress(roleSequence[currentRoleIndex].id, newProgress);
      alert('🔄 当前角色进度已重置！');
    }
  };

  // 加载状态
  if (roleSequence.length === 0 || !progress) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500 mb-4"></div>
        <p className="text-gray-600 animate-pulse">正在为你生成今日角色...</p>
      </div>
    );
  }

  const currentRole = roleSequence[currentRoleIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
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

        {/* 日期和更换次数显示 */}
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

          {swapCount > 0 && (
            <div className="px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-sm border border-amber-200">
              已更换 {swapCount} 次
            </div>
          )}
        </div>
      </header>

      <main className="max-w-2xl mx-auto">
        {/* 角色卡片区域 */}
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

        {/* 统计信息 */}
        <div className="mt-8 grid grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <div className="text-2xl font-bold text-gray-800">
              {progress.completedTasks.filter(Boolean).length}
            </div>
            <div className="text-sm text-gray-500 mt-1">已完成任务</div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <div className="text-2xl font-bold text-gray-800">
              {currentRole.tasks.length}
            </div>
            <div className="text-sm text-gray-500 mt-1">总任务数</div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <div className="text-2xl font-bold text-gray-800">
              {3 - swapCount}
            </div>
            <div className="text-sm text-gray-500 mt-1">剩余更换次数</div>
          </div>
        </div>

        {/* 使用提示 */}
        <div className="mt-12 text-center text-gray-500 text-sm space-y-2">
          <p className="flex items-center justify-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            💡 点击任务前的圆圈标记完成
          </p>
          <p className="flex items-center justify-center gap-2">
            <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
            ✨ 不喜欢当前角色？可使用3次更换机会
          </p>
          <p className="flex items-center justify-center gap-2">
            <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
            📱 所有数据仅保存在本地浏览器中
          </p>
        </div>
      </main>
    </div>
  );
}