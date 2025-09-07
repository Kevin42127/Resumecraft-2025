'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, 
  Mail, 
  User, 
  Calendar, 
  MessageSquare, 
  Trash2, 
  Eye,
  Search,
  Filter,
  CheckCircle,
  Clock,
  Reply,
  Send
} from 'lucide-react'

interface ContactMessage {
  id: string
  name: string
  email: string
  subject: string
  message: string
  createdAt: string
  isRead: boolean
  isReplied: boolean
  replies?: Array<{
    id: string
    message: string
    adminName: string
    createdAt: string
  }>
}

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState<ContactMessage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'unread' | 'read' | 'replied'>('all')
  const [selectedContact, setSelectedContact] = useState<ContactMessage | null>(null)
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

    loadContacts()
  }, [router])

  const loadContacts = async () => {
    try {
      const response = await fetch('/api/admin/contacts', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setContacts(data.contacts || [])
      }
    } catch (error) {
      console.error('載入聯絡訊息失敗:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleMarkAsRead = async (contactId: string) => {
    try {
      const response = await fetch(`/api/admin/contacts/${contactId}/mark-read`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        setContacts(contacts.map(contact => 
          contact.id === contactId 
            ? { ...contact, isRead: true }
            : contact
        ))
        if (selectedContact?.id === contactId) {
          setSelectedContact({ ...selectedContact, isRead: true })
        }
      }
    } catch (error) {
      console.error('標記為已讀失敗:', error)
    }
  }

  const handleMarkAsReplied = async (contactId: string) => {
    try {
      const response = await fetch(`/api/admin/contacts/${contactId}/mark-replied`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        setContacts(contacts.map(contact => 
          contact.id === contactId 
            ? { ...contact, isReplied: true }
            : contact
        ))
        if (selectedContact?.id === contactId) {
          setSelectedContact({ ...selectedContact, isReplied: true })
        }
      }
    } catch (error) {
      console.error('標記為已回覆失敗:', error)
    }
  }

  const handleDeleteContact = async (contactId: string) => {
    if (!confirm('確定要刪除這則聯絡訊息嗎？此操作無法復原。')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/contacts/${contactId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      })

      if (response.ok) {
        setContacts(contacts.filter(contact => contact.id !== contactId))
        if (selectedContact?.id === contactId) {
          setSelectedContact(null)
        }
      }
    } catch (error) {
      console.error('刪除聯絡訊息失敗:', error)
    }
  }

  const handleReply = async () => {
    if (!selectedContact || !replyMessage.trim()) {
      return
    }

    setIsReplying(true)
    try {
      const response = await fetch(`/api/admin/contacts/${selectedContact.id}/reply`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: replyMessage.trim() })
      })

      if (response.ok) {
        const result = await response.json()
        setContacts(contacts.map(contact => 
          contact.id === selectedContact.id 
            ? result.contact
            : contact
        ))
        setSelectedContact(result.contact)
        setReplyMessage('')
        alert('回復已發送！')
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

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.message.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'unread' && !contact.isRead) ||
                         (filterStatus === 'read' && contact.isRead && !contact.isReplied) ||
                         (filterStatus === 'replied' && contact.isReplied)
    
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
            <h1 className="text-xl font-bold text-gray-900">聯絡訊息管理</h1>
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
          <h2 className="text-3xl font-bold text-gray-900 mb-2">聯絡訊息管理</h2>
          <p className="text-gray-600">管理來自聯絡表單的所有訊息</p>
          <div className="mt-4 flex items-center space-x-6 text-sm text-gray-500">
            <span>總訊息數: {contacts.length}</span>
            <span>未讀訊息: {contacts.filter(c => !c.isRead).length}</span>
            <span>已回覆: {contacts.filter(c => c.isReplied).length}</span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左側：訊息列表 */}
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
                      placeholder="搜尋姓名、電子郵件、主題或內容..."
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
                    <option value="all">全部訊息</option>
                    <option value="unread">未讀訊息</option>
                    <option value="read">已讀未回覆</option>
                    <option value="replied">已回覆</option>
                  </select>
                </div>
              </div>
            </motion.div>

            {/* 訊息列表 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-4"
            >
              {filteredContacts.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                  <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">沒有找到訊息</h3>
                  <p className="text-gray-600">請調整搜尋條件或篩選器</p>
                </div>
              ) : (
                filteredContacts.map((contact, index) => (
                  <motion.div
                    key={contact.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`bg-white rounded-lg shadow-sm border p-6 cursor-pointer transition-colors ${
                      selectedContact?.id === contact.id 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedContact(contact)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{contact.subject}</h3>
                          {!contact.isRead && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              <Clock className="w-3 h-3 mr-1" />
                              未讀
                            </span>
                          )}
                          {contact.isReplied && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              已回覆
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-6 text-sm text-gray-500 mb-2">
                          <div className="flex items-center space-x-1">
                            <User className="w-4 h-4" />
                            <span>{contact.name}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Mail className="w-4 h-4" />
                            <span>{contact.email}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(contact.createdAt).toLocaleDateString('zh-TW')}</span>
                          </div>
                        </div>
                        
                        <p className="text-gray-600 line-clamp-2">{contact.message}</p>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </motion.div>
          </div>

          {/* 右側：訊息詳情 */}
          <div className="lg:col-span-1">
            {selectedContact ? (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-8"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">訊息詳情</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">主題</label>
                    <p className="text-gray-900">{selectedContact.subject}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">姓名</label>
                    <p className="text-gray-900">{selectedContact.name}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">電子郵件</label>
                    <a 
                      href={`mailto:${selectedContact.email}`}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      {selectedContact.email}
                    </a>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">發送時間</label>
                    <p className="text-gray-900">{new Date(selectedContact.createdAt).toLocaleString('zh-TW')}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">訊息內容</label>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-900 whitespace-pre-wrap">{selectedContact.message}</p>
                    </div>
                  </div>

                  {/* 回復歷史 */}
                  {selectedContact.replies && selectedContact.replies.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">回復歷史</label>
                      <div className="space-y-3">
                        {selectedContact.replies.map((reply) => (
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
                  {!selectedContact.isRead && (
                    <button
                      onClick={() => handleMarkAsRead(selectedContact.id)}
                      className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      <span>標記為已讀</span>
                    </button>
                  )}
                  
                  {!selectedContact.isReplied && (
                    <button
                      onClick={() => handleMarkAsReplied(selectedContact.id)}
                      className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>標記為已回覆</span>
                    </button>
                  )}
                  
                  <button
                    onClick={() => handleDeleteContact(selectedContact.id)}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>刪除訊息</span>
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center"
              >
                <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">選擇訊息</h3>
                <p className="text-gray-600">點擊左側的訊息查看詳情</p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
