'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, AlertCircle } from 'lucide-react'

interface ExportErrorModalProps {
  error: string | null
  onClose: () => void
}

export default function ExportErrorModal({ error, onClose }: ExportErrorModalProps) {
  if (!error) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <AlertCircle className="w-6 h-6 text-red-500" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                匯出失敗
              </h3>
              <p className="text-gray-600 mb-4">
                {error}
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  關閉
                </button>
                <button
                  onClick={() => {
                    onClose()
                    // 這裡可以添加重試邏輯
                  }}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  重試
                </button>
              </div>
            </div>
            <button
              onClick={onClose}
              className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
} 