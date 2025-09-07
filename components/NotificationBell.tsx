'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, X, ExternalLink, Sparkles, Megaphone } from 'lucide-react'

interface Notification {
  id: string
  title: string
  content: string
  link?: string
  linkText?: string
  timestamp: Date
  isRead: boolean
}

interface NotificationBellProps {
  className?: string
}

export default function NotificationBell({ className = '' }: NotificationBellProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [hasUnread, setHasUnread] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // 初始化通知
  useEffect(() => {
    const savedNotifications = localStorage.getItem('resumecraft-notifications')
    if (savedNotifications) {
      const parsed = JSON.parse(savedNotifications).map((n: any) => ({
        ...n,
        timestamp: new Date(n.timestamp)
      }))
      setNotifications(parsed)
      setHasUnread(parsed.some((n: Notification) => !n.isRead))
    }
  }, [])

  // 載入活躍的公告並創建通知
  useEffect(() => {
    const loadActiveAnnouncements = async () => {
      try {
        // 從 API 獲取活躍的公告
        const response = await fetch('/api/announcements')
        if (response.ok) {
          const result = await response.json()
          if (result.success && result.data && result.data.length > 0) {
            // 獲取當前通知列表
            const currentNotifications = JSON.parse(localStorage.getItem('resumecraft-notifications') || '[]')
            const existingNotificationIds = currentNotifications.map((n: any) => n.id)
            
            // 為每個活躍公告創建通知（如果尚未存在）
            result.data.forEach((announcement: any) => {
              const notificationId = `announcement-${announcement.id}`
              
              if (!existingNotificationIds.includes(notificationId)) {
                const announcementNotification: Notification = {
                  id: notificationId,
                  title: announcement.title,
                  content: announcement.content,
                  link: announcement.link,
                  linkText: announcement.linkText || '查看詳情',
                  timestamp: new Date(announcement.createdAt),
                  isRead: false
                }
                
                addNotification(announcementNotification)
              }
            })
          }
        }
      } catch (error) {
        console.error('載入公告失敗:', error)
      }
    }

    // 初始載入
    loadActiveAnnouncements()

    // 定期檢查新公告（每5分鐘）
    const interval = setInterval(loadActiveAnnouncements, 5 * 60 * 1000)
    
    return () => {
      clearInterval(interval)
    }
  }, [])

  const addNotification = (notification: Notification) => {
    setNotifications(prev => {
      const newNotifications = [notification, ...prev]
      setHasUnread(true)
      localStorage.setItem('resumecraft-notifications', JSON.stringify(newNotifications))
      return newNotifications
    })
  }

  const markAsRead = (notificationId: string) => {
    const updatedNotifications = notifications.map(n => 
      n.id === notificationId ? { ...n, isRead: true } : n
    )
    setNotifications(updatedNotifications)
    setHasUnread(updatedNotifications.some(n => !n.isRead))
    localStorage.setItem('resumecraft-notifications', JSON.stringify(updatedNotifications))
  }

  const removeNotification = (notificationId: string) => {
    const updatedNotifications = notifications.filter(n => n.id !== notificationId)
    setNotifications(updatedNotifications)
    setHasUnread(updatedNotifications.some(n => !n.isRead))
    localStorage.setItem('resumecraft-notifications', JSON.stringify(updatedNotifications))
  }

  const markAllAsRead = () => {
    const updatedNotifications = notifications.map(n => ({ ...n, isRead: true }))
    setNotifications(updatedNotifications)
    setHasUnread(false)
    localStorage.setItem('resumecraft-notifications', JSON.stringify(updatedNotifications))
  }

  // 點擊外部關閉下拉選單
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showDropdown])

  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return '剛剛'
    if (minutes < 60) return `${minutes} 分鐘前`
    if (hours < 24) return `${hours} 小時前`
    if (days < 7) return `${days} 天前`
    return date.toLocaleDateString('zh-TW')
  }

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Bell Icon */}
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative flex items-center justify-center w-10 h-10 text-gray-300 hover:text-white transition-colors"
      >
        <Bell className="w-6 h-6" />
        {hasUnread && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"
          />
        )}
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-2xl border border-gray-200 z-50 max-h-96 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
              <h3 className="font-semibold text-gray-900">通知</h3>
              {hasUnread && (
                <button
                  onClick={markAllAsRead}
                  className="text-sm text-primary-600 hover:text-primary-700 transition-colors"
                >
                  全部標為已讀
                </button>
              )}
            </div>

            {/* Notifications List */}
            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  <Bell className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                  <p>暫無通知</p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                      !notification.isRead ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1">
                        {notification.id.startsWith('announcement-') ? (
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                            !notification.isRead ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-400'
                          }`}>
                            <Megaphone className="w-3 h-3" />
                          </div>
                        ) : (
                          !notification.isRead ? (
                            <div className="w-2 h-2 bg-primary-600 rounded-full" />
                          ) : (
                            <div className="w-2 h-2 bg-gray-300 rounded-full" />
                          )
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-2">
                            <h4 className="text-sm font-medium text-gray-900">
                              {notification.title}
                            </h4>
                            {notification.id.startsWith('announcement-') && (
                              <span className="px-2 py-0.5 text-xs font-medium text-purple-600 bg-purple-100 rounded-full">
                                公告
                              </span>
                            )}
                          </div>
                          <button
                            onClick={() => removeNotification(notification.id)}
                            className="text-gray-400 hover:text-gray-600 transition-colors ml-2"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                          {notification.content}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">
                            {formatTime(notification.timestamp)}
                          </span>
                          
                          {notification.link && (
                            <button
                              onClick={() => {
                                markAsRead(notification.id)
                                window.open(notification.link, '_blank')
                              }}
                              className="text-xs text-primary-600 hover:text-primary-700 transition-colors flex items-center space-x-1"
                            >
                              <span>{notification.linkText || '查看詳情'}</span>
                              <ExternalLink className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="p-3 border-t border-gray-200 bg-gray-50">
                <button
                  onClick={() => setShowDropdown(false)}
                  className="w-full text-sm text-gray-600 hover:text-gray-800 transition-colors"
                >
                  關閉
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
