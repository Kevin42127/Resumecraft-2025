'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, 
  User, 
  Clock, 
  ThumbsUp, 
  MessageCircle,
  Send,
  Heart
} from 'lucide-react'
import { ForumPost, ForumComment, CreateCommentRequest } from '@/types/forum'

interface ForumPostDetailProps {
  post: ForumPost
  onClose: () => void
}

const categoryIcons = {
  general: '💬',
  'resume-review': '📄',
  portfolio: '🎨',
  'career-advice': '💼',
  interview: '🤝',
}

const categoryLabels = {
  general: '一般討論',
  'resume-review': '履歷檢視',
  portfolio: '作品集分享',
  'career-advice': '職涯建議',
  interview: '面試經驗',
}

export default function ForumPostDetail({ post, onClose }: ForumPostDetailProps) {
  const [comment, setComment] = useState('')
  const [author, setAuthor] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentPost, setCurrentPost] = useState(post)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('zh-TW')
  }

  const handleLike = async () => {
    try {
      const response = await fetch(`/api/forum/posts/${post.id}/like`, {
        method: 'POST',
      })
      if (response.ok) {
        setCurrentPost(prev => ({ ...prev, likes: prev.likes + 1 }))
      }
    } catch (error) {
      console.error('Error liking post:', error)
    }
  }

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!comment.trim() || !author.trim()) {
      alert('請填寫暱稱和留言內容')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/forum/posts/${post.id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: comment,
          author: author,
        }),
      })

      if (response.ok) {
        const newComment = await response.json()
        setCurrentPost(prev => ({
          ...prev,
          comments: [newComment, ...prev.comments]
        }))
        setComment('')
      } else {
        throw new Error('留言失敗')
      }
    } catch (error) {
      console.error('Error creating comment:', error)
      alert('留言失敗，請稍後再試')
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
          className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{categoryIcons[currentPost.category]}</span>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{currentPost.title}</h2>
                <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                  <div className="flex items-center space-x-1">
                    <User className="w-4 h-4" />
                    <span>{currentPost.author}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{formatDate(currentPost.createdAt)}</span>
                  </div>
                  <span className="text-sm font-medium text-primary-600 bg-primary-50 px-2 py-1 rounded">
                    {categoryLabels[currentPost.category]}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="prose max-w-none mb-8">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {currentPost.content}
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between py-4 border-t border-gray-200">
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleLike}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-primary-600 transition-colors"
                >
                  <Heart className="w-5 h-5" />
                  <span>{currentPost.likes}</span>
                </button>
                <div className="flex items-center space-x-2 text-gray-600">
                  <MessageCircle className="w-5 h-5" />
                  <span>{currentPost.comments.length} 則留言</span>
                </div>
              </div>
            </div>

            {/* Comments */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">留言</h3>
              
              {currentPost.comments.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  還沒有留言，成為第一個留言的人吧！
                </div>
              ) : (
                <div className="space-y-4">
                  {currentPost.comments.map((comment) => (
                    <div key={comment.id} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4 text-gray-400" />
                          <span className="font-medium text-gray-900">{comment.author}</span>
                        </div>
                        <span className="text-sm text-gray-500">{formatDate(comment.createdAt)}</span>
                      </div>
                      <p className="text-gray-700">{comment.content}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Comment Form */}
              <div className="border-t border-gray-200 pt-6">
                <h4 className="text-md font-semibold text-gray-900 mb-4">發表留言</h4>
                <form onSubmit={handleSubmitComment} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      暱稱 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-primary-500"
                      placeholder="請輸入您的暱稱"
                      maxLength={20}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      留言內容 <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-primary-500 resize-none"
                      rows={3}
                      placeholder="請輸入您的留言..."
                      maxLength={500}
                    />
                    <div className="text-right text-sm text-gray-500 mt-1">
                      {comment.length}/500
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      whileHover={!isSubmitting ? { scale: 1.05 } : {}}
                      whileTap={!isSubmitting ? { scale: 0.95 } : {}}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white rounded-full border-t-transparent animate-spin" />
                          <span>留言中...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>發表留言</span>
                        </>
                      )}
                    </motion.button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
} 