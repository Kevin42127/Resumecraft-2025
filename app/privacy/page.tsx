'use client'

import Link from 'next/link'
import { ArrowLeft, Shield, Lock, Eye, Database, Users, FileText } from 'lucide-react'
import { motion } from 'framer-motion'

export default function PrivacyPolicyPage() {
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
              <Shield className="w-6 h-6 text-primary-600" />
              <h1 className="text-2xl font-bold text-white">隱私政策</h1>
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
          {/* Last Updated */}
          <div className="mb-8 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700">
              <strong>最後更新：</strong>2025年7月
            </p>
          </div>

          {/* Introduction */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <Lock className="w-5 h-5 text-primary-600" />
              <span>1. 概述</span>
            </h2>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 leading-relaxed">
                ResumeCraft 為注重使用者隱私的現代化履歷製作平台。為提供良好使用體驗，本網站採用<strong>本地端儲存（LocalStorage）</strong>方式保存您填寫的履歷內容。
              </p>
              <p className="text-gray-700 leading-relaxed mt-4">
                我們不會也無法存取、儲存或傳輸您輸入的任何個人資料，包括但不限於姓名、聯絡方式、工作經歷等內容。
              </p>
            </div>
          </section>

          {/* Data Collection and Usage */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <Database className="w-5 h-5 text-primary-600" />
              <span>2. 資料收集與使用</span>
            </h2>
            <div className="space-y-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-green-900 mb-2">✅ 我們如何保護您的資料</h3>
                <ul className="list-disc list-inside space-y-2 text-green-700">
                  <li>所有履歷內容僅儲存在您的瀏覽器本地儲存空間</li>
                  <li>我們無法存取或查看您的個人資料</li>
                  <li>無需註冊帳號，即可使用所有功能</li>
                  <li>當您清除瀏覽器資料後，資料將一併刪除</li>
                </ul>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-blue-900 mb-2">📊 我們不收集的資料</h3>
                <ul className="list-disc list-inside space-y-2 text-blue-700">
                  <li>個人身份資訊（姓名、電話、地址等）</li>
                  <li>工作經歷和技能詳情</li>
                  <li>教育背景和證照資訊</li>
                  <li>任何其他您填寫的履歷內容</li>
                </ul>
              </div>
            </div>
          </section>

          {/* No Registration Required */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <Eye className="w-5 h-5 text-primary-600" />
              <span>3. 無需註冊、無伺服器存儲</span>
            </h2>
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                您無需註冊帳號或登入，即可使用所有功能。
              </p>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-yellow-900 mb-2">🔒 資料安全承諾</h3>
                <ul className="list-disc list-inside space-y-2 text-yellow-700">
                  <li>所有填寫內容僅儲存於您的瀏覽器中</li>
                  <li>當您清除瀏覽器資料後，資料將一併刪除</li>
                  <li>本網站不連接資料庫、不備份、不追蹤資料</li>
                  <li>您完全掌控自己的履歷內容</li>
                </ul>
              </div>
            </div>
          </section>

          {/* PDF Export Behavior */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <FileText className="w-5 h-5 text-primary-600" />
              <span>4. PDF 匯出行為</span>
            </h2>
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                當您點選「匯出 PDF」功能時，網站會將您填寫的內容傳送至後端伺服器，用於產生 PDF 檔案。此行為為暫時性的處理，不會永久保存任何履歷資料。
              </p>
              <div className="bg-orange-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-orange-900 mb-2">⚠️ 重要說明</h3>
                <ul className="list-disc list-inside space-y-2 text-orange-700">
                  <li>後端服務會在生成 PDF 後即時回傳</li>
                  <li>不會做任何資料存檔</li>
                  <li>您的履歷內容不會被永久保存</li>
                  <li>PDF 生成完成後，伺服器會立即清除相關資料</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Third-party Tracking Policy */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <Shield className="w-5 h-5 text-primary-600" />
              <span>5. 第三方追蹤政策</span>
            </h2>
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                ResumeCraft 不使用任何第三方分析工具（如 Google Analytics、Facebook Pixel 等），並致力維持 Cookie-free 的無追蹤網站體驗。
              </p>
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-green-900 mb-2">🛡️ 我們的承諾</h3>
                <ul className="list-disc list-inside space-y-2 text-green-700">
                  <li>不使用任何追蹤技術</li>
                  <li>不收集使用者行為數據</li>
                  <li>不與第三方分享任何資訊</li>
                  <li>完全尊重您的隱私權</li>
                </ul>
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
                <Link href="/terms" className="text-sm text-primary-600">
                  服務條款
                </Link>
                <Link href="/about" className="text-sm text-primary-600">
                  關於我們
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