'use client'

import { useResumeForm } from '@/hooks/useResumeForm'
import { ResumeFormProvider } from '@/hooks/useResumeForm'
import { downloadResumeAsPDF } from '@/lib/pdfGenerator'
import TemplateA from '@/components/ResumeTemplates/TemplateA'

function PDFConsistencyTestPageContent() {
  const { formData, loadSampleData } = useResumeForm()

  const handleExportPDF = async () => {
    try {
      await downloadResumeAsPDF()
      console.log('PDF 匯出成功！')
    } catch (error) {
      console.error('PDF 匯出失敗:', error)
      alert('PDF 匯出失敗，請稍後再試')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">PDF 一致性測試</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 控制面板 */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">控制</h2>
              <div className="space-y-4">
                <button
                  onClick={loadSampleData}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  載入範例數據
                </button>
                <button
                  onClick={handleExportPDF}
                  className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  匯出 PDF
                </button>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">當前狀態</h2>
              <div className="space-y-2 text-sm">
                <div><strong>模板:</strong> {formData.settings.template}</div>
                <div><strong>姓名:</strong> {formData.resumeData.personalInfo.firstName || '未設定'}</div>
                <div><strong>Email:</strong> {formData.resumeData.personalInfo.email || '未設定'}</div>
                <div><strong>工作經驗:</strong> {formData.resumeData.experience.length} 項</div>
                <div><strong>教育背景:</strong> {formData.resumeData.education.length} 項</div>
                <div><strong>技能:</strong> {formData.resumeData.skills.length} 項</div>
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

export default function PDFConsistencyTestPage() {
  return (
    <ResumeFormProvider>
      <PDFConsistencyTestPageContent />
    </ResumeFormProvider>
  )
} 