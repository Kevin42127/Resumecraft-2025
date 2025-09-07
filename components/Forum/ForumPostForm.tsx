'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, User, FileText } from 'lucide-react'
import { ForumPost, CreatePostRequest } from '@/types/forum'

interface ForumPostFormProps {
  onClose: () => void
  onPostCreated: (post: ForumPost) => void
}

const categories = [
  { value: 'general', label: '一般討論', icon: '💬' },
  { value: 'resume-review', label: '履歷檢視', icon: '📄' },
  { value: 'portfolio', label: '作品集分享', icon: '🎨' },
  { value: 'career-advice', label: '職涯建議', icon: '💼' },
  { value: 'interview', label: '面試經驗', icon: '🤝' },
]

export default function ForumPostForm({ onClose, onPostCreated }: ForumPostFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    author: '',
    category: 'general' as const,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title.trim() || !formData.content.trim() || !formData.author.trim()) {
      alert('請填寫所有必要欄位')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/forum/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const newPost = await response.json()
        onPostCreated(newPost)
      } else {
        throw new Error('發文失敗')
      }
    } catch (error) {
      console.error('Error creating post:', error)
      alert('發文失敗，請稍後再試')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary-100 rounded-lg">
                <FileText className="w-5 h-5 text-primary-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">發表新討論</h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Author */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                暱稱 <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:border-primary-500"
                  placeholder="請輸入您的暱稱"
                  maxLength={20}
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                分類 <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {categories.map((category) => (
                  <button
                    key={category.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, category: category.value as any })}
                    className={`p-3 rounded-lg border-2 transition-colors ${
                      formData.category === category.value
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-lg mb-1">{category.icon}</div>
                      <div className="text-sm font-medium">{category.label}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                標題 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-primary-500"
                placeholder="請輸入討論標題"
                maxLength={100}
              />
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                內容 <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-primary-500 resize-none"
                rows={8}
                placeholder="請詳細描述您的問題或分享內容..."
                maxLength={2000}
              />
              <div className="text-right text-sm text-gray-500 mt-1">
                {formData.content.length}/2000
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                取消
              </button>
              <motion.button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center space-x-2 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                whileHover={!isSubmitting ? { scale: 1.05 } : {}}
                whileTap={!isSubmitting ? { scale: 0.95 } : {}}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white rounded-full border-t-transparent animate-spin" />
                    <span>發文中...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>發表討論</span>
                  </>
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
} 