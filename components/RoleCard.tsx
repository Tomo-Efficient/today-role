'use client';

import { Role, UserProgress } from '@/types';
import { motion } from 'framer-motion';
import SwapButton from './SwapButton';

interface RoleCardProps {
  role: Role;
  progress: UserProgress;
  onShare: () => void;
  onSwap?: () => void; // 新增：更换角色回调
  swapCount?: number; // 新增：已更换次数
  isSwapping?: boolean; // 新增：是否正在更换
}

export default function RoleCard({
  role,
  progress,
  onShare,
  onSwap,
  swapCount = 0,
  isSwapping = false
}: RoleCardProps) {
  const completedCount = progress.completedTasks.filter(Boolean).length;
  const progressPercent = (completedCount / role.tasks.length) * 100;

  return (
    <motion.div
      key={role.id} // 添加key确保角色切换时有动画
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { type: "spring", stiffness: 300, damping: 25 }
      }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={`mb-6 rounded-2xl border-2 ${role.color} p-6 shadow-lg relative overflow-hidden`}
    >
      {/* 背景装饰元素 */}
      <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
        <div className="text-6xl">{role.emoji}</div>
      </div>

      {/* 角色标题区 */}
      <div className="flex items-start justify-between mb-4 relative z-10">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <motion.span
              className="text-3xl"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 5 }}
            >
              {role.emoji}
            </motion.span>
            <div>
              <span className="inline-block px-3 py-1 bg-white/80 backdrop-blur-sm rounded-full text-xs font-medium text-gray-700">
                {role.category}
              </span>
            </div>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 leading-tight">
            {role.title}
          </h2>
        </div>

        {/* 分享按钮 */}
        <button
          onClick={onShare}
          disabled={progress.shared || isSwapping}
          className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition-all ${
            progress.shared
              ? 'bg-green-100 text-green-600'
              : 'bg-white/80 backdrop-blur-sm hover:bg-white text-gray-700 hover:shadow-lg'
          } border shadow-sm`}
          title={progress.shared ? "已分享" : "分享今日角色"}
        >
          {progress.shared ? '✅' : '↗️'}
        </button>
      </div>

      {/* 角色描述 */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-gray-700 text-lg mb-6 leading-relaxed relative z-10"
      >
        {role.description}
      </motion.p>

      {/* 进度条 */}
      <div className="mb-4 relative z-10">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>今日进度</span>
          <span>{completedCount}/{role.tasks.length}</span>
        </div>
        <div className="h-2 bg-white/50 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-blue-400 to-purple-500 rounded-full"
          />
        </div>
      </div>

      {/* 更换角色按钮区域 */}
      {onSwap && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="relative z-10"
        >
          <SwapButton
            onSwap={onSwap}
            swapCount={swapCount}
            isSwapping={isSwapping}
          />
        </motion.div>
      )}

      {/* 完成提示 */}
      {completedCount === role.tasks.length && (
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="mt-4 p-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl"
        >
          <p className="text-green-700 font-medium text-center">
            🎉 恭喜！你已完整体验今日角色！
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}