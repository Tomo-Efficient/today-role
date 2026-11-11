'use client';

import { Role } from '@/types';
import { motion } from 'framer-motion';

export interface HistoryEntry {
  role: Role;
  date: string;
  done: number;
  notes: (string | undefined)[];
}

interface HistoryPanelProps {
  entries: HistoryEntry[];
  onClose: () => void;
}

export default function HistoryPanel({ entries, onClose }: HistoryPanelProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-hidden flex flex-col"
      >
        <div className="p-6 border-b flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">体验历史</h2>
            <p className="text-sm text-gray-500 mt-1">完成过的角色和留下的心得</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100"
            aria-label="关闭"
          >
            ✕
          </button>
        </div>

        <div className="p-4 overflow-y-auto space-y-3">
          {entries.length === 0 && (
            <div className="py-12 text-center text-gray-400">
              <div className="text-4xl mb-3">📜</div>
              <p>还没有体验记录</p>
              <p className="text-sm mt-1">完成今天的一个任务后会出现在这里</p>
            </div>
          )}

          {entries.map((entry) => (
            <div key={`${entry.role.id}-${entry.date}`} className="border border-gray-100 rounded-xl p-4 bg-gray-50/60">
              <div className="flex items-start gap-3">
                <div className="text-2xl">{entry.role.emoji}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="font-semibold text-gray-800 leading-snug">{entry.role.title}</h3>
                    <span className="text-xs text-gray-400 shrink-0">{entry.date}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {entry.role.category || '角色'} · 完成 {entry.done}/{entry.role.tasks.length}
                  </p>
                  {entry.notes.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {entry.notes.map((note, i) =>
                        note ? (
                          <p key={i} className="text-sm text-gray-600">
                            <span className="text-gray-400">任务 {i + 1}：</span>{note}
                          </p>
                        ) : null
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
