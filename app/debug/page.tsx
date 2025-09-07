'use client'

import { useResumeForm } from '@/hooks/useResumeForm'
import { ResumeFormProvider } from '@/hooks/useResumeForm'

function DebugPageContent() {
  const { formData, loadSampleData, resetForm } = useResumeForm()

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Debug 頁面</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* 控制按鈕 */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">控制</h2>
            <div className="space-y-2">
              <button
                onClick={loadSampleData}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                載入範例
              </button>
              <button
                onClick={resetForm}
                className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                重置
              </button>
            </div>
          </div>

          {/* 當前狀態 */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">當前狀態</h2>
            <div className="bg-white p-4 rounded-lg shadow">
              <pre className="text-sm overflow-auto">
                {JSON.stringify({
                  template: formData.settings.template,
                  firstName: formData.resumeData.personalInfo.firstName,
                  email: formData.resumeData.personalInfo.email,
                  experienceCount: formData.resumeData.experience.length,
                  educationCount: formData.resumeData.education.length,
                  skillsCount: formData.resumeData.skills.length,
                }, null, 2)}
              </pre>
            </div>
          </div>
        </div>

        {/* 完整數據 */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">完整數據</h2>
          <div className="bg-white p-4 rounded-lg shadow">
            <pre className="text-xs overflow-auto max-h-96">
              {JSON.stringify(formData, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function DebugPage() {
  return (
    <ResumeFormProvider>
      <DebugPageContent />
    </ResumeFormProvider>
  )
} 