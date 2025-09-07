'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Shield, 
  Trash2, 
  RotateCcw, 
  BarChart3, 
  X, 
  AlertTriangle,
  CheckCircle,
  Users,
  MessageSquare,
  FileText
} from 'lucide-react'
import { DeveloperAuth, AdminStats, ForumPost } from '@/types/forum'

interface DeveloperPanelProps {
  onClose: () => void
  posts: ForumPost[]
  onPostUpdate: () => void
}

export default function DeveloperPanel({ onClose, posts, onPostUpdate }: DeveloperPanelProps) {
  const [auth, setAuth] = useState<DeveloperAuth | null>(null)
  const [token, setToken] = useState('')
  const [isAuthenticating, setIsAuthenticating] = useState(false)
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [isLoadingStats, setIsLoadingStats] = useState(false)
  const [selectedPost, setSelectedPost] = useState<ForumPost | null>(null)
  const [deleteReason, setDeleteReason] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  // 檢查本地存儲的認證
  useEffect(() => {
    const savedAuth = localStorage.getItem('developerAuth')
    if (savedAuth) {
      try {
        setAuth(JSON.parse(savedAuth))
      } catch (error) {
        console.error('Error parsing saved auth:', error)
      }
    }
  }, [])

  const handleAuthenticate = async () => {
    if (!token.trim()) {
      alert('請輸入驗證令牌')
      return
    }

    setIsAuthenticating(true)
    try {
      const response = await fetch('/api/forum/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      })

      if (response.ok) {
        const authData = await response.json()
        setAuth(authData)
        localStorage.setItem('developerAuth', JSON.stringify(authData))
        setToken('')
      } else {
        const error = await response.json()
        alert(error.error || '身份驗證失敗')
      }
    } catch (error) {
      console.error('Error authenticating:', error)
      alert('身份驗證失敗')
    } finally {
      setIsAuthenticating(false)
    }
  }

  const handleLogout = () => {
    setAuth(null)
    localStorage.removeItem('developerAuth')
  }

  const fetchStats = async () => {
    if (!auth) return

    setIsLoadingStats(true)
    try {
      const response = await fetch('/api/forum/admin/stats', {
        headers: {
          'Authorization': `Bearer ${auth.token}`,
        },
      })

      if (response.ok) {
        const statsData = await response.json()
        setStats(statsData)
      } else {
        console.error('Failed to fetch stats')
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setIsLoadingStats(false)
    }
  }

  const handleDeletePost = async () => {
    if (!selectedPost || !auth) return

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/forum/admin/posts/${selectedPost.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.token}`,
        },
        body: JSON.stringify({ reason: deleteReason }),
      })

      if (response.ok) {
        alert('討論已刪除')
        setSelectedPost(null)
        setDeleteReason('')
        onPostUpdate()
      } else {
        const error = await response.json()
        alert(error.error || '刪除失敗')
      }
    } catch (error) {
      console.error('Error deleting post:', error)
      alert('刪除失敗')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleRestorePost = async (postId: string) => {
    if (!auth) return

    try {
      const response = await fetch(`/api/forum/admin/posts/${postId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.token}`,
        },
        body: JSON.stringify({}),
      })

      if (response.ok) {
        alert('討論已恢復')
        onPostUpdate()
      } else {
        const error = await response.json()
        alert(error.error || '恢復失敗')
      }
    } catch (error) {
      console.error('Error restoring post:', error)
      alert('恢復失敗')
    }
  }

  // 過濾已刪除的貼文
  const deletedPosts = posts.filter(post => post.isDeleted)

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
          className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <Shield className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">開發者管理面板</h2>
                {auth && (
                  <p className="text-sm text-gray-600">
                    歡迎，{auth.name} ({auth.role})
                  </p>
                )}
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
            {!auth ? (
              /* 身份驗證表單 */
              <div className="max-w-md mx-auto">
                <div className="text-center mb-6">
                  <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">開發者身份驗證</h3>
                  <p className="text-gray-600">請輸入您的開發者令牌以訪問管理功能</p>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      驗證令牌
                    </label>
                    <input
                      type="password"
                      value={token}
                      onChange={(e) => setToken(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-red-500"
                      placeholder="請輸入開發者令牌"
                    />
                  </div>
                  
                  <button
                    onClick={handleAuthenticate}
                    disabled={isAuthenticating}
                    className="w-full px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                  >
                    {isAuthenticating ? '驗證中...' : '驗證身份'}
                  </button>
                </div>

                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">可用的開發者令牌：</h4>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div>• dev-token-2024 (開發者權限)</div>
                    <div>• admin-token-2024 (管理員權限)</div>
                  </div>
                </div>
              </div>
            ) : (
              /* 管理面板 */
              <div className="space-y-6">
                {/* 統計資訊 */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <FileText className="w-5 h-5 text-blue-600" />
                      <span className="text-sm font-medium text-blue-900">總討論數</span>
                    </div>
                    <div className="text-2xl font-bold text-blue-900 mt-2">
                      {stats?.totalPosts || posts.length}
                    </div>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <MessageSquare className="w-5 h-5 text-green-600" />
                      <span className="text-sm font-medium text-green-900">總留言數</span>
                    </div>
                    <div className="text-2xl font-bold text-green-900 mt-2">
                      {stats?.totalComments || posts.reduce((sum, post) => sum + post.comments.length, 0)}
                    </div>
                  </div>
                  
                  <div className="bg-red-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Trash2 className="w-5 h-5 text-red-600" />
                      <span className="text-sm font-medium text-red-900">已刪除討論</span>
                    </div>
                    <div className="text-2xl font-bold text-red-900 mt-2">
                      {stats?.deletedPosts || deletedPosts.length}
                    </div>
                  </div>
                  
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Users className="w-5 h-5 text-purple-600" />
                      <span className="text-sm font-medium text-purple-900">活躍用戶</span>
                    </div>
                    <div className="text-2xl font-bold text-purple-900 mt-2">
                      {stats?.activeUsers || 0}
                    </div>
                  </div>
                </div>

                {/* 操作按鈕 */}
                <div className="flex items-center space-x-4">
                  <button
                    onClick={fetchStats}
                    disabled={isLoadingStats}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <BarChart3 className="w-4 h-4" />
                    <span>更新統計</span>
                  </button>
                  
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    登出
                  </button>
                </div>

                {/* 已刪除討論列表 */}
                {deletedPosts.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">已刪除的討論</h3>
                    <div className="space-y-3">
                      {deletedPosts.map((post) => (
                        <div key={post.id} className="bg-red-50 border border-red-200 rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium text-gray-900">{post.title}</h4>
                              <p className="text-sm text-gray-600">作者: {post.author}</p>
                              <p className="text-sm text-red-600">
                                刪除原因: {post.deletedReason || '管理員刪除'}
                              </p>
                            </div>
                            <button
                              onClick={() => handleRestorePost(post.id)}
                              className="flex items-center space-x-1 px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors"
                            >
                              <RotateCcw className="w-3 h-3" />
                              <span>恢復</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 刪除討論確認對話框 */}
                {selectedPost && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">確認刪除討論</h3>
                      <p className="text-gray-600 mb-4">
                        您確定要刪除討論「{selectedPost.title}」嗎？此操作無法撤銷。
                      </p>
                      
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          刪除原因（可選）
                        </label>
                        <textarea
                          value={deleteReason}
                          onChange={(e) => setDeleteReason(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-red-500"
                          rows={3}
                          placeholder="請說明刪除原因..."
                        />
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => setSelectedPost(null)}
                          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                        >
                          取消
                        </button>
                        <button
                          onClick={handleDeletePost}
                          disabled={isDeleting}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                        >
                          {isDeleting ? '刪除中...' : '確認刪除'}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
} 