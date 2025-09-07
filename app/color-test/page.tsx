'use client'

import { useResumeForm } from '@/hooks/useResumeForm'
import { ResumeFormProvider } from '@/hooks/useResumeForm'
import TemplateA from '@/components/ResumeTemplates/TemplateA'

function ColorTestPageContent() {
  const { formData, updateSettings, loadSampleData } = useResumeForm()

  const colors = ['blue', 'green', 'purple', 'gray', 'red']

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">顏色測試</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 控制面板 */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">顏色選擇</h2>
              <div className="grid grid-cols-5 gap-3">
                {colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => updateSettings('colorScheme', color)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      formData.settings.colorScheme === color
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full mx-auto mb-2 bg-${color}-500`}></div>
                    <div className="text-xs font-medium capitalize">{color}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">控制</h2>
              <div className="space-y-4">
                <button
                  onClick={loadSampleData}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  載入範例數據
                </button>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">當前設定</h2>
              <div className="space-y-2 text-sm">
                <div><strong>顏色主題:</strong> {formData.settings.colorScheme}</div>
                <div><strong>模板:</strong> {formData.settings.template}</div>
                <div><strong>字體大小:</strong> {formData.settings.fontSize}</div>
                <div><strong>間距:</strong> {formData.settings.spacing}</div>
              </div>
            </div>
          </div>

          {/* 履歷預覽 */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">履歷預覽</h2>
            <div className="resume-preview bg-white shadow-material">
              <TemplateA resumeData={formData.resumeData} settings={formData.settings} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ColorTestPage() {
  return (
    <ResumeFormProvider>
      <ColorTestPageContent />
    </ResumeFormProvider>
  )
} 