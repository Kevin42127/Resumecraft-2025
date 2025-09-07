'use client'

import { useEffect, useState } from 'react'
import { useResumeForm } from '@/hooks/useResumeForm'
import TemplateA from './ResumeTemplates/TemplateA'
import TemplateB from './ResumeTemplates/TemplateB'
import TemplateC from './ResumeTemplates/TemplateC'
import TemplateD from './ResumeTemplates/TemplateD'
import TemplateF from './ResumeTemplates/TemplateF'

export default function PreviewPanel() {
  const { formData } = useResumeForm()
  const [renderKey, setRenderKey] = useState(0)

  // 強制監聽所有內容變動
  const formDataString = JSON.stringify(formData)
  useEffect(() => {
    setRenderKey(prev => prev + 1)
  }, [formDataString])

  const renderTemplate = () => {
    switch (formData?.settings?.template) {
      case 'template-a':
        return <TemplateA resumeData={formData?.resumeData} settings={formData?.settings} />
      case 'template-b':
        return <TemplateB resumeData={formData?.resumeData} settings={formData?.settings} />
      case 'template-c':
        return <TemplateC resumeData={formData?.resumeData} settings={formData?.settings} />
      case 'template-d':
        return <TemplateD resumeData={formData?.resumeData} settings={formData?.settings} />
      case 'template-f':
        return <TemplateF resumeData={formData?.resumeData} settings={formData?.settings} />
      default:
        return <TemplateA resumeData={formData?.resumeData} settings={formData?.settings} />
    }
  }

  return (
    <div className="h-full flex flex-col">
      {/* Preview Header */}
      <div className="bg-white px-6 py-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">履歷預覽</h2>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span>A4 格式</span>
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            <span>即時更新</span>
          </div>
        </div>
      </div>

      {/* Preview Content */}
      <div id="resume-preview" className="flex-1 p-6 overflow-auto">
        <div className="flex justify-center">
          <div className="resume-preview bg-white" style={{ width: '794px', minHeight: '1123px' }}>
            <div key={renderKey}>
              {renderTemplate()}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
