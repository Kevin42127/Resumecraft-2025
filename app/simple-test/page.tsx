'use client'

import { useState } from 'react'
import { useResumeForm } from '@/hooks/useResumeForm'
import { ResumeFormProvider } from '@/hooks/useResumeForm'

function SimpleTestPageContent() {
  const { formData, loadSampleData } = useResumeForm()
  const [clickCount, setClickCount] = useState(0)

  const handleLoadSample = () => {
    setClickCount(prev => prev + 1)
    loadSampleData()
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">簡單測試</h1>
        
        <div className="space-y-6">
          <div>
            <button
              onClick={handleLoadSample}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              載入範例 (點擊次數: {clickCount})
            </button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">當前數據</h2>
            <div className="space-y-2 text-sm">
              <div><strong>姓名:</strong> {formData.resumeData.personalInfo.firstName || '未設定'}</div>
              <div><strong>Email:</strong> {formData.resumeData.personalInfo.email || '未設定'}</div>
              <div><strong>工作經驗:</strong> {formData.resumeData.experience.length} 項</div>
              <div><strong>教育背景:</strong> {formData.resumeData.education.length} 項</div>
              <div><strong>技能:</strong> {formData.resumeData.skills.length} 項</div>
              <div><strong>模板:</strong> {formData.settings.template}</div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">完整數據</h2>
            <pre className="text-xs overflow-auto max-h-64 bg-gray-100 p-4 rounded">
              {JSON.stringify(formData, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function SimpleTestPage() {
  return (
    <ResumeFormProvider>
      <SimpleTestPageContent />
    </ResumeFormProvider>
  )
} 