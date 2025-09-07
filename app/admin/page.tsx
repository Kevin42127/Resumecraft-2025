'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { AlertTriangle, Shield, Home, ArrowLeft } from 'lucide-react'

export default function AdminPage() {
  const router = useRouter()

  useEffect(() => {
    // 記錄未授權訪問嘗試
    logUnauthorizedAccess()
    
    // 5秒後重定向到首頁
    const timer = setTimeout(() => {
      router.push('/')
    }, 5000)

    return () => clearTimeout(timer)
  }, [router])

  const logUnauthorizedAccess = async () => {
    try {
      await fetch('/api/admin/access-log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'unauthorized_admin_access',
          path: '/admin',
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-gray-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-lg"
      >
        {/* 404 錯誤卡片 */}
        <div className="bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl p-8 border border-white/20">
          {/* 404 標題 */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center justify-center w-24 h-24 bg-red-500/20 rounded-full mb-6 border border-red-400/30"
            >
              <AlertTriangle className="w-12 h-12 text-red-400" />
            </motion.div>
            <h1 className="text-6xl font-bold text-white mb-4">404</h1>
            <h2 className="text-2xl font-semibold text-gray-300 mb-2">頁面不存在</h2>
            <p className="text-gray-400">您訪問的頁面可能已被移動或刪除</p>
          </div>

          {/* 安全警告 */}
          <div className="mb-8 p-6 bg-red-500/20 border border-red-500/30 rounded-xl backdrop-blur-sm">
            <div className="flex items-start space-x-3">
              <Shield className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-red-300 font-medium mb-2">安全提醒</h3>
                <p className="text-red-200 text-sm leading-relaxed">
                  檢測到對管理區域的未授權訪問嘗試。所有訪問記錄已被安全系統記錄並監控。
                  如有疑問，請聯繫系統管理員。
                </p>
              </div>
            </div>
          </div>

          {/* 重定向倒計時 */}
          <div className="text-center mb-8">
            <div className="mb-4">
              <div className="inline-flex items-center space-x-2 text-gray-300">
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm">5秒後自動返回首頁</span>
              </div>
            </div>
            
            <div className="w-full bg-gray-700 rounded-full h-3 mb-6">
              <motion.div
                className="bg-gradient-to-r from-red-500 to-orange-500 h-3 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 5, ease: "linear" }}
              />
            </div>
          </div>

          {/* 操作按鈕 */}
          <div className="space-y-4">
            <button
              onClick={() => router.push('/')}
              className="w-full py-4 px-6 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-blue-500/25 flex items-center justify-center space-x-2"
            >
              <Home className="w-5 h-5" />
              <span>返回首頁</span>
            </button>
            
            <button
              onClick={() => router.back()}
              className="w-full py-3 px-6 bg-white/10 text-white rounded-xl font-medium hover:bg-white/20 transition-all duration-300 border border-white/20 flex items-center justify-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>返回上一頁</span>
            </button>
          </div>

          {/* 底部資訊 */}
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500">
              ResumeCraft - 安全系統 v2025
            </p>
            <p className="text-xs text-gray-600 mt-1">
              所有訪問記錄已加密保存
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
