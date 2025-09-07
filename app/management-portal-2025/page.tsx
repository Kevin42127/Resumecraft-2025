'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Lock, User, Eye, EyeOff, AlertCircle, Shield, Clock, MapPin } from 'lucide-react'

function ManagementPortalContent() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [accessKey, setAccessKey] = useState('')
  const [isValidAccess, setIsValidAccess] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  // 檢查訪問權限
  useEffect(() => {
    const key = searchParams.get('access')
    const validKey = 'verified'
    
    if (key === validKey) {
      setIsValidAccess(true)
      setAccessKey(key)
    } else {
      // 記錄未授權訪問嘗試
      logAccessAttempt('invalid_key', key || 'none')
      router.push('/404')
    }
  }, [searchParams, router])

  // 記錄訪問嘗試
  const logAccessAttempt = async (type: string, key: string) => {
    try {
      await fetch('/api/admin/access-log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          key,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          ip: 'client-side' // 實際應用中應該從服務器獲取
        })
      })
    } catch (error) {
      console.error('Failed to log access attempt:', error)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          accessKey,
          timestamp: new Date().toISOString()
        }),
      })

      const result = await response.json()

      if (response.ok) {
        // 記錄成功登入
        logAccessAttempt('successful_login', accessKey)
        // 登入成功，儲存 token 並跳轉到管理面板
        localStorage.setItem('adminToken', result.token)
        router.push('/admin/dashboard')
      } else {
        // 記錄失敗登入
        logAccessAttempt('failed_login', accessKey)
        setError(result.error || '登入失敗')
      }
    } catch (error) {
      logAccessAttempt('network_error', accessKey)
      setError('網路錯誤，請稍後再試')
    } finally {
      setIsLoading(false)
    }
  }

  // 如果沒有有效訪問權限，不顯示內容
  if (!isValidAccess) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        {/* 安全提示 */}
        <div className="mb-6 p-4 bg-green-900/30 border border-green-500/30 rounded-lg backdrop-blur-sm">
          <div className="flex items-center space-x-2 text-green-400">
            <Shield className="w-5 h-5" />
            <span className="text-sm font-medium">安全通道已建立</span>
          </div>
        </div>

        {/* 登入卡片 */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/20">
          {/* 標題 */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500/20 rounded-full mb-4 border border-blue-400/30">
              <Lock className="w-8 h-8 text-blue-400" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">管理入口</h1>
            <p className="text-gray-300">ResumeCraft 後台管理系統</p>
            
            {/* 訪問資訊 */}
            <div className="mt-4 space-y-2 text-xs text-gray-400">
              <div className="flex items-center justify-center space-x-2">
                <Clock className="w-3 h-3" />
                <span>{new Date().toLocaleString('zh-TW')}</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <MapPin className="w-3 h-3" />
                <span>安全通道</span>
              </div>
            </div>
          </div>

          {/* 錯誤訊息 */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg flex items-center space-x-2 backdrop-blur-sm"
            >
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <span className="text-red-300 text-sm">{error}</span>
            </motion.div>
          )}

          {/* 登入表單 */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 使用者名稱 */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
                使用者名稱
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-white placeholder-gray-400 backdrop-blur-sm"
                  placeholder="請輸入使用者名稱"
                  required
                />
              </div>
            </div>

            {/* 密碼 */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                密碼
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-white placeholder-gray-400 backdrop-blur-sm"
                  placeholder="請輸入密碼"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {/* 登入按鈕 */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                isLoading
                  ? 'bg-gray-600 cursor-not-allowed text-gray-300'
                  : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-blue-500/25'
              }`}
            >
              {isLoading ? '登入中...' : '安全登入'}
            </button>
          </form>

          {/* 底部資訊 */}
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-400">
              ResumeCraft 管理入口 v2025
            </p>
            <p className="text-xs text-gray-500 mt-1">
              所有訪問記錄已加密保存
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default function ManagementPortalPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white">載入中...</div>
      </div>
    }>
      <ManagementPortalContent />
    </Suspense>
  )
}
