'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, 
  Star, 
  User, 
  Calendar, 
  MessageSquare, 
  Trash2, 
  Eye,
  Search,
  Filter,
  CheckCircle,
  Clock,
  ThumbsUp,
  Reply,
  Send
} from 'lucide-react'

interface Feedback {
  id: string
  rating: number
  name: string
  email: string
  content: string
  createdAt: string
  isRead: boolean
  isProcessed: boolean
  replies?: Array<{
    id: string
    message: string
    adminName: string
    createdAt: string
  }>
}

export default function AdminFeedbacksPage() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRating, setFilterRating] = useState<'all' | '1' | '2' | '3' | '4' | '5'>('all')
  const [filterStatus, setFilterStatus] = useState<'all' | 'unread' | 'read' | 'processed'>('all')
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null)
  const [replyMessage, setReplyMessage] = useState('')
  const [isReplying, setIsReplying] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // 檢查登入狀態
    const token = localStorage.getItem('adminToken')
    if (!token) {
      router.push('/admin/login')
      return
    }

    loadFeedbacks()
  }, [router])

  const loadFeedbacks = async () => {
    try {
      const response = await fetch('/api/admin/feedbacks', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setFeedbacks(data.feedbacks || [])
      }
    } catch (error) {
      console.error('載入意見回饋失敗:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleMarkAsRead = async (feedbackId: string) => {
    try {
      const response = await fetch(`/api/admin/feedbacks/${feedbackId}/mark-read`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        setFeedbacks(feedbacks.map(feedback => 
          feedback.id === feedbackId 
            ? { ...feedback, isRead: true }
            : feedback
        ))
        if (selectedFeedback?.id === feedbackId) {
          setSelectedFeedback({ ...selectedFeedback, isRead: true })
        }
      }
    } catch (error) {
      console.error('標記為已讀失敗:', error)
    }
  }

  const handleMarkAsProcessed = async (feedbackId: string) => {
    try {
      const response = await fetch(`/api/admin/feedbacks/${feedbackId}/mark-processed`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        setFeedbacks(feedbacks.map(feedback => 
          feedback.id === feedbackId 
            ? { ...feedback, isProcessed: true }
            : feedback
        ))
        if (selectedFeedback?.id === feedbackId) {
          setSelectedFeedback({ ...selectedFeedback, isProcessed: true })
        }
      }
    } catch (error) {
      console.error('標記為已處理失敗:', error)
    }
  }

  const handleDeleteFeedback = async (feedbackId: string) => {
    if (!confirm('確定要刪除這則意見回饋嗎？此操作無法復原。')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/feedbacks/${feedbackId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      })

      if (response.ok) {
        setFeedbacks(feedbacks.filter(feedback => feedback.id !== feedbackId))
        if (selectedFeedback?.id === feedbackId) {
          setSelectedFeedback(null)
        }
      }
    } catch (error) {
      console.error('刪除意見回饋失敗:', error)
    }
  }

  const handleReply = async () => {
    if (!selectedFeedback || !replyMessage.trim()) {
      return
    }

    setIsReplying(true)
    try {
      const response = await fetch(`/api/admin/feedbacks/${selectedFeedback.id}/reply`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: replyMessage.trim() })
      })

      if (response.ok) {
        const result = await response.json()
        setFeedbacks(feedbacks.map(feedback => 
          feedback.id === selectedFeedback.id 
            ? result.feedback
            : feedback
        ))
        setSelectedFeedback(result.feedback)
        setReplyMessage('')
        alert(result.message)
      } else {
        const error = await response.json()
        alert(`發送失敗: ${error.error}`)
      }
    } catch (error) {
      console.error('發送回復失敗:', error)
      alert('發送回復失敗，請稍後再試')
    } finally {
      setIsReplying(false)
    }
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ))
  }

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return 'text-green-600 bg-green-100'
    if (rating >= 3) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  const filteredFeedbacks = feedbacks.filter(feedback => {
    const matchesSearch = feedback.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         feedback.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         feedback.content.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesRating = filterRating === 'all' || feedback.rating.toString() === filterRating
    
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'unread' && !feedback.isRead) ||
                         (filterStatus === 'read' && feedback.isRead && !feedback.isProcessed) ||
                         (filterStatus === 'processed' && feedback.isProcessed)
    
    return matchesSearch && matchesRating && matchesStatus
  })

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">載入中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 頂部導航 */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/admin/dashboard" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
                <ArrowLeft className="w-5 h-5" />
                <span>返回管理面板</span>
              </Link>
            </div>
            <h1 className="text-xl font-bold text-gray-900">意見回饋管理</h1>
          </div>
        </div>
      </nav>

      {/* 主要內容 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 標題和統計 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-2">意見回饋管理</h2>
          <p className="text-gray-600">管理來自用戶的所有意見回饋</p>
          <div className="mt-4 flex items-center space-x-6 text-sm text-gray-500">
            <span>總回饋數: {feedbacks.length}</span>
            <span>未讀回饋: {feedbacks.filter(f => !f.isRead).length}</span>
            <span>已處理: {feedbacks.filter(f => f.isProcessed).length}</span>
            <span>平均評分: {feedbacks.length > 0 ? (feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length).toFixed(1) : '0'}</span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左側：回饋列表 */}
          <div className="lg:col-span-2">
            {/* 搜尋和篩選 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6"
            >
              <div className="flex flex-col sm:flex-row gap-4">
                {/* 搜尋 */}
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="搜尋姓名、電子郵件或內容..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* 評分篩選 */}
                <div className="flex items-center space-x-2">
                  <Star className="w-5 h-5 text-gray-400" />
                  <select
                    value={filterRating}
                    onChange={(e) => setFilterRating(e.target.value as any)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">全部評分</option>
                    <option value="5">5 星</option>
                    <option value="4">4 星</option>
                    <option value="3">3 星</option>
                    <option value="2">2 星</option>
                    <option value="1">1 星</option>
                  </select>
                </div>

                {/* 狀態篩選 */}
                <div className="flex items-center space-x-2">
                  <Filter className="w-5 h-5 text-gray-400" />
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as any)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">全部狀態</option>
                    <option value="unread">未讀</option>
                    <option value="read">已讀未處理</option>
                    <option value="processed">已處理</option>
                  </select>
                </div>
              </div>
            </motion.div>

            {/* 回饋列表 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-4"
            >
              {filteredFeedbacks.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                  <ThumbsUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">沒有找到回饋</h3>
                  <p className="text-gray-600">請調整搜尋條件或篩選器</p>
                </div>
              ) : (
                filteredFeedbacks.map((feedback, index) => (
                  <motion.div
                    key={feedback.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`bg-white rounded-lg shadow-sm border p-6 cursor-pointer transition-colors ${
                      selectedFeedback?.id === feedback.id 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedFeedback(feedback)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="flex items-center space-x-1">
                            {renderStars(feedback.rating)}
                          </div>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRatingColor(feedback.rating)}`}>
                            {feedback.rating} 星
                          </span>
                          {!feedback.isRead && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              <Clock className="w-3 h-3 mr-1" />
                              未讀
                            </span>
                          )}
                          {feedback.isProcessed && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              已處理
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-6 text-sm text-gray-500 mb-2">
                          <div className="flex items-center space-x-1">
                            <User className="w-4 h-4" />
                            <span>{feedback.name || '匿名'}</span>
                          </div>
                          {feedback.email && (
                            <div className="flex items-center space-x-1">
                              <MessageSquare className="w-4 h-4" />
                              <span>{feedback.email}</span>
                            </div>
                          )}
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(feedback.createdAt).toLocaleDateString('zh-TW')}</span>
                          </div>
                        </div>
                        
                        <p className="text-gray-600 line-clamp-2">{feedback.content}</p>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </motion.div>
          </div>

          {/* 右側：回饋詳情 */}
          <div className="lg:col-span-1">
            {selectedFeedback ? (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-8"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">回饋詳情</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">評分</label>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        {renderStars(selectedFeedback.rating)}
                      </div>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRatingColor(selectedFeedback.rating)}`}>
                        {selectedFeedback.rating} 星
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">姓名</label>
                    <p className="text-gray-900">{selectedFeedback.name || '匿名'}</p>
                  </div>
                  
                  {selectedFeedback.email && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">電子郵件</label>
                      <a 
                        href={`mailto:${selectedFeedback.email}`}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        {selectedFeedback.email}
                      </a>
                    </div>
                  )}
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">提交時間</label>
                    <p className="text-gray-900">{new Date(selectedFeedback.createdAt).toLocaleString('zh-TW')}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">回饋內容</label>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-900 whitespace-pre-wrap">{selectedFeedback.content}</p>
                    </div>
                  </div>

                  {/* 回復歷史 */}
                  {selectedFeedback.replies && selectedFeedback.replies.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">回復歷史</label>
                      <div className="space-y-3">
                        {selectedFeedback.replies.map((reply) => (
                          <div key={reply.id} className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-blue-900">{reply.adminName}</span>
                              <span className="text-xs text-blue-600">
                                {new Date(reply.createdAt).toLocaleString('zh-TW')}
                              </span>
                            </div>
                            <p className="text-blue-800 whitespace-pre-wrap text-sm">{reply.message}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 回復表單 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">回復訊息</label>
                    <textarea
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                      placeholder="輸入回復內容..."
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    />
                    <button
                      onClick={handleReply}
                      disabled={isReplying || !replyMessage.trim()}
                      className={`mt-2 w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                        isReplying || !replyMessage.trim()
                          ? 'bg-gray-400 cursor-not-allowed text-white'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      {isReplying ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>發送中...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>發送回復</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  {!selectedFeedback.isRead && (
                    <button
                      onClick={() => handleMarkAsRead(selectedFeedback.id)}
                      className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      <span>標記為已讀</span>
                    </button>
                  )}
                  
                  {!selectedFeedback.isProcessed && (
                    <button
                      onClick={() => handleMarkAsProcessed(selectedFeedback.id)}
                      className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>標記為已處理</span>
                    </button>
                  )}
                  
                  <button
                    onClick={() => handleDeleteFeedback(selectedFeedback.id)}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>刪除回饋</span>
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center"
              >
                <Star className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">選擇回饋</h3>
                <p className="text-gray-600">點擊左側的回饋查看詳情</p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
