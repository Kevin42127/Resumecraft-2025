'use client'

import Link from 'next/link'
import { ArrowLeft, FileText, Shield, AlertTriangle, CheckCircle, XCircle } from 'lucide-react'
import { motion } from 'framer-motion'

export default function TermsOfServicePage() {
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
              <FileText className="w-6 h-6 text-primary-600" />
              <h1 className="text-2xl font-bold text-white">服務條款</h1>
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
              <FileText className="w-5 h-5 text-primary-600" />
              <span>1. 概述</span>
            </h2>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 leading-relaxed">
                歡迎使用 ResumeCraft 履歷製作平台。使用本網站即表示您同意遵守以下服務條款，請仔細閱讀：
              </p>
            </div>
          </section>

          {/* Service Description */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">2. 服務說明</h2>
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                ResumeCraft 提供使用者一個免登入、即時預覽、可匯出 PDF 的線上履歷製作工具，支援多種樣式模板與欄位自訂功能。
              </p>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-blue-900 mb-2">✨ 主要功能</h3>
                <ul className="list-disc list-inside space-y-2 text-blue-700">
                  <li>免登入即可使用所有功能</li>
                  <li>即時預覽履歷效果</li>
                  <li>支援多種履歷模板</li>
                  <li>可匯出為 PDF 格式</li>
                  <li>本地端資料儲存</li>
                  <li>自訂欄位功能</li>
                </ul>
              </div>
              <p className="text-gray-700 leading-relaxed mt-4">
                使用者可在本地端瀏覽器中編輯履歷資料，並匯出為 PDF、Docx 或純文字等格式。
              </p>
            </div>
          </section>

          {/* User Responsibilities */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">3. 使用者責任</h2>
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                您在使用本網站時，應遵守以下規範：
              </p>
              <div className="bg-red-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-red-900 mb-2">🚫 禁止行為</h3>
                <ul className="list-disc list-inside space-y-2 text-red-700">
                  <li>不得使用本平台從事任何違法、詐騙、侵權或違反善良風俗之行為</li>
                  <li>不得製作虛假或誤導性履歷</li>
                  <li>不得侵犯他人智慧財產權</li>
                  <li>不得干擾服務正常運作</li>
                </ul>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-green-900 mb-2">✅ 使用者責任</h3>
                <ul className="list-disc list-inside space-y-2 text-green-700">
                  <li>履歷內容由使用者自行輸入與保存，請確保其真實性與合法性</li>
                  <li>若您將產出的履歷內容提供給第三方（例如投遞求職網站），請自行負責該內容之使用風險與結果</li>
                  <li>請妥善備份您的履歷資料</li>
                  <li>遵守相關法律法規</li>
                </ul>
              </div>
            </div>
          </section>



          {/* Disclaimers */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-primary-600" />
              <span>4. 免責聲明</span>
            </h2>
            <div className="space-y-4">
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-yellow-900 mb-2">⚠️ 重要提醒</h3>
                <ul className="list-disc list-inside space-y-2 text-yellow-700">
                  <li>本網站所提供的履歷模板、建議用語與內容撰寫提示，僅供參考，不保證求職成功與特定成果</li>
                  <li>本網站不會保存您填寫的任何履歷資料，也不對資料遺失負任何責任。請使用者自行妥善備份</li>
                  <li>若因第三方瀏覽器問題、作業系統錯誤或匯出功能異常導致資料損失，本網站恕不負擔任何賠償責任</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Intellectual Property */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">5. 智慧財產權</h2>
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-blue-900 mb-2">📋 智慧財產權聲明</h3>
                <p className="text-blue-700 leading-relaxed">
                  ResumeCraft 網站中所設計之模板、介面、圖示、內容與原始程式碼，皆為開發團隊所擁有。除非取得書面授權，使用者不得擅自重製、修改或用於商業用途。
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-green-900 mb-2">✅ 您的權利</h3>
                <ul className="list-disc list-inside space-y-2 text-green-700">
                  <li>您保留對您創建履歷內容的所有權利</li>
                  <li>您可以自由使用您製作的履歷</li>
                  <li>我們不會聲稱對您的履歷內容擁有所有權</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Service Changes and Termination */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">6. 服務變更與中止</h2>
            <div className="space-y-4">
              <div className="bg-orange-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-orange-900 mb-2">⚠️ 服務變更權利</h3>
                <p className="text-orange-700 leading-relaxed">
                  本網站保留隨時更新、暫停或終止部分或全部服務之權利，無須事前通知。任何服務異動所導致的資料損失，使用者應自行承擔風險。
                </p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-blue-900 mb-2">📋 隱私政策</h3>
                <p className="text-blue-700 leading-relaxed">
                  我們重視您的隱私。我們如何收集、使用和保護您的個人資訊，
                  請參閱我們的 <Link href="/privacy" className="text-primary-600 underline">隱私政策</Link>。
                </p>
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