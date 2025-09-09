import { NextRequest, NextResponse } from 'next/server'
import puppeteer from 'puppeteer'

export const dynamic = 'force-dynamic'

// ResumeCraft 專用 PDF 產生 API
// 僅使用 Puppeteer 於後端產生高品質 PDF
// 前端需傳送完整 HTML（含 head、CSS、resume-preview 區塊）

export async function POST(request: NextRequest) {
  try {
    const { html, filename = 'resume.pdf' } = await request.json()

    if (!html) {
      return NextResponse.json(
        { error: 'HTML 內容為必填欄位' },
        { status: 400 }
      )
    }

    // 啟動 Puppeteer 無頭瀏覽器 - 本地開發優化配置
    const browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu',
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor',
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-renderer-backgrounding',
        '--font-render-hinting=none',
        '--disable-font-subpixel-positioning'
      ],
      timeout: 30000, // 增加超時時間
    })
    const page = await browser.newPage()

    // 載入完整 HTML，等待所有資源載入
    await page.setContent(html, {
      waitUntil: 'networkidle0',
    })

    // 設定頁面大小和視窗大小
    await page.setViewport({
      width: 794, // A4 寬度 (72 DPI)
      height: 1123, // A4 高度 (72 DPI)
      deviceScaleFactor: 2, // 提高解析度
    })

    // 僅保留必要的PDF優化樣式，移除CSS功能限制
    await page.addStyleTag({
      content: `
        #resume-preview, .resume-preview {
          overflow: visible !important;
          height: auto !important;
          max-height: none !important;
          box-shadow: none !important;
          border-radius: 0 !important;
        }
        html, body {
          overflow: visible !important;
          height: auto !important;
          max-height: none !important;
          margin: 0 !important;
          padding: 0 !important;
          font-family: 'Noto Sans CJK TC', 'Noto Sans CJK SC', 'Noto Sans CJK JP', 'Noto Sans CJK KR', 'Noto Sans', 'Arial', 'sans-serif' !important;
        }
        
        /* 確保所有文字在 PDF 中清晰可見 */
        * {
          -webkit-print-color-adjust: exact !important;
          color-adjust: exact !important;
          font-family: 'Noto Sans CJK TC', 'Noto Sans CJK SC', 'Noto Sans CJK JP', 'Noto Sans CJK KR', 'Noto Sans', 'Arial', 'sans-serif' !important;
        }
        
        /* 確保間距正確 */
        .p-6 { padding: 1.5rem !important; }
        .p-4 { padding: 1rem !important; }
        .p-8 { padding: 2rem !important; }
        .mb-6 { margin-bottom: 1.5rem !important; }
        .mb-4 { margin-bottom: 1rem !important; }
        .mb-8 { margin-bottom: 2rem !important; }
      `
    })

    // 等待內容完全載入
    await new Promise(resolve => setTimeout(resolve, 2000))

    // 產生高品質 PDF
    let pdf: Uint8Array
    try {
      pdf = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
          top: '10mm',
          right: '10mm',
          bottom: '10mm',
          left: '10mm',
        },
        preferCSSPageSize: false, // 使用固定 A4 格式
        scale: 1.0, // 確保 1:1 比例
        timeout: 30000, // 增加 PDF 生成超時時間
      })
    } catch (pdfError) {
      console.error('PDF generation failed:', pdfError)
      throw pdfError
    } finally {
      // 確保瀏覽器正確關閉
      try {
        await browser.close()
      } catch (closeError) {
        console.warn('Browser close warning:', closeError)
      }
    }

    // 回傳 PDF Blob
    return new NextResponse(pdf, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    })
  } catch (error) {
    console.error('PDF generation error:', error)
    
    // 如果是 Puppeteer 相關錯誤，提供更詳細的錯誤信息
    if (error instanceof Error) {
      if (error.message.includes('Target closed') || error.message.includes('Protocol error')) {
        return NextResponse.json(
          { error: 'PDF 生成服務暫時不可用，請稍後再試或使用前端 PDF 生成' },
          { status: 503 }
        )
      }
    }
    
    return NextResponse.json(
      { error: 'PDF 生成失敗，請稍後再試' },
      { status: 500 }
    )
  }
}
