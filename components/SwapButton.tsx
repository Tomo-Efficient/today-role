'use client';

import { motion } from 'framer-motion';

interface SwapButtonProps {
  onSwap: () => void;
  swapCount: number;
  isSwapping: boolean;
}

export default function SwapButton({ onSwap, swapCount, isSwapping }: SwapButtonProps) {
  const remainingSwaps = 3 - swapCount;
  const isDisabled = remainingSwaps <= 0 || isSwapping;

  return (
    <div className="flex flex-col items-center gap-2 mt-4">
      <button
        onClick={onSwap}
        disabled={isDisabled}
        className={`
          relative px-5 py-3 rounded-full font-medium text-sm
          transition-all duration-300 transform hover:scale-105 active:scale-95
          ${isDisabled
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-700 hover:shadow-lg hover:from-amber-50 hover:to-yellow-50'
          }
          border border-amber-200
        `}
      >
        {/* 按钮背景装饰 */}
        <div className="absolute inset-0 rounded-full overflow-hidden opacity-30">
          <div className="absolute w-8 h-8 bg-amber-300 rounded-full -top-2 -left-2"></div>
          <div className="absolute w-6 h-6 bg-yellow-300 rounded-full -bottom-1 -right-1"></div>
        </div>

        {/* 按钮内容 */}
        <div className="relative flex items-center gap-2">
          {isSwapping ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-amber-600"></div>
              <span>切换中...</span>
            </>
          ) : (
            <>
              <span className="text-lg">✨</span>
              <span>换一个角色</span>
              {!isDisabled && (
                <span className="text-xs px-2 py-0.5 bg-amber-500 text-white rounded-full">
                  {remainingSwaps}次
                </span>
              )}
            </>
          )}
        </div>
      </button>

      {/* 提示文字 */}
      <motion.p
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-xs text-gray-500 text-center max-w-xs"
      >
        {isDisabled ? (
          "今日更换次数已用尽，凌晨刷新"
        ) : remainingSwaps === 3 ? (
          "今日有3次更换机会，找到最触动你的角色"
        ) : (
          `还剩 ${remainingSwaps} 次更换机会`
        )}
      </motion.p>

      {/* 使用次数的视觉指示器 */}
      <div className="flex gap-1 mt-1">
        {[1, 2, 3].map((num) => (
          <div
            key={num}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              num <= swapCount ? 'bg-gray-300' : 'bg-amber-400'
            }`}
          />
        ))}
      </div>
    </div>
  );
}