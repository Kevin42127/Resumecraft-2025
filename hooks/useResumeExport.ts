import { useState } from 'react'
import { downloadResumeAsPDF } from '@/lib/pdfGenerator'

const USE_CSHARP_PDF = process.env.NEXT_PUBLIC_USE_BACKEND_PDF === 'true'
const CSHARP_PDF_API = process.env.NEXT_PUBLIC_CSHARP_PDF_API || 'http://localhost:5000/generate-pdf'
const NODE_PDF_API = '/api/generate-pdf'

interface ExportOptions {
  filename?: string
}

interface ExportState {
  isExporting: boolean
  progress: number
  error: string | null
}

// 取得所有 <link rel="stylesheet"> 指向的 CSS 內容，合併進 <style>
async function getAllStylesAsString(): Promise<string> {
  const links = Array.from(document.querySelectorAll('link[rel="stylesheet"]')) as HTMLLinkElement[]
  let css = ''
  for (const link of links) {
    try {
      const res = await fetch(link.href)
      if (res.ok) {
        css += await res.text() + '\n'
      }
    } catch (e) {
      // 忽略無法取得的 CSS
    }
  }
  // 也可加載 <style> 內容
  const styleTags = Array.from(document.querySelectorAll('style')) as HTMLStyleElement[]
  for (const styleTag of styleTags) {
    css += styleTag.innerHTML + '\n'
  }
  return css
}

// 組合完整 HTML，內嵌所有 CSS
async function getFullHtmlForExport(targetElement: HTMLElement): Promise<string> {
  const headHtml = document.head.innerHTML
  const previewHtml = targetElement.outerHTML
  const allCss = await getAllStylesAsString()
  
  // 保留所有CSS類別，不再移除視覺效果
  const cleanHtml = previewHtml
  
  return `<!DOCTYPE html>
<html lang="zh-Hant">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
${headHtml}
<style>
${allCss}

/* 載入 PDF 專用樣式 */
@import url('/styles/pdf-export.css');

/* 基本的 PDF 優化 */
body { 
  margin: 0 !important; 
  padding: 0 !important; 
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
  line-height: 1.5 !important;
}

#resume-preview, .resume-preview { 
  overflow: visible !important; 
  height: auto !important; 
  max-height: none !important; 
  padding: 0 !important; 
  margin: 0 !important; 
}

/* PDF 列印優化 */
@media print {
  * { 
    -webkit-print-color-adjust: exact !important;
    color-adjust: exact !important;
  }
  
  /* 確保分頁正確 */
  .resume-section { page-break-inside: avoid !important; }
  
  /* 避免標題在頁面底部 */
  h1, h2, h3, h4, h5, h6 { page-break-after: avoid !important; }
}
</style>
</head>
<body style="background:transparent; margin:0; padding:0;">
${cleanHtml}
</body>
</html>`
}

export const useResumeExport = () => {
  const [exportState, setExportState] = useState<ExportState>({
    isExporting: false,
    progress: 0,
    error: null
  })

  // 使用前端 PDF 生成器（包含分頁邏輯）
  const generateCSharpPDF = async (element: HTMLElement, options: ExportOptions = {}) => {
    const { filename = 'resume.pdf' } = options
    try {
      setExportState({ isExporting: true, progress: 10, error: null })
      
      // 使用我們修改的前端 PDF 生成器
      await downloadResumeAsPDF(element, filename)
      
      setExportState({ isExporting: false, progress: 100, error: null })
      return { success: true, filename }
    } catch (error) {
      setExportState({ isExporting: false, progress: 0, error: 'PDF生成失敗，請稍後再試' })
      throw error
    }
  }

  // 保留 Node.js Puppeteer 方案（可選）
  const generateNodePDF = async (element: HTMLElement, options: ExportOptions = {}) => {
    const { filename = 'resume.pdf' } = options
    try {
      setExportState({ isExporting: true, progress: 10, error: null })
      const htmlContent = await getFullHtmlForExport(element)
      setExportState(prev => ({ ...prev, progress: 30 }))
      const response = await fetch(NODE_PDF_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ html: htmlContent, filename })
      })
      setExportState(prev => ({ ...prev, progress: 70 }))
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      
      // 嘗試使用 File System Access API 彈出「另存新檔」對話框
      if ('showSaveFilePicker' in window) {
        try {
          const fileHandle = await (window as any).showSaveFilePicker({
            suggestedName: filename,
            types: [{
              description: 'PDF files',
              accept: { 'application/pdf': ['.pdf'] }
            }]
          })
          const writable = await fileHandle.createWritable()
          await writable.write(blob)
          await writable.close()
          window.URL.revokeObjectURL(url)
          setExportState({ isExporting: false, progress: 100, error: null })
          return { success: true, filename }
        } catch (error) {
          // 如果用戶取消或API不支援，回退到傳統方式
          console.log('File System Access API not available, falling back to traditional download')
        }
      }
      
      // 回退方案：使用傳統下載方式
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      a.style.display = 'none'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      // 延遲釋放URL，確保下載開始
      setTimeout(() => {
        window.URL.revokeObjectURL(url)
      }, 1000)
      setExportState({ isExporting: false, progress: 100, error: null })
      return { success: true, filename }
    } catch (error) {
      setExportState({ isExporting: false, progress: 0, error: 'PDF生成失敗，請稍後再試' })
      throw error
    }
  }

  // 匯出主流程
  const exportResume = async (options: ExportOptions = {}) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 0))
      const targetElement = document.querySelector('#resume-preview') as HTMLElement
      if (!targetElement) throw new Error('找不到履歷預覽元素 (#resume-preview)')
      if (USE_CSHARP_PDF) {
        return await generateCSharpPDF(targetElement, options)
      } else {
        return await generateNodePDF(targetElement, options)
      }
    } catch (error) {
      setExportState({ isExporting: false, progress: 0, error: error instanceof Error ? error.message : '匯出失敗' })
      throw error
    }
  }

  const resetExportState = () => setExportState({ isExporting: false, progress: 0, error: null })

  return {
    exportResume,
    exportState,
    resetExportState,
    isExporting: exportState.isExporting,
    progress: exportState.progress,
    error: exportState.error
  }
} 