'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  MessageSquare, 
  Mail, 
  Star, 
  Users, 
  LogOut, 
  BarChart3, 
  Settings,
  Eye,
  Trash2,
  CheckCircle,
  XCircle,
  Megaphone
} from 'lucide-react'

interface DashboardStats {
  totalPosts: number
  totalContacts: number
  totalFeedbacks: number
  totalAnnouncements: number
  recentActivity: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalPosts: 0,
    totalContacts: 0,
    totalFeedbacks: 0,
    totalAnnouncements: 0,
    recentActivity: 0
  })
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // 檢查登入狀態
    const token = localStorage.getItem('adminToken')
    if (!token) {
      router.push('/admin/login')
      return
    }

    // 載入統計數據
    loadDashboardStats()
  }, [router])

  const loadDashboardStats = async () => {
    try {
      const response = await fetch('/api/admin/stats', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('載入統計數據失敗:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    router.push('/admin/login')
  }

  const statCards = [
    {
      title: '討論區文章',
      value: stats.totalPosts,
      icon: <MessageSquare className="w-6 h-6" />,
      color: 'bg-blue-500',
      link: '/admin/forum'
    },
    {
      title: '聯絡訊息',
      value: stats.totalContacts,
      icon: <Mail className="w-6 h-6" />,
      color: 'bg-green-500',
      link: '/admin/contacts'
    },
    {
      title: '意見回饋',
      value: stats.totalFeedbacks,
      icon: <Star className="w-6 h-6" />,
      color: 'bg-yellow-500',
      link: '/admin/feedbacks'
    },
    {
      title: '公告管理',
      value: stats.totalAnnouncements,
      icon: <Megaphone className="w-6 h-6" />,
      color: 'bg-purple-500',
      link: '/admin/announcements'
    }
  ]

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
              <h1 className="text-xl font-bold text-gray-900">ResumeCraft 後台管理</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span>登出</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* 主要內容 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 歡迎訊息 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-2">管理面板</h2>
          <p className="text-gray-600">歡迎使用 ResumeCraft 後台管理系統</p>
        </motion.div>

        {/* 統計卡片 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {statCards.map((card, index) => (
            <Link key={index} href={card.link}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">{card.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                  </div>
                  <div className={`p-3 rounded-full ${card.color} text-white`}>
                    {card.icon}
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </motion.div>

        {/* 快速操作 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {/* 管理功能 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">管理功能</h3>
            <div className="space-y-3">
              <Link href="/admin/forum" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <MessageSquare className="w-5 h-5 text-blue-600" />
                <span className="text-gray-700">管理討論區文章</span>
              </Link>
              <Link href="/admin/contacts" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <Mail className="w-5 h-5 text-green-600" />
                <span className="text-gray-700">管理聯絡訊息</span>
              </Link>
              <Link href="/admin/feedbacks" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <Star className="w-5 h-5 text-yellow-600" />
                <span className="text-gray-700">管理意見回饋</span>
              </Link>
              <Link href="/admin/announcements" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <Megaphone className="w-5 h-5 text-purple-600" />
                <span className="text-gray-700">管理公告</span>
              </Link>
            </div>
          </div>

          {/* 系統資訊 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">系統資訊</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">系統版本</span>
                <span className="text-gray-900 font-medium">v1.0.0</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">最後更新</span>
                <span className="text-gray-900 font-medium">2025-09-07</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">管理員</span>
                <span className="text-gray-900 font-medium">Admin</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
