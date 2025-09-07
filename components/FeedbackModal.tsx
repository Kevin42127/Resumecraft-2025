'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, Star } from 'lucide-react'
import { FeedbackForm } from '@/types/resume'

interface FeedbackModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function FeedbackModal({ isOpen, onClose }: FeedbackModalProps) {
  const [formData, setFormData] = useState<FeedbackForm>({
    name: '',
    email: '',
    content: '',
    rating: 0,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.content.trim()) {
      alert('請填寫意見內容')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setSubmitSuccess(true)
        setTimeout(() => {
          onClose()
          setSubmitSuccess(false)
          setFormData({ name: '', email: '', content: '', rating: 0 })
        }, 2000)
      } else {
        throw new Error('提交失敗')
      }
    } catch (error) {
      console.error('Feedback submission error:', error)
      alert('提交失敗，請稍後再試')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: keyof FeedbackForm, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleRatingClick = (rating: number) => {
    setFormData(prev => ({
      ...prev,
      rating,
    }))
  }

  return (
    <AnimatePresence>
      {isOpen && (
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
            className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">意見回饋</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {submitSuccess ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-8"
                >
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    感謝您的回饋！
                  </h3>
                  <p className="text-gray-600">
                    您的意見對我們很重要，我們會認真考慮您的建議。
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Rating */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      您對 ResumeCraft 的評分
                    </label>
                    <div className="flex space-x-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => handleRatingClick(star)}
                          className={`p-1 rounded transition-colors ${
                            formData.rating >= star
                              ? 'text-yellow-400 hover:text-yellow-500'
                              : 'text-gray-300 hover:text-yellow-400'
                          }`}
                        >
                          <Star className="w-6 h-6 fill-current" />
                        </button>
                      ))}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {formData.rating > 0 && (
                        <span>
                          {formData.rating === 1 && '非常不滿意'}
                          {formData.rating === 2 && '不滿意'}
                          {formData.rating === 3 && '普通'}
                          {formData.rating === 4 && '滿意'}
                          {formData.rating === 5 && '非常滿意'}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      姓名 (選填)
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="input-field"
                      placeholder="請輸入您的姓名"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      電子郵件 (選填)
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="input-field"
                      placeholder="example@email.com"
                    />
                  </div>

                  {/* Content */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      意見內容 *
                    </label>
                    <textarea
                      value={formData.content}
                      onChange={(e) => handleInputChange('content', e.target.value)}
                      className="input-field"
                      rows={4}
                      placeholder="請分享您的使用體驗、建議或遇到的問題..."
                      required
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      取消
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting || !formData.content.trim()}
                      className="flex-1 px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>提交中...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>提交回饋</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
