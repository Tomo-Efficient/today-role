'use client';

import { Achievement } from '@/types';
import { motion } from 'framer-motion';
import { useState } from 'react';

interface AchievementsPanelProps {
  achievements: Achievement[];
  onClose: () => void;
}

export default function AchievementsPanel({ achievements, onClose }: AchievementsPanelProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'unlocked' | 'locked'>('all');

  const filteredAchievements = achievements.filter(achievement => {
    if (activeTab === 'unlocked') return achievement.unlocked;
    if (activeTab === 'locked') return !achievement.unlocked;
    return true;
  });

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-hidden"
      >
        {/* 标题栏 */}
        <div className="p-6 border-b">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">成就系统</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100"
            >
              ✕
            </button>
          </div>

          {/* 进度条 */}
          <div className="mb-2">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>成就进度</span>
              <span>{unlockedCount}/{totalCount}</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(unlockedCount / totalCount) * 100}%` }}
                transition={{ duration: 1 }}
                className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"
              />
            </div>
          </div>

          {/* 标签页 */}
          <div className="flex gap-2">
            {[
              { id: 'all', label: '全部' },
              { id: 'unlocked', label: '已解锁' },
              { id: 'locked', label: '未解锁' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-100 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* 成就列表 */}
        <div className="p-6 overflow-y-auto max-h-[calc(80vh-180px)]">
          {filteredAchievements.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {activeTab === 'unlocked' ? '还没有解锁的成就' : '暂无成就'}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredAchievements.map((achievement) => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-xl border ${
                    achievement.unlocked
                      ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200'
                      : 'bg-gray-50 border-gray-200 opacity-70'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`text-2xl ${achievement.unlocked ? '' : 'opacity-50'}`}>
                      {achievement.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className={`font-bold ${achievement.unlocked ? 'text-gray-800' : 'text-gray-500'}`}>
                          {achievement.title}
                        </h3>
                        {achievement.unlocked && achievement.unlockedAt && (
                          <span className="text-xs text-gray-400">
                            {new Date(achievement.unlockedAt).toLocaleDateString('zh-CN')}
                          </span>
                        )}
                      </div>
                      <p className={`text-sm mt-1 ${achievement.unlocked ? 'text-gray-600' : 'text-gray-400'}`}>
                        {achievement.description}
                      </p>

                      {/* 进度显示 */}
                      {achievement.progress && (
                        <div className="mt-3">
                          <div className="flex justify-between text-xs text-gray-500 mb-1">
                            <span>进度</span>
                            <span>{achievement.progress.current}/{achievement.progress.target}</span>
                          </div>
                          <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${(achievement.progress.current / achievement.progress.target) * 100}%` }}
                              className={`h-full rounded-full ${
                                achievement.unlocked ? 'bg-green-500' : 'bg-blue-400'
                              }`}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}