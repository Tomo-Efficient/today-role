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
    onSaveNote(taskIndex, note.trim());
    setIsEditing(false);
    setShowNote(true);
  };

  const handleCancel = () => {
    setNote(initialNote);
    setIsEditing(false);
    if (!initialNote) {
      setShowNote(false);
    }
  };

  if (!isCompleted && !showNote) {
    return null;
  }

  return (
    <div className="mt-3 ml-10 border-l-2 border-gray-200 pl-4">
      <AnimatePresence>
        {isEditing ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="group cursor-pointer"
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
        ) : (
          isCompleted && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <button
                onClick={() => setIsEditing(true)}
                className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <span>📝</span>
                <span>记录心得</span>
              </button>
            </motion.div>
          )
        )}
      </AnimatePresence>
    </div>
  );
}