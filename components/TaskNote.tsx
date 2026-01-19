'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TaskNoteProps {
  taskIndex: number;
  taskText: string;
  initialNote?: string;
  onSaveNote: (taskIndex: number, note: string) => void;
  isCompleted: boolean;
}

export default function TaskNote({
  taskIndex,
  taskText,
  initialNote = '',
  onSaveNote,
  isCompleted
}: TaskNoteProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [note, setNote] = useState(initialNote);
  const [showNote, setShowNote] = useState(!!initialNote);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isEditing]);

  const handleSave = () => {
    const trimmedNote = note.trim();
    onSaveNote(taskIndex, trimmedNote);
    setIsEditing(false);
    setShowNote(!!trimmedNote);
  };

  const handleCancel = () => {
    setNote(initialNote);
    setIsEditing(false);
    if (!initialNote) {
      setShowNote(false);
    }
  };

  // 如果没有心得且不在编辑状态，任务未完成时不显示
  if (!isCompleted && !showNote && !isEditing) {
    return null;
  }

  return (
    <div className={isEditing ? "mt-3 pl-4" : ""}> {/* 只在编辑时添加上边距 */}
      <AnimatePresence mode="wait">
        {isEditing ? (
          <motion.div
            key="editing"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-2"
          >
            <textarea
              ref={textareaRef}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="记录此刻的感受、发现或灵感..."
              className="w-full p-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none min-h-[80px]"
              maxLength={200}
            />
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="px-3 py-1 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
              >
                保存心得
              </button>
              <button
                onClick={handleCancel}
                className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300 transition-colors"
              >
                取消
              </button>
            </div>
          </motion.div>
        ) : showNote ? (
          <motion.div
            key="viewing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="group cursor-pointer mt-2" // 少量上边距
            onClick={() => setIsEditing(true)}
          >
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200">
              <div className="flex justify-between items-start mb-1">
                <span className="font-medium text-gray-700">我的心得</span>
                <span className="text-xs text-gray-400 group-hover:text-blue-500 transition-colors">
                  点击编辑
                </span>
              </div>
              <p className="whitespace-pre-wrap">{note || '还没有记录心得...'}</p>
              {note && (
                <div className="mt-2 text-xs text-gray-500 text-right">
                  {note.length}/200字
                </div>
              )}
            </div>
          </motion.div>
        ) : isCompleted ? (
          <motion.div
            key="prompt"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
            className="inline-block" // 改为行内块，可以放在任务同一行
          >
            <button
              onClick={() => setIsEditing(true)}
              className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1 px-2 py-1 rounded-lg border border-blue-200 bg-blue-50 hover:bg-blue-100 transition-colors ml-2" // 添加左边距
              title="记录心得"
            >
              <span className="text-xs">📝</span>
              <span className="text-xs">记录</span> {/* 简化文字 */}
            </button>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}