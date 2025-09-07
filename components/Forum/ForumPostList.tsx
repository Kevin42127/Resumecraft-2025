'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  MessageSquare, 
  Clock, 
  User, 
  ThumbsUp, 
  MessageCircle,
  Eye,
  Calendar,
  Trash2
} from 'lucide-react'
import { ForumPost, DeveloperAuth } from '@/types/forum'
import ForumPostDetail from './ForumPostDetail'

interface ForumPostListProps {
  posts: ForumPost[]
  onPostUpdate: () => void
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

export default function ForumPostList({ posts, onPostUpdate }: ForumPostListProps) {
  const [selectedPost, setSelectedPost] = useState<ForumPost | null>(null)
  const [auth, setAuth] = useState<DeveloperAuth | null>(null)

  // 檢查開發者身份
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) {
      return '剛剛'
    } else if (diffInHours < 24) {
      return `${diffInHours}小時前`
    } else {
      return date.toLocaleDateString('zh-TW')
    }
  }

  const handlePostClick = (post: ForumPost) => {
    setSelectedPost(post)
  }

  const handleCloseDetail = () => {
    setSelectedPost(null)
    onPostUpdate()
  }

  const handleDeletePost = async (e: React.MouseEvent, post: ForumPost) => {
    e.stopPropagation() // 防止觸發貼文點擊
    
    if (!auth) return
    
    if (!confirm(`確定要刪除討論「${post.title}」嗎？`)) {
      return
    }

    try {
      const response = await fetch(`/api/forum/admin/posts/${post.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.token}`,
        },
        body: JSON.stringify({ reason: '開發者刪除' }),
      })

      if (response.ok) {
        alert('討論已刪除')
        onPostUpdate()
      } else {
        const error = await response.json()
        alert(error.error || '刪除失敗')
      }
    } catch (error) {
      console.error('Error deleting post:', error)
      alert('刪除失敗')
    }
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-900 rounded-full mb-4">
          <MessageSquare className="w-10 h-10 text-white" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">還沒有討論</h3>
        <p className="text-gray-600">成為第一個發文的人吧！</p>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-4">
        {posts.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer group"
            onClick={() => handlePostClick(post)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{categoryIcons[post.category]}</span>
                  <span className="text-sm font-medium text-primary-600 bg-primary-50 px-2 py-1 rounded">
                    {categoryLabels[post.category]}
                  </span>
                </div>
                <div className="flex items-center space-x-1 text-sm text-gray-500">
                  <User className="w-4 h-4" />
                  <span>{post.author}</span>
                </div>
              </div>
              <div className="flex items-center space-x-1 text-sm text-gray-500">
                <Clock className="w-4 h-4" />
                <span>{formatDate(post.createdAt)}</span>
              </div>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2">
              {post.title}
            </h3>

            <p className="text-gray-600 mb-4 line-clamp-3">
              {post.content}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <ThumbsUp className="w-4 h-4" />
                  <span>{post.likes}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MessageCircle className="w-4 h-4" />
                  <span>{post.comments.length}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Eye className="w-4 h-4" />
                  <span>0</span>
                </div>
              </div>
              
              {/* 開發者刪除按鈕 - 隱藏，只有通過快捷鍵進入開發者模式才顯示 */}
              {auth && (
                <button
                  onClick={(e) => handleDeletePost(e, post)}
                  className="flex items-center space-x-1 px-2 py-1 text-red-600 hover:text-red-700 hover:bg-red-50 rounded text-sm transition-colors opacity-0 group-hover:opacity-100"
                  title="刪除討論 (開發者功能)"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>刪除</span>
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Post Detail Modal */}
      {selectedPost && (
        <ForumPostDetail
          post={selectedPost}
          onClose={handleCloseDetail}
        />
      )}
    </>
  )
} 