'use client'

import Link from 'next/link'
import { ArrowLeft, Heart, Shield, Code, Lightbulb, Users, Github, Mail } from 'lucide-react'
import { motion } from 'framer-motion'

export default function AboutPage() {
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
              <Heart className="w-6 h-6 text-primary-600" />
              <h1 className="text-2xl font-bold text-white">關於我們</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-lg shadow-lg p-8"
        >
          {/* Introduction */}
          <section className="mb-12">
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="inline-flex items-center justify-center w-20 h-20 bg-primary-100 rounded-full mb-6"
              >
                <span className="text-4xl">👋</span>
              </motion.div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">關於我們（About Us）</h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                ResumeCraft 是由我個人開發並持續維護的現代化履歷製作工具，致力於為每位用戶提供專業、安全、易用的履歷製作體驗。我們專注於隱私保護，提供免註冊、免追蹤的優質服務。
              </p>
            </div>
          </section>

          {/* Why We Built This */}
          <section className="mb-12">
            <div className="flex items-center space-x-3 mb-6">
              <Lightbulb className="w-6 h-6 text-yellow-600" />
              <h3 className="text-2xl font-semibold text-gray-900">💡 為什麼會做這個？</h3>
            </div>
            <div className="space-y-6">
              <p className="text-gray-700 leading-relaxed">
                市面上雖有許多履歷工具，但常見問題包括：
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-red-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-red-900 mb-2">🚫 強迫登入、廣告干擾</h4>
                  <p className="text-red-700 text-sm">許多平台要求註冊才能使用，且充斥廣告</p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-orange-900 mb-2">📱 使用體驗過時</h4>
                  <p className="text-orange-700 text-sm">介面設計老舊，樣式過於陽春</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">🔒 隱私問題</h4>
                  <p className="text-blue-700 text-sm">不重視資料隱私，甚至儲存履歷在伺服器端</p>
                </div>
              </div>
              <div className="bg-green-50 p-6 rounded-lg">
                <p className="text-green-800 leading-relaxed">
                  這些都不是我想要的。所以我投入大量時間和精力，從零開始開發了 ResumeCraft：一個免註冊、免追蹤、即用即走，且擁有專業介面與高品質 PDF 匯出功能的履歷編輯工具。每一個功能都經過精心設計和優化，確保為用戶提供最佳的體驗。
                </p>
              </div>
            </div>
          </section>

          {/* Technology Stack */}
          <section className="mb-12">
            <div className="flex items-center space-x-3 mb-6">
              <Code className="w-6 h-6 text-blue-600" />
              <h3 className="text-2xl font-semibold text-gray-900">🛠 使用的技術堆疊</h3>
            </div>
            <p className="text-gray-700 leading-relaxed mb-6">
              我在這個專案中主要使用了以下技術：
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">Next.js (App Router)</h4>
                <p className="text-blue-700 text-sm">前端架構與路由管理</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-semibold text-purple-900 mb-2">Tailwind CSS + Material Design</h4>
                <p className="text-purple-700 text-sm">統一視覺風格</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-900 mb-2">Framer Motion</h4>
                <p className="text-green-700 text-sm">首頁與介面動畫</p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <h4 className="font-semibold text-orange-900 mb-2">react-hook-form</h4>
                <p className="text-orange-700 text-sm">履歷表單處理</p>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <h4 className="font-semibold text-red-900 mb-2">雙重 PDF 生成方案（Puppeteer + html2canvas + jsPDF）</h4>
                <p className="text-red-700 text-sm">後端使用 Puppeteer 生成高品質 PDF，前端備用 html2canvas + jsPDF 方案，完整支援中文字體與複雜排版</p>
              </div>
            </div>
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700 text-center">
                <strong>這個網站從介面設計、功能架構、API 撰寫到測試，都是我一人完成。</strong>
                <br />
                <span className="text-sm text-gray-600 mt-2 block">
                  採用現代化技術棧，確保系統穩定性和可擴展性，並持續進行安全更新和功能優化。
                </span>
              </p>
            </div>
          </section>

          {/* Privacy Commitment */}
          <section className="mb-12">
            <div className="flex items-center space-x-3 mb-6">
              <Shield className="w-6 h-6 text-green-600" />
              <h3 className="text-2xl font-semibold text-gray-900">🔐 我在乎隱私</h3>
            </div>
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                我不想強迫任何人提供個資，也不想留下任何「痕跡」。因此：
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-900 mb-2">✅ 不需要帳號</h4>
                  <p className="text-green-700 text-sm">直接使用，無需註冊登入</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-900 mb-2">✅ 沒有伺服器存資料</h4>
                  <p className="text-green-700 text-sm">所有資料都在您的瀏覽器中</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-900 mb-2">✅ LocalStorage 儲存</h4>
                  <p className="text-green-700 text-sm">所有履歷內容皆保存在瀏覽器中</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-900 mb-2">✅ 無追蹤技術</h4>
                  <p className="text-green-700 text-sm">不使用 Cookie、不埋設追蹤代碼</p>
                </div>
              </div>
            </div>
          </section>

          {/* Development Tools */}
          <section className="mb-12">
            <div className="flex items-center space-x-3 mb-6">
              <Users className="w-6 h-6 text-purple-600" />
              <h3 className="text-2xl font-semibold text-gray-900">🧭 開發工具感謝</h3>
            </div>
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">🤖 ChatGPT</h4>
                <p className="text-blue-700">協助我規劃完整的專案架構與技術文件</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-900 mb-2">💻 Cursor IDE</h4>
                <p className="text-green-700">提升我撰寫與維護程式的效率</p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <h4 className="font-semibold text-orange-900 mb-2">🔍 自己測自己</h4>
                <p className="text-orange-700">每一頁、每一個功能都是我手動測過、修正過的</p>
              </div>
            </div>
          </section>



          {/* Footer */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
              <p className="text-sm text-gray-600">
                © 2025 ResumeCraft. 保留所有權利。
              </p>
              <div className="flex space-x-4">
                <Link href="/privacy" className="text-sm text-primary-600">
                  隱私政策
                </Link>
                <Link href="/terms" className="text-sm text-primary-600">
                  服務條款
                </Link>
                <Link href="/contact" className="text-sm text-primary-600">
                  聯絡我們
                </Link>
                <Link href="/support" className="text-sm text-primary-600">
                  支持我們
                </Link>
                <Link href="/" className="text-sm text-primary-600">
                  返回首頁
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
} 