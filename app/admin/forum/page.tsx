'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, 
  MessageSquare, 
  Eye, 
  EyeOff,
  Trash2, 
  CheckCircle, 
  XCircle,
  Search,
  Filter,
  Calendar,
  User,
  Plus,
  Send,
  Edit
} from 'lucide-react'

interface ForumPost {
  id: string
  title: string
  content: string
  author: string
  createdAt: string
  likes: number
  comments: number
  isVisible: boolean
  replies?: Array<{
    id: string
    content: string
    author: string
    createdAt: string
  }>
}

export default function AdminForumPage() {
  const [posts, setPosts] = useState<ForumPost[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'visible' | 'hidden'>('all')
  const [selectedPost, setSelectedPost] = useState<ForumPost | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newPost, setNewPost] = useState({ title: '', content: '', author: '官方' })
  const [replyContent, setReplyContent] = useState('')
  const [replyAuthor, setReplyAuthor] = useState('官方')
  const [isCreating, setIsCreating] = useState(false)
  const [isReplying, setIsReplying] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // 檢查登入狀態
    const token = localStorage.getItem('adminToken')
    if (!token) {
      router.push('/admin/login')
      return
    }

    loadForumPosts()
  }, [router])

  const loadForumPosts = async () => {
    try {
      const response = await fetch('/api/admin/forum/posts', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setPosts(data.posts || [])
      }
    } catch (error) {
      console.error('載入討論區文章失敗:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggleVisibility = async (postId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/forum/posts/${postId}/toggle-visibility`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isVisible: !currentStatus })
      })

      if (response.ok) {
        setPosts(posts.map(post => 
          post.id === postId 
            ? { ...post, isVisible: !currentStatus }
            : post
        ))
      }
    } catch (error) {
      console.error('切換文章可見性失敗:', error)
    }
  }

  const handleDeletePost = async (postId: string) => {
    if (!confirm('確定要刪除這篇文章嗎？此操作無法復原。')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/forum/posts/${postId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      })

      if (response.ok) {
        setPosts(posts.filter(post => post.id !== postId))
        if (selectedPost?.id === postId) {
          setSelectedPost(null)
        }
      }
    } catch (error) {
      console.error('刪除文章失敗:', error)
    }
  }

  const handleCreatePost = async () => {
    if (!newPost.title.trim() || !newPost.content.trim()) {
      alert('請填寫標題和內容')
      return
    }

    setIsCreating(true)
    try {
      const response = await fetch('/api/admin/forum/posts/create', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newPost)
      })

      if (response.ok) {
        const result = await response.json()
        setPosts([result.post, ...posts])
        setNewPost({ title: '', content: '', author: '官方' })
        setShowCreateForm(false)
        alert('文章發布成功！')
      } else {
        const error = await response.json()
        alert(`發布失敗: ${error.error}`)
      }
    } catch (error) {
      console.error('發布文章失敗:', error)
      alert('發布文章失敗，請稍後再試')
    } finally {
      setIsCreating(false)
    }
  }

  const handleReply = async () => {
    if (!selectedPost || !replyContent.trim()) {
      alert('請填寫回復內容')
      return
    }

    setIsReplying(true)
    try {
      const response = await fetch(`/api/admin/forum/posts/${selectedPost.id}/reply`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          content: replyContent.trim(),
          author: replyAuthor.trim()
        })
      })

      if (response.ok) {
        const result = await response.json()
        setPosts(posts.map(post => 
          post.id === selectedPost.id 
            ? result.post
            : post
        ))
        setSelectedPost(result.post)
        setReplyContent('')
        setReplyAuthor('官方')
        alert('回復發布成功！')
      } else {
        const error = await response.json()
        alert(`發布失敗: ${error.error}`)
      }
    } catch (error) {
      console.error('發布回復失敗:', error)
      alert('發布回復失敗，請稍後再試')
    } finally {
      setIsReplying(false)
    }
  }

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.author.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'visible' && post.isVisible) ||
                         (filterStatus === 'hidden' && !post.isVisible)
    
    return matchesSearch && matchesFilter
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
            <div className="flex items-center justify-between w-full">
              <h1 className="text-xl font-bold text-gray-900">討論區管理</h1>
              <button
                onClick={() => setShowCreateForm(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>發布文章</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* 發文表單模態框 */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">發布新文章</h2>
              <button
                onClick={() => setShowCreateForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">文章標題</label>
                <input
                  type="text"
                  value={newPost.title}
                  onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="輸入文章標題..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">作者</label>
                <input
                  type="text"
                  value={newPost.author}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 mt-1">後台發文將自動標記為官方身份</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">文章內容</label>
                <textarea
                  value={newPost.content}
                  onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                  rows={8}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
                  placeholder="輸入文章內容..."
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowCreateForm(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleCreatePost}
                disabled={isCreating}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  isCreating
                    ? 'bg-gray-400 cursor-not-allowed text-white'
                    : 'bg-primary-600 text-white hover:bg-primary-700'
                }`}
              >
                {isCreating ? '發布中...' : '發布文章'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 主要內容 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 標題和統計 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-2">討論區文章管理</h2>
          <p className="text-gray-600">管理匿名討論區的所有文章</p>
          <div className="mt-4 flex items-center space-x-6 text-sm text-gray-500">
            <span>總文章數: {posts.length}</span>
            <span>可見文章: {posts.filter(p => p.isVisible).length}</span>
            <span>隱藏文章: {posts.filter(p => !p.isVisible).length}</span>
          </div>
        </motion.div>

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
                  placeholder="搜尋文章標題、內容或作者..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* 篩選 */}
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">全部文章</option>
                <option value="visible">可見文章</option>
                <option value="hidden">隱藏文章</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* 文章列表 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          {filteredPosts.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">沒有找到文章</h3>
              <p className="text-gray-600">請調整搜尋條件或篩選器</p>
            </div>
          ) : (
            filteredPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedPost(post)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{post.title}</h3>
                      {post.author === '官方' && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          <MessageSquare className="w-3 h-3 mr-1" />
                          官方
                        </span>
                      )}
                      {post.isVisible ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          可見
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          <XCircle className="w-3 h-3 mr-1" />
                          隱藏
                        </span>
                      )}
                    </div>
                    
                    <p className="text-gray-600 mb-4 line-clamp-2">{post.content}</p>
                    
                    <div className="flex items-center space-x-6 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <User className="w-4 h-4" />
                        <span>{post.author}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(post.createdAt).toLocaleDateString('zh-TW')}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MessageSquare className="w-4 h-4" />
                        <span>{post.comments} 回覆</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 ml-4" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => handleToggleVisibility(post.id, post.isVisible)}
                      className={`p-2 rounded-lg transition-colors ${
                        post.isVisible
                          ? 'text-red-600 hover:bg-red-50'
                          : 'text-green-600 hover:bg-green-50'
                      }`}
                      title={post.isVisible ? '隱藏文章' : '顯示文章'}
                    >
                      {post.isVisible ? <XCircle className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
                    </button>
                    <button
                      onClick={() => handleDeletePost(post.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="刪除文章"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </motion.div>

        {/* 文章詳情區域 */}
        {selectedPost && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">文章詳情</h2>
              <button
                onClick={() => setSelectedPost(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">文章標題</label>
                <p className="text-gray-900 font-semibold">{selectedPost.title}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">作者</label>
                <p className="text-gray-900">{selectedPost.author}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">發布時間</label>
                <p className="text-gray-900">{new Date(selectedPost.createdAt).toLocaleString('zh-TW')}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">文章內容</label>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-900 whitespace-pre-wrap">{selectedPost.content}</p>
                </div>
              </div>

              {/* 回復歷史 */}
              {selectedPost.replies && selectedPost.replies.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">回復歷史</label>
                  <div className="space-y-3">
                        {selectedPost.replies.map((reply) => (
                          <div key={reply.id} className={`rounded-lg p-4 border-l-4 ${
                            reply.author === '官方' 
                              ? 'bg-blue-50 border-blue-500' 
                              : 'bg-gray-50 border-gray-400'
                          }`}>
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-2">
                                <span className={`text-sm font-medium ${
                                  reply.author === '官方' ? 'text-blue-900' : 'text-gray-900'
                                }`}>
                                  {reply.author}
                                </span>
                                {reply.author === '官方' && (
                                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    <MessageSquare className="w-3 h-3 mr-1" />
                                    官方
                                  </span>
                                )}
                              </div>
                              <span className={`text-xs ${
                                reply.author === '官方' ? 'text-blue-600' : 'text-gray-600'
                              }`}>
                                {new Date(reply.createdAt).toLocaleString('zh-TW')}
                              </span>
                            </div>
                            <p className={`whitespace-pre-wrap text-sm ${
                              reply.author === '官方' ? 'text-blue-800' : 'text-gray-800'
                            }`}>
                              {reply.content}
                            </p>
                          </div>
                        ))}
                  </div>
                </div>
              )}

              {/* 回復表單 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">回復文章</label>
                <div className="space-y-3">
                  <input
                    type="text"
                    value={replyAuthor}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-500 mt-1">後台回復將自動標記為官方身份</p>
                  <textarea
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder="輸入回復內容..."
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
                  />
                  <button
                    onClick={handleReply}
                    disabled={isReplying || !replyContent.trim()}
                    className={`w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                      isReplying || !replyContent.trim()
                        ? 'bg-gray-400 cursor-not-allowed text-white'
                        : 'bg-primary-600 text-white hover:bg-primary-700'
                    }`}
                  >
                    {isReplying ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>發布中...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>發布回復</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <button
                onClick={() => handleToggleVisibility(selectedPost.id, selectedPost.isVisible)}
                className={`w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  selectedPost.isVisible
                    ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {selectedPost.isVisible ? (
                  <>
                    <EyeOff className="w-4 h-4" />
                    <span>隱藏文章</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4" />
                    <span>顯示文章</span>
                  </>
                )}
              </button>
              
              <button
                onClick={() => handleDeletePost(selectedPost.id)}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>刪除文章</span>
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
