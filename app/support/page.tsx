'use client'

import Link from 'next/link'
import { ArrowLeft, Heart, Coffee, Star, Zap, Gift, MessageSquare } from 'lucide-react'
import { motion } from 'framer-motion'

export default function SupportPage() {
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
              <Heart className="w-6 h-6 text-red-500" />
              <h1 className="text-2xl font-bold text-white">支持我們</h1>
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
          {/* Hero Section */}
          <section className="text-center py-12">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6"
            >
              <Heart className="w-10 h-10 text-red-500" />
            </motion.div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              感謝您的支持！
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              ResumeCraft 致力於為每個人提供免費、專業的履歷製作服務。
              您的支持讓我們能夠持續改進並提供更好的服務。
            </p>
          </section>

          {/* Support Methods */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* 給予評價 */}
            <div className="card p-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-6">
                <Star className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">給予評價</h3>
              <p className="text-gray-600 mb-6">
                如果您覺得 ResumeCraft 對您有幫助，請為我們留下五星評價。
              </p>
              <div className="flex justify-center space-x-1 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-6 h-6 text-yellow-400 fill-current" />
                ))}
              </div>
              <a 
                href="https://github.com/Kevin42127/resumecraft-online" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full bg-yellow-500 text-white font-medium py-3 px-6 rounded-lg inline-block text-center"
              >
                前往評價
              </a>
            </div>

            {/* 金錢支持 */}
            <div className="card p-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
                <Coffee className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">金錢支持</h3>
              <p className="text-gray-600 mb-6">
                如果您願意支持我們的開發，可以透過以下方式給予金錢支持。
              </p>
              <div className="space-y-3">
                <a 
                  href="https://buymeacoffee.com/resumecraft" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full bg-orange-500 text-white font-medium py-3 px-6 rounded-lg inline-block text-center"
                >
                  Buy Me a Coffee
                </a>
                <a 
                  href="https://www.paypal.com/ncp/payment/6ABLZE89MD3W8" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full bg-blue-600 text-white font-medium py-3 px-6 rounded-lg inline-block text-center"
                >
                  PayPal 支持
                </a>
              </div>
            </div>
          </section>

          {/* Feedback Section */}
          <section className="card p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
              <MessageSquare className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">提供意見回饋</h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              您的意見對我們非常重要！請告訴我們如何改進 ResumeCraft，
              讓我們能夠為您提供更好的服務。
            </p>
            <Link 
              href="/contact" 
              className="inline-flex items-center space-x-2 bg-green-600 text-white font-medium py-3 px-8 rounded-lg"
            >
              <MessageSquare className="w-5 h-5" />
              <span>聯絡我們</span>
            </Link>
          </section>

          {/* Why Support Us */}
          <section className="card p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">為什麼需要支持？</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start space-x-4">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full flex-shrink-0">
                  <Zap className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">🛠️ 持續開發</h4>
                  <p className="text-gray-600 text-sm">
                    支持我繼續開發新功能，改善用戶體驗，並保持網站穩定運行。
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full flex-shrink-0">
                  <Gift className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">💡 創新功能</h4>
                  <p className="text-gray-600 text-sm">
                    開發更多實用的履歷製作功能，如更多模板、AI 優化等。
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-100 rounded-full flex-shrink-0">
                  <Coffee className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">🔧 技術維護</h4>
                  <p className="text-gray-600 text-sm">
                    維護伺服器成本、域名費用，確保網站安全穩定。
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full flex-shrink-0">
                  <Heart className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">📚 免費服務</h4>
                  <p className="text-gray-600 text-sm">
                    保持網站免費使用，讓更多人能夠受益於這個工具。
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Thank You Message */}
          <section className="text-center py-8">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                再次感謝您的支持！
              </h3>
              <p className="text-gray-600 max-w-2xl mx-auto">
                每一個分享、每一份評價、每一條建議，都是我們前進的動力。
                讓我們一起幫助更多人打造專業的履歷，找到理想的工作！
              </p>
            </div>
          </section>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="relative py-12 text-white bg-blue-900">
        <div className="container px-4 mx-auto">
          <div className="text-center">
            <p className="mb-4 text-white">
              網站由 ChatGPT 建立專案結構，程式碼由 Cursor 撰寫，最後由人工進行網站測試。
            </p>
            <div className="flex flex-wrap items-center justify-center mb-4 space-x-6">
              <Link href="/privacy" className="text-white">
                隱私政策
              </Link>
              <Link href="/terms" className="text-white">
                服務條款
              </Link>
              <span className="text-white">|</span>
              <Link href="/about" className="text-white">
                關於我們
              </Link>
              <span className="text-white">|</span>
              <Link href="/contact" className="text-white">
                聯絡我們
              </Link>
              <span className="text-white">|</span>
              <Link href="/support" className="text-white">
                支持我們
              </Link>
            </div>
            <p className="text-white">
              © 2025 ResumeCraft. 保留所有權利。
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
