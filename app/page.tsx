'use client'

import { useState, lazy, Suspense, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { FileText, Download, Eye, Zap, Shield } from 'lucide-react'

// 懶載入組件以提升初始載入速度
const FeedbackModal = lazy(() => import('@/components/FeedbackModal'))

export default function HomePage() {
  const [showFeedback, setShowFeedback] = useState(false)
  const [showBackToTop, setShowBackToTop] = useState(false)

  // 監聽滾動事件，顯示/隱藏返回頂部按鈕
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      setShowBackToTop(scrollTop > 300)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])


  // 返回頂部功能
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  const features = [
    {
      icon: <FileText className="w-6 h-6" />,
      title: '多樣化模板',
      description: '提供多種專業履歷模板，適合不同產業與職位需求',
    },
    {
      icon: <Eye className="w-6 h-6" />,
      title: '即時預覽',
      description: '編輯時即時預覽履歷效果，確保完美呈現',
    },
    {
      icon: <Download className="w-6 h-6" />,
      title: 'PDF 匯出',
      description: '一鍵匯出高品質 PDF 檔案，適合列印與分享',
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: '快速製作',
      description: '簡潔直觀的操作介面，快速完成履歷製作',
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: '隱私保護',
      description: '資料僅儲存在您的瀏覽器中，確保隱私安全',
    },
  ]


  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  }

  const handleFeedbackClick = () => {
    setShowFeedback(true)
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden bg-primary-50">
        <div className="container px-4 mx-auto">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.div variants={itemVariants} className="mb-8">
              <h1 className="mb-6 text-5xl font-bold text-black md:text-6xl">
                ResumeCraft
              </h1>
              <p className="max-w-2xl mx-auto mb-8 text-xl text-gray-600 md:text-2xl">
                現代化履歷製作工具，讓您的專業能力完美呈現
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="flex justify-center">
              <Link href="/editor">
                <motion.button
                  className="px-8 py-4 text-lg btn-primary"
                >
                  開始製作履歷
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>
        </div>

      </section>

      {/* Features Section */}
      <section className="py-20 bg-primary-50">
        <div className="container px-4 mx-auto">
          <motion.div
            className="mb-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="mb-4 text-4xl font-bold text-gray-900">
              為什麼選擇 ResumeCraft？
            </h2>
            <p className="max-w-2xl mx-auto text-xl text-gray-600">
              我們提供專業的履歷製作工具，讓您輕鬆打造完美的求職履歷
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="p-8 text-center card"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-primary-100 text-primary-600">
                  {feature.icon}
                </div>
                <h3 className="mb-4 text-xl font-semibold text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>


      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-500 to-primary-700">
        <div className="container px-4 mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="mb-6 text-4xl font-bold text-white">
              準備好製作您的專業履歷了嗎？
            </h2>
            <p className="max-w-2xl mx-auto mb-8 text-xl text-primary-100">
              立即開始，幾分鐘內就能完成一份專業的履歷
            </p>
            <Link href="/editor">
              <motion.button
                className="px-8 py-4 text-lg font-semibold bg-white rounded-lg text-primary-600"
              >
                免費開始製作
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

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
              <span className="text-white">|</span>
              <button
                onClick={handleFeedbackClick}
                className="text-white"
              >
                意見回饋
              </button>
            </div>
            <p className="text-white">
              © 2025 ResumeCraft. 保留所有權利。
            </p>
          </div>
        </div>
        
        {/* Back to Top Button - Fixed in Footer */}
        {showBackToTop && (
          <button
            onClick={scrollToTop}
            className="absolute bottom-4 right-4 px-3 py-1 text-xs font-medium text-white border border-white rounded"
          >
            返回頂部
          </button>
        )}
      </footer>


            {/* Feedback Modal */}
      <Suspense fallback={null}>
        <FeedbackModal 
          isOpen={showFeedback}
          onClose={() => setShowFeedback(false)}
        />
      </Suspense>
    </div>
  )
}
