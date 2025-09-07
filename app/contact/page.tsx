'use client'

import Link from 'next/link'
import { ArrowLeft, Mail, MessageSquare, Phone, MapPin, Clock, Send } from 'lucide-react'
import { motion } from 'framer-motion'
import { useState } from 'react'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (response.ok) {
        setSubmitStatus('success')
        setFormData({ name: '', email: '', subject: '', message: '' })
      } else {
        setSubmitStatus('error')
        console.error('提交失敗:', result.error)
      }
    } catch (error) {
      setSubmitStatus('error')
      console.error('提交錯誤:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-primary-50">
      {/* Header */}
      <div className="bg-blue-900 border-b border-blue-800">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2 text-gray-300">
              <ArrowLeft className="w-5 h-5" />
              <span>返回首頁</span>
            </Link>
            <div className="flex items-center space-x-2">
              <MessageSquare className="w-6 h-6 text-primary-600" />
              <h1 className="text-2xl font-bold text-white">聯絡我們</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          {/* Introduction */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">我們很樂意聽到您的聲音</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              如果您有任何問題、建議或需要協助，請隨時與我們聯絡。我們會盡快回覆您的訊息。
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Contact Form */}
            <div className="bg-white rounded-xl shadow-material border border-gray-100 p-8">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">發送訊息</h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    姓名 *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
                    placeholder="請輸入您的姓名"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    電子郵件 *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
                    placeholder="請輸入您的電子郵件"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    主題 *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
                    placeholder="請輸入訊息主題"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    訊息內容 *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors resize-none"
                    placeholder="請詳細描述您的問題或建議..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full font-medium py-3 px-6 rounded-lg flex items-center justify-center space-x-2 transition-colors ${
                    isSubmitting 
                      ? 'bg-gray-400 cursor-not-allowed text-white' 
                      : 'bg-primary-600 hover:bg-primary-700 text-white'
                  }`}
                >
                  <Send className="w-5 h-5 text-white" />
                  <span className="text-white">{isSubmitting ? '發送中...' : '發送訊息'}</span>
                </button>

                {/* 提交狀態顯示 */}
                {submitStatus === 'success' && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-800 text-center">
                      ✅ 郵件發送成功！我們會盡快回覆您。
                    </p>
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-800 text-center">
                      ❌ 郵件發送失敗，請稍後再試或直接發送郵件至 tyouxipindao@gmail.com
                    </p>
                  </div>
                )}
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-6">
              {/* Contact Methods */}
              <div className="bg-white rounded-xl shadow-material border border-gray-100 p-8">
                <h3 className="text-2xl font-semibold text-gray-900 mb-6">聯絡方式</h3>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-primary-100 rounded-lg">
                      <Mail className="w-6 h-6 text-primary-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">電子郵件</h4>
                      <p className="text-gray-600">tyouxipindao@gmail.com</p>
                      <p className="text-sm text-gray-500 mt-1">我們會在 24 小時內回覆</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-primary-100 rounded-lg">
                      <MessageSquare className="w-6 h-6 text-primary-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">意見回饋</h4>
                      <p className="text-gray-600">使用網站內建的回饋功能</p>
                      <p className="text-sm text-gray-500 mt-1">快速回饋您的使用體驗</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Response Time */}
              <div className="bg-white rounded-xl shadow-material border border-gray-100 p-8">
                <h3 className="text-2xl font-semibold text-gray-900 mb-6">回覆時間</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-primary-600" />
                    <div>
                      <p className="font-medium text-gray-900">一般詢問</p>
                      <p className="text-sm text-gray-600">24 小時內回覆</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-primary-600" />
                    <div>
                      <p className="font-medium text-gray-900">技術問題</p>
                      <p className="text-sm text-gray-600">48 小時內回覆</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-primary-600" />
                    <div>
                      <p className="font-medium text-gray-900">功能建議</p>
                      <p className="text-sm text-gray-600">1-3 個工作天回覆</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* FAQ */}
              <div className="bg-white rounded-xl shadow-material border border-gray-100 p-8">
                <h3 className="text-2xl font-semibold text-gray-900 mb-6">常見問題</h3>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">如何匯出履歷？</h4>
                    <p className="text-sm text-gray-600">在編輯器中完成履歷後，點擊右上角的「匯出 PDF」按鈕即可下載。</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">履歷資料會保存嗎？</h4>
                    <p className="text-sm text-gray-600">您的履歷資料會自動保存在瀏覽器中，下次開啟時會自動載入。</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">可以自訂模板嗎？</h4>
                    <p className="text-sm text-gray-600">目前提供多種預設模板，未來會考慮加入更多自訂選項。</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="bg-blue-900 py-8 mt-16">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <p className="text-sm text-white">
              © 2025 ResumeCraft. 保留所有權利。
            </p>
            <div className="flex space-x-4">
              <Link href="/privacy" className="text-sm text-white">
                隱私政策
              </Link>
              <Link href="/terms" className="text-sm text-white">
                服務條款
              </Link>
              <Link href="/about" className="text-sm text-white">
                關於我們
              </Link>
              <Link href="/support" className="text-sm text-white">
                支持我們
              </Link>
              <Link href="/" className="text-sm text-white">
                返回首頁
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
