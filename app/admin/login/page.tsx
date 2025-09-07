'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { AlertTriangle, Shield, Lock } from 'lucide-react'

export default function AdminLoginPage() {
  const router = useRouter()

  useEffect(() => {
    // 記錄未授權訪問嘗試
    logUnauthorizedAccess()
    
    // 3秒後重定向到首頁
    const timer = setTimeout(() => {
      router.push('/')
    }, 3000)

    return () => clearTimeout(timer)
  }, [router])

  const logUnauthorizedAccess = async () => {
    try {
      await fetch('/api/admin/access-log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'unauthorized_access',
          path: '/admin/login',
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          ip: 'client-side'
        })
      })
    } catch (error) {
      console.error('Failed to log unauthorized access:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        {/* 警告卡片 */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-red-200">
          {/* 標題 */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-red-900 mb-2">訪問被拒絕</h1>
            <p className="text-red-700">此頁面不存在或您沒有訪問權限</p>
          </div>

          {/* 安全提示 */}
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center space-x-2 text-red-700">
              <Shield className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm">
                所有訪問嘗試已被記錄並監控
              </span>
            </div>
          </div>

          {/* 重定向提示 */}
          <div className="text-center">
            <div className="mb-4">
              <div className="inline-flex items-center space-x-2 text-gray-600">
                <Lock className="w-4 h-4" />
                <span className="text-sm">3秒後自動重定向到首頁</span>
              </div>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
              <motion.div
                className="bg-red-500 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 3, ease: "linear" }}
              />
            </div>

            <button
              onClick={() => router.push('/')}
              className="w-full py-3 px-4 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
            >
              立即返回首頁
            </button>
          </div>

          {/* 底部資訊 */}
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500">
              ResumeCraft - 安全系統已啟動
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
