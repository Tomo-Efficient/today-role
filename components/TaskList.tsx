'use client';

import { Role, UserProgress } from '@/types';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TaskListProps {
  role: Role;
  progress: UserProgress;
  onTaskUpdate: (taskIndex: number, completed: boolean) => void;
}

export default function TaskList({ role, progress, onTaskUpdate }: TaskListProps) {
  const [expandedTask, setExpandedTask] = useState<number | null>(null);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <span>🎯</span> 今日体验任务
      </h3>

      <div className="space-y-3">
        {role.tasks.map((task, index) => {
          const isCompleted = progress.completedTasks[index];
          const isExpanded = expandedTask === index;

          return (
            <motion.div
              key={index}
              initial={false}
              animate={{
                backgroundColor: isCompleted ? '#f0fdf4' : '#ffffff',
                borderColor: isCompleted ? '#bbf7d0' : '#e5e7eb'
              }}
              className="border rounded-xl overflow-hidden"
            >
              <div
                className="p-4 flex items-start gap-4 cursor-pointer hover:bg-gray-50/50"
                onClick={() => onTaskUpdate(index, !isCompleted)}
                onMouseEnter={() => setExpandedTask(index)}
                onMouseLeave={() => setExpandedTask(null)}
              >
                <button
                  className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center mt-0.5 ${
                    isCompleted
                      ? 'bg-green-500 border-green-500'
                      : 'border-gray-300 hover:border-green-400'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onTaskUpdate(index, !isCompleted);
                  }}
                >
                  {isCompleted && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>

                <div className="flex-1">
                  <p className={`leading-relaxed ${isCompleted ? 'line-through text-gray-500' : 'text-gray-700'}`}>
                    {task}
                  </p>

                  {!isCompleted && (
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs px-2 py-0.5 bg-blue-50 text-blue-600 rounded">
                        点击圆圈完成
                      </span>
                      <span className="text-xs text-gray-400">
                        悬停查看详情
                      </span>
                    </div>
                  )}
                </div>

                <span className={`text-sm font-medium px-2 py-1 rounded ${
                  isCompleted
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-500'
                }`}>
                  {index + 1}
                </span>
              </div>

              <AnimatePresence>
                {isExpanded && !isCompleted && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 ml-10 border-t border-gray-100 pt-3">
                      <p className="text-sm text-gray-600">
                        💡 小建议：无需完美执行，重在体验过程。
                        {index === 0 && " 这个任务帮助你进入角色状态。"}
                        {index === role.tasks.length - 1 && " 这是今日的总结性体验，好好享受。"}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between text-sm">
          <div className="text-gray-600">
            <span className="font-medium">{progress.completedTasks.filter(Boolean).length}</span> 个任务已完成
          </div>
          <div className="text-gray-600">
            <span className="font-medium">{role.tasks.length - progress.completedTasks.filter(Boolean).length}</span> 个待体验
          </div>
        </div>
      </div>
    </div>
  );
}