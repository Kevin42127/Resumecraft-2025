'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface WelcomeBannerProps {
  variant?: 'full' | 'compact'
  onFeedbackClick?: () => void
  onExampleClick?: () => void
}

export default function WelcomeBanner({ 
  variant = 'full', 
  onFeedbackClick, 
  onExampleClick 
}: WelcomeBannerProps) {
  const [show, setShow] = useState(true)

  if (!show) return null

  if (variant === 'compact') {
    return (
      <AnimatePresence>
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border-b border-blue-200 shadow-sm"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <motion.div 
                    className="w-8 h-8 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center shadow-sm"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <span className="text-blue-600 text-sm">🚧</span>
                  </motion.div>
                </div>
                <div className="flex-1">
                  <p className="text-xs text-blue-700">
                    測試階段 - 歡迎體驗並提供回饋，幫助我們持續優化！🙏
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    {onFeedbackClick && (
                      <motion.button
                        onClick={onFeedbackClick}
                        className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        💬 意見回饋
                      </motion.button>
                    )}
                    {onExampleClick && (
                      <motion.button
                        onClick={onExampleClick}
                        className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        📋 查看範例
                      </motion.button>
                    )}
                  </div>
                </div>
              </div>
              <motion.button 
                onClick={() => setShow(false)} 
                className="ml-3 p-1 text-blue-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all duration-200"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="關閉歡迎訊息"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    )
  }

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border-b border-blue-200 shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <motion.div 
                  className="w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center shadow-sm"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <span className="text-blue-600 text-lg">🚧</span>
                </motion.div>
              </div>
              <div className="flex-1">
                <motion.h3 
                  className="text-sm font-semibold text-blue-900"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  各位訪客您好，本網站目前正在進行小規模的測試階段
                </motion.h3>
                <motion.p 
                  className="text-sm text-blue-700 mt-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  現階段已完成核心功能的開發，歡迎體驗、回饋，幫助我們持續優化！
                </motion.p>
                <motion.p 
                  className="text-sm text-blue-600 mt-1 flex items-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <span>部分功能與樣式仍在微調中，建議可先使用履歷編輯區的「載入範例」進行測試。若造成不便，敬請見諒</span>
                  <motion.span 
                    className="ml-1"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
                  >
                    🙏
                  </motion.span>
                </motion.p>
                <motion.div 
                  className="flex items-center space-x-3 mt-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  {onFeedbackClick && (
                    <motion.button
                      onClick={onFeedbackClick}
                      className="flex items-center space-x-1 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span>💬</span>
                      <span>意見回饋</span>
                    </motion.button>
                  )}
                  {onExampleClick && (
                    <motion.button
                      onClick={onExampleClick}
                      className="flex items-center space-x-1 px-3 py-1.5 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm font-medium"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span>📋</span>
                      <span>查看範例</span>
                    </motion.button>
                  )}
                </motion.div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <motion.button 
                onClick={() => setShow(false)} 
                className="p-2 text-blue-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all duration-200"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="關閉歡迎訊息"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
} 