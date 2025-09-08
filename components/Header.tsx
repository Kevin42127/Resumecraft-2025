'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FileText, 
  Download, 
  Palette
} from 'lucide-react'
import NotificationBell from './NotificationBell'
import { useResumeForm } from '@/hooks/useResumeForm'
import { useResumeExport } from '@/hooks/useResumeExport'
import ExportErrorModal from './ExportErrorModal'

interface HeaderProps {}

export default function Header({}: HeaderProps) {
  const { formData, updateSettings } = useResumeForm()
  const { exportResume, isExporting, progress, error, resetExportState } = useResumeExport()
  const [showTemplateDropdown, setShowTemplateDropdown] = useState(false)
  const templateButtonRef = useRef<HTMLButtonElement>(null)

  const templates = [
    { id: 'template-a', name: '經典模板', color: 'blue' },
    { id: 'template-b', name: 'ATS 模板', color: 'green' },
    { id: 'template-c', name: '簡約模板', color: 'gray' },
    { id: 'template-d', name: '創意模板', color: 'purple' },
    { id: 'template-f', name: '技術模板', color: 'red' },
  ]

  const handleExportPDF = async () => {
    try {
      await exportResume({ filename: 'resume.pdf' })
      console.log('PDF 匯出成功！')
    } catch (error) {
      console.error('PDF 匯出失敗:', error)
      // 錯誤處理已在Hook中完成
    }
  }

  const handleTemplateDropdownToggle = () => {
    setShowTemplateDropdown(!showTemplateDropdown)
  }

  // 點擊外部關閉下拉選單
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (templateButtonRef.current && !templateButtonRef.current.contains(event.target as Node)) {
        setShowTemplateDropdown(false)
      }
    }

    if (showTemplateDropdown) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showTemplateDropdown])

  return (
    <header className="relative z-50 px-6 py-4 bg-blue-900 border-b border-blue-800">
      <div className="flex items-center justify-between">
        {/* Logo and Navigation */}
        <div className="flex items-center space-x-6">
          <Link href="/" className="flex items-center space-x-2">
            <FileText className="w-8 h-8 text-primary-600" />
            <span className="text-xl font-bold text-white">ResumeCraft</span>
          </Link>
          
          <nav className="items-center hidden space-x-4 md:flex">
            <Link href="/" className="text-gray-300">
              首頁
            </Link>
            <Link href="/editor" className="font-medium text-white">
              編輯器
            </Link>
            <Link href="/forum" className="text-gray-300">
              討論區
            </Link>
          </nav>
        </div>

        {/* Controls */}
        <div className="flex items-center space-x-4">
          {/* Template Switcher */}
          <div className="relative">
            <button
              ref={templateButtonRef}
              onClick={handleTemplateDropdownToggle}
              className="flex items-center px-4 py-2 space-x-2 text-gray-300"
            >
              <Palette className="w-5 h-5" />
              <span className="hidden sm:inline">模板</span>
            </button>
            
            {/* Template Dropdown */}
            <AnimatePresence>
              {showTemplateDropdown && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 w-48 bg-blue-800 rounded-lg shadow-2xl border border-blue-700 py-2 z-50"
                >
                  {templates.map((template) => (
                    <button
                      key={template.id}
                      onClick={() => {
                        updateSettings('template', template.id)
                        setShowTemplateDropdown(false)
                      }}
                      className={`w-full text-left px-4 py-2 ${
                        formData?.settings?.template === template.id ? 'text-white bg-blue-700' : 'text-gray-300'
                      }`}
                    >
                      {template.name}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>


          {/* Export Button */}
          <motion.button
            onClick={handleExportPDF}
            disabled={isExporting}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
              isExporting 
                ? 'bg-blue-600 cursor-not-allowed' 
                : 'bg-primary-600 text-white'
            }`}
          >
            {isExporting ? (
              <>
                <div className="w-5 h-5 border-2 border-white rounded-full border-t-transparent animate-spin" />
                <span className="hidden sm:inline">匯出中... {progress}%</span>
              </>
            ) : (
              <>
                <Download className="w-5 h-5" />
                <span className="hidden sm:inline">匯出 PDF</span>
              </>
            )}
          </motion.button>

          {/* Notification Bell */}
          <NotificationBell />
        </div>
      </div>


      {/* Export Error Modal */}
      <ExportErrorModal 
        error={error} 
        onClose={resetExportState} 
      />

    </header>
  )
}
