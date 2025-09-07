'use client'

import { useState } from 'react'
import { useResumeForm } from '@/hooks/useResumeForm'
import { ResumeFormProvider } from '@/hooks/useResumeForm'
import { useResumeExport } from '@/hooks/useResumeExport'
import TemplateA from '@/components/ResumeTemplates/TemplateA'
import TemplateC from '@/components/ResumeTemplates/TemplateC'
import TemplateD from '@/components/ResumeTemplates/TemplateD'
import TemplateF from '@/components/ResumeTemplates/TemplateF'
import Link from 'next/link'

const templates = [
  { id: 'template-a', name: '經典模板', component: TemplateA },
  { id: 'template-c', name: '簡約模板', component: TemplateC },
  { id: 'template-d', name: '創意模板', component: TemplateD },
  { id: 'template-f', name: '技術模板', component: TemplateF },
]

function PDFTestPageContent() {
  const { formData } = useResumeForm()
  const { exportResume, exportState, resetExportState } = useResumeExport()
  const [selectedTemplate, setSelectedTemplate] = useState('template-a')

  const handleExport = async () => {
    try {
      await exportResume({ filename: `resume-${selectedTemplate}.pdf` })
    } catch (error) {
      console.error('Export failed:', error)
    }
  }

  const loadSampleData = () => {
    // 載入範例資料
    const sampleData = {
      personalInfo: {
        firstName: '張',
        lastName: '小明',
        email: 'zhang.xiaoming@email.com',
        phone: '0912345678',
        city: '台北市',
        state: '台灣',
        linkedin: 'linkedin.com/in/zhangxiaoming',
        website: 'zhangxiaoming.com',
        summary: '資深前端工程師，擁有5年以上的網頁開發經驗，專精於React、TypeScript和現代前端技術。曾帶領團隊完成多個大型專案，具備良好的溝通能力和問題解決能力。'
      },
      experience: [
        {
          id: '1',
          company: '科技公司',
          position: '資深前端工程師',
          startDate: '2022-01',
          endDate: '2024-12',
          current: false,
          description: '負責公司主要產品的前端開發，使用React和TypeScript技術棧。帶領5人團隊完成多個重要功能模組，提升用戶體驗和系統效能。'
        },
        {
          id: '2',
          company: '新創公司',
          position: '前端工程師',
          startDate: '2020-03',
          endDate: '2021-12',
          current: false,
          description: '參與電商平台的開發，負責用戶介面設計和前端功能實作。使用Vue.js和Vuex進行狀態管理，確保代碼品質和可維護性。'
        }
      ],
      education: [
        {
          id: '1',
          school: '國立台灣大學',
          degree: '資訊工程學系',
          startDate: '2016-09',
          endDate: '2020-06',
          current: false,
          description: '主修軟體工程，副修人工智慧。畢業專題獲得系上優秀獎。'
        }
      ],
      skills: [
        { id: '1', name: 'React', level: 'expert' },
        { id: '2', name: 'TypeScript', level: 'expert' },
        { id: '3', name: 'JavaScript', level: 'expert' },
        { id: '4', name: 'Vue.js', level: 'advanced' },
        { id: '5', name: 'Node.js', level: 'advanced' },
        { id: '6', name: 'CSS/SCSS', level: 'expert' }
      ],
      projects: [
        {
          id: '1',
          name: '電商管理系統',
          description: '使用React和Node.js開發的全端電商管理系統，包含商品管理、訂單處理、用戶管理等模組。',
          technologies: ['React', 'Node.js', 'MongoDB', 'Express'],
          url: 'https://github.com/example/ecommerce-system'
        },
        {
          id: '2',
          name: '任務管理App',
          description: '基於Vue.js開發的任務管理應用，支援團隊協作和進度追蹤。',
          technologies: ['Vue.js', 'Vuex', 'Firebase'],
          url: 'https://github.com/example/task-manager'
        }
      ],
      customSections: [
        {
          id: '1',
          title: '證照與認證',
          content: 'AWS Certified Developer Associate\nGoogle Cloud Professional Developer\nMicrosoft Azure Developer Associate'
        },
        {
          id: '2',
          title: '語言能力',
          content: '中文（母語）\n英文（流利）\n日文（基礎）'
        }
      ]
    }
    
    // 更新表單資料
    Object.assign(formData, sampleData)
  }

  const SelectedTemplateComponent = templates.find(t => t.id === selectedTemplate)?.component || TemplateA

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-gray-600 hover:text-gray-900">
                ← 返回首頁
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">PDF 匯出測試</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={loadSampleData}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                載入範例資料
              </button>
              <button
                onClick={handleExport}
                disabled={exportState.isExporting}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {exportState.isExporting ? '匯出中...' : '匯出 PDF'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      {exportState.isExporting && (
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-2">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${exportState.progress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 mt-1">匯出進度: {exportState.progress}%</p>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {exportState.error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{exportState.error}</p>
              </div>
              <div className="ml-auto pl-3">
                <button
                  onClick={resetExportState}
                  className="text-red-400 hover:text-red-600"
                >
                  關閉
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Template Selection */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">選擇模板</h2>
              <div className="space-y-2">
                {templates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => setSelectedTemplate(template.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      selectedTemplate === template.id
                        ? 'bg-blue-100 text-blue-700 border border-blue-200'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {template.name}
                  </button>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-medium text-blue-900 mb-2">測試說明</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• 點擊「載入範例資料」載入測試內容</li>
                  <li>• 選擇不同的模板查看效果</li>
                  <li>• 點擊「匯出 PDF」測試匯出功能</li>
                  <li>• 檢查 PDF 是否完美顯示所有內容</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Resume Preview */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-4 border-b">
                <h2 className="text-lg font-semibold text-gray-900">
                  預覽: {templates.find(t => t.id === selectedTemplate)?.name}
                </h2>
              </div>
                             <div id="resume-preview" className="resume-preview">
                 <SelectedTemplateComponent resumeData={formData.resumeData} settings={formData.settings} />
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function PDFTestPage() {
  return (
    <ResumeFormProvider>
      <PDFTestPageContent />
    </ResumeFormProvider>
  )
} 