'use client';

import { Role, UserProgress } from '@/types';
import { generateShareImage } from '@/lib/share-image';
import { motion } from 'framer-motion';
import { useState } from 'react';

interface ShareImageModalProps {
  role: Role;
  progress: UserProgress;
  notes?: string[];
  onClose: () => void;
  onShare: (imageUrl: string) => void;
}

export default function ShareImageModal({
  role,
  progress,
  notes = [],
  onClose,
  onShare
}: ShareImageModalProps) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [userName, setUserName] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  const completedCount = progress.completedTasks.filter(Boolean).length;
  const totalTasks = role.tasks.length;

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const imageUrl = await generateShareImage({
        role,
        progress,
        notes,
        date: new Date().toLocaleDateString('zh-CN'),
        userName: userName || '神秘体验者',
        theme
      });
      setGeneratedImage(imageUrl);
    } catch (error) {
      console.error('生成分享图失败:', error);
      alert('生成分享图失败，请重试');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleShare = () => {
    if (generatedImage) {
      onShare(generatedImage);
      onClose();
    }
  };

  const handleDownload = () => {
    if (generatedImage) {
      const link = document.createElement('a');
      link.href = generatedImage;
      link.download = `今日角色-${role.title}-${new Date().toISOString().split('T')[0]}.png`;
      link.click();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden"
      >
        {/* 标题栏 */}
        <div className="p-6 border-b">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">生成分享图</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100"
            >
              ✕
            </button>
          </div>
        </div>

        {/* 内容区 */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {/* 预览 */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-gray-700">分享图预览</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setTheme('light')}
                  className={`px-3 py-1 rounded-full text-sm ${
                    theme === 'light'
                      ? 'bg-blue-100 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  浅色主题
                </button>
                <button
                  onClick={() => setTheme('dark')}
                  className={`px-3 py-1 rounded-full text-sm ${
                    theme === 'dark'
                      ? 'bg-gray-800 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  深色主题
                </button>
              </div>
            </div>

            {/* 预览图 */}
            <div className={`p-4 rounded-xl border-2 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
              {generatedImage ? (
                <img
                  src={generatedImage}
                  alt="分享图预览"
                  className="w-full rounded-lg"
                />
              ) : (
                <div className={`aspect-[2/3] rounded-lg flex items-center justify-center ${
                  theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                }`}>
                  <div className="text-center">
                    <div className="text-4xl mb-2">{role.emoji}</div>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      点击生成预览
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-3 text-sm text-gray-500">
              角色：{role.title} • 进度：{completedCount}/{totalTasks}
            </div>
          </div>

          {/* 自定义设置 */}
          <div className="mb-6">
            <h3 className="font-medium text-gray-700 mb-3">自定义设置</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  显示昵称（可选）
                </label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="请输入你的昵称"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  maxLength={20}
                />
                <p className="mt-1 text-xs text-gray-400">
                  不填写将显示为"神秘体验者"
                </p>
              </div>
            </div>
          </div>

          {/* 生成按钮 */}
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-lg hover:opacity-90 disabled:opacity-50 transition-all"
          >
            {isGenerating ? (
              <span className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                正在生成...
              </span>
            ) : generatedImage ? (
              '重新生成'
            ) : (
              '生成分享图'
            )}
          </button>

          {/* 分享和下载按钮 */}
          {generatedImage && (
            <div className="grid grid-cols-2 gap-3 mt-4">
              <button
                onClick={handleDownload}
                className="py-3 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                下载图片
              </button>
              <button
                onClick={handleShare}
                className="py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium rounded-lg hover:opacity-90 transition-all"
              >
                立即分享
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}