'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  Calendar,
  AlertCircle,
  CheckCircle,
  Clock,
  ExternalLink,
  Save,
  X
} from 'lucide-react'
import { Announcement, CreateAnnouncementRequest } from '@/types/announcement'

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null)
  const [formData, setFormData] = useState<CreateAnnouncementRequest>({
    title: '',
    content: '',
    link: '',
    linkText: '',
    isActive: true,
    priority: 'medium',
    startDate: new Date().toISOString().split('T')[0],
    endDate: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // 檢查登入狀態
    const token = localStorage.getItem('adminToken')
    if (!token) {
      router.push('/admin/login')
      return
    }

    loadAnnouncements()
  }, [router])

  const loadAnnouncements = async () => {
    try {
      const response = await fetch('/api/admin/announcements', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      })

      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          setAnnouncements(result.data || [])
        }
      }
    } catch (error) {
      console.error('載入公告失敗:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const url = editingAnnouncement 
        ? `/api/admin/announcements/${editingAnnouncement.id}`
        : '/api/admin/announcements'
      
      const method = editingAnnouncement ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          await loadAnnouncements()
          resetForm()
          alert(editingAnnouncement ? '公告更新成功' : '公告創建成功')
        } else {
          alert(result.message || '操作失敗')
        }
      } else {
        alert('操作失敗')
      }
    } catch (error) {
      console.error('提交失敗:', error)
      alert('操作失敗')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (announcement: Announcement) => {
    setEditingAnnouncement(announcement)
    setFormData({
      title: announcement.title,
      content: announcement.content,
      link: announcement.link || '',
      linkText: announcement.linkText || '',
      isActive: announcement.isActive,
      priority: announcement.priority,
      startDate: announcement.startDate.split('T')[0],
      endDate: announcement.endDate ? announcement.endDate.split('T')[0] : ''
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('確定要刪除這個公告嗎？')) return

    try {
      const response = await fetch(`/api/admin/announcements/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      })

      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          await loadAnnouncements()
          alert('公告刪除成功')
        } else {
          alert(result.message || '刪除失敗')
        }
      } else {
        alert('刪除失敗')
      }
    } catch (error) {
      console.error('刪除失敗:', error)
      alert('刪除失敗')
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      link: '',
      linkText: '',
      isActive: true,
      priority: 'medium',
      startDate: new Date().toISOString().split('T')[0],
      endDate: ''
    })
    setEditingAnnouncement(null)
    setShowForm(false)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'low': return 'text-green-600 bg-green-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high': return '高'
      case 'medium': return '中'
      case 'low': return '低'
      default: return '未知'
    }
  }

  const isActive = (announcement: Announcement) => {
    if (!announcement.isActive) return false
    
    const now = new Date()
    const startDate = new Date(announcement.startDate)
    if (startDate > now) return false
    
    if (announcement.endDate) {
      const endDate = new Date(announcement.endDate)
      if (endDate < now) return false
    }
    
    return true
  }

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
              <button
                onClick={() => router.back()}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                ← 返回
              </button>
              <h1 className="text-xl font-bold text-gray-900">公告管理</h1>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>新增公告</span>
            </button>
          </div>
        </div>
      </nav>

      {/* 主要內容 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 公告列表 */}
        <div className="grid gap-6">
          {announcements.length === 0 ? (
            <div className="text-center py-12">
              <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">暫無公告</h3>
              <p className="text-gray-600 mb-4">點擊上方按鈕新增第一個公告</p>
            </div>
          ) : (
            announcements.map((announcement) => (
              <motion.div
                key={announcement.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {announcement.title}
                      </h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(announcement.priority)}`}>
                        {getPriorityText(announcement.priority)}優先級
                      </span>
                      {isActive(announcement) ? (
                        <span className="flex items-center space-x-1 text-green-600 text-sm">
                          <CheckCircle className="w-4 h-4" />
                          <span>活躍</span>
                        </span>
                      ) : (
                        <span className="flex items-center space-x-1 text-gray-500 text-sm">
                          <Clock className="w-4 h-4" />
                          <span>非活躍</span>
                        </span>
                      )}
                    </div>
                    
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {announcement.content}
                    </p>
                    
                    {announcement.link && (
                      <div className="flex items-center space-x-2 text-blue-600 mb-4">
                        <ExternalLink className="w-4 h-4" />
                        <a 
                          href={announcement.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm hover:underline"
                        >
                          {announcement.linkText || announcement.link}
                        </a>
                      </div>
                    )}
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>開始: {new Date(announcement.startDate).toLocaleDateString('zh-TW')}</span>
                      </div>
                      {announcement.endDate && (
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>結束: {new Date(announcement.endDate).toLocaleDateString('zh-TW')}</span>
                        </div>
                      )}
                      <span>創建: {new Date(announcement.createdAt).toLocaleDateString('zh-TW')}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => handleEdit(announcement)}
                      className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(announcement.id)}
                      className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* 新增/編輯表單 */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={(e) => e.target === e.currentTarget && resetForm()}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">
                  {editingAnnouncement ? '編輯公告' : '新增公告'}
                </h2>
                <button
                  onClick={resetForm}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    標題 *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="輸入公告標題"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    內容 *
                  </label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={4}
                    placeholder="輸入公告內容"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      開始日期 *
                    </label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      結束日期
                    </label>
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      優先級
                    </label>
                    <select
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value as 'low' | 'medium' | 'high' })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="low">低</option>
                      <option value="medium">中</option>
                      <option value="high">高</option>
                    </select>
                  </div>

                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                      啟用公告
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    外部連結
                  </label>
                  <input
                    type="url"
                    value={formData.link}
                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    連結文字
                  </label>
                  <input
                    type="text"
                    value={formData.linkText}
                    onChange={(e) => setFormData({ ...formData, linkText: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="查看詳情"
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>處理中...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>{editingAnnouncement ? '更新' : '創建'}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
