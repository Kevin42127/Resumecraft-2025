'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { MessageSquare, Plus, Clock, User, ThumbsUp, MessageCircle, ArrowLeft, Shield } from 'lucide-react'
import ForumPostForm from '@/components/Forum/ForumPostForm'
import ForumPostList from '@/components/Forum/ForumPostList'
import { ForumPost } from '@/types/forum'

export default function ForumPage() {
  const [posts, setPosts] = useState<ForumPost[]>([])
  const [showPostForm, setShowPostForm] = useState(false)
  const [isLoading, setIsLoading] = useState(true)


  useEffect(() => {
    fetchPosts()
  }, [])

  const handleFeedbackClick = () => {
    // 在論壇頁面，意見回饋可以導向首頁或開啟回饋表單
    window.open('/', '_blank')
  }

  const handleExampleClick = () => {
    // 在論壇頁面，範例功能可以導向首頁的範例
    window.open('/', '_blank')
  }

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/forum/posts')
      if (response.ok) {
        const data = await response.json()
        setPosts(data.posts)
      }
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePostCreated = (newPost: ForumPost) => {
    setPosts([newPost, ...posts])
    setShowPostForm(false)
  }

  return (
    <div className="min-h-screen bg-primary-50">
      {/* Header */}
      <div className="bg-blue-900 border-b border-blue-800">
        <div className="max-w-6xl mx-auto px-6 py-4">
          {/* Top Navigation */}
          <div className="flex items-center justify-between mb-4">
            <Link href="/">
              <motion.button
                className="flex items-center space-x-2 px-3 py-2 text-gray-300 rounded-lg"
                whileTap={{ scale: 0.98 }}
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm font-medium">返回首頁</span>
              </motion.button>
            </Link>
            <motion.button
              onClick={() => setShowPostForm(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg shadow-sm"
              whileTap={{ scale: 0.95 }}
            >
              <Plus className="w-4 h-4" />
              <span className="font-medium">發文</span>
            </motion.button>
          </div>
          
          {/* Title Section */}
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-primary-100 rounded-xl">
              <MessageSquare className="w-8 h-8 text-primary-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">匿名討論區</h1>
              <p className="text-white mt-1">分享作品、討論履歷建議，無需註冊即可參與</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              </div>
            ) : (
              <ForumPostList posts={posts} onPostUpdate={fetchPosts} />
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stats */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">討論區統計</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">總討論數</span>
                  <span className="font-semibold text-gray-900">{posts.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">今日新增</span>
                  <span className="font-semibold text-gray-900">
                    {posts.filter(post => {
                      const today = new Date().toDateString()
                      return new Date(post.createdAt).toDateString() === today
                    }).length}
                  </span>
                </div>
              </div>
            </div>

            {/* Guidelines */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">討論區守則</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-primary-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span>保持友善，尊重他人意見</span>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-primary-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span>分享有建設性的建議</span>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-primary-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span>避免個人攻擊或歧視言論</span>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-primary-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span>保護個人隱私，不要分享敏感資訊</span>
                </div>
              </div>
              

            </div>
          </div>
        </div>
      </div>

      {/* Post Form Modal */}
      {showPostForm && (
        <ForumPostForm
          onClose={() => setShowPostForm(false)}
          onPostCreated={handlePostCreated}
        />
      )}

    </div>
  )
} 