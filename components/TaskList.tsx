'use client';

import { Role, UserProgress } from '@/types';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TaskNote from './TaskNote';

interface TaskListProps {
  role: Role;
  progress: UserProgress;
  onTaskUpdate: (taskIndex: number, completed: boolean) => void;
  onSaveNote?: (taskIndex: number, note: string) => void; // 新增
}

export default function TaskList({
  role,
  progress,
  onTaskUpdate,
  onSaveNote
}: TaskListProps) {
  const [expandedTask, setExpandedTask] = useState<number | null>(null);

  const handleSaveNote = (taskIndex: number, note: string) => {
    if (onSaveNote) {
      onSaveNote(taskIndex, note);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <span>🎯</span> 今日体验任务
        </h3>
        <div className="text-sm text-gray-500">
          {progress.completedTasks.filter(Boolean).length}/{role.tasks.length} 完成
        </div>
      </div>

      <div className="space-y-4">
        {role.tasks.map((task, index) => {
          const isCompleted = progress.completedTasks[index];
          const isExpanded = expandedTask === index;
          const note = progress.notes?.[index] || '';

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
              {/* 任务项 */}
              <div
                className="p-4 flex items-start gap-4 cursor-pointer hover:bg-gray-50/50"
                onClick={() => onTaskUpdate(index, !isCompleted)}
                onMouseEnter={() => setExpandedTask(index)}
                onMouseLeave={() => setExpandedTask(null)}
              >
                {/* 完成状态圆圈 */}
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

                {/* 任务文字 */}
                <div className="flex-1">
                  <p className={`leading-relaxed ${isCompleted ? 'line-through text-gray-500' : 'text-gray-700'}`}>
                    {task}
                  </p>

                  {/* 提示标签 */}
                  {!isCompleted && (
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs px-2 py-0.5 bg-blue-50 text-blue-600 rounded">
                        点击圆圈完成
                      </span>
                    </div>
                  )}
                </div>

                {/* 任务序号 */}
                <span className={`text-sm font-medium px-2 py-1 rounded ${
                  isCompleted
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-500'
                }`}>
                  {index + 1}
                </span>
              </div>

              {/* 心得记录区域 */}
<AnimatePresence>
  {(isCompleted || note) && ( // 这里保持原条件，TaskNote 组件内部会处理隐藏逻辑
    <motion.div
      key={`note-${index}`} // 为每个任务的心得区域添加唯一的 key
      initial={{ height: 0, opacity: 0 }}
      animate={{
        height: 'auto',
        opacity: 1,
        transition: { duration: 0.3, ease: "easeOut" }
      }}
      exit={{
        height: 0,
        opacity: 0,
        transition: { duration: 0.2, ease: "easeIn" }
      }}
      className="overflow-hidden"
    >
      <TaskNote
        taskIndex={index}
        taskText={task}
        initialNote={note}
        onSaveNote={handleSaveNote}
        isCompleted={isCompleted}
      />
    </motion.div>
  )}
</AnimatePresence>

              {/* 展开详情（原提示） */}
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

      {/* 任务统计 */}
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