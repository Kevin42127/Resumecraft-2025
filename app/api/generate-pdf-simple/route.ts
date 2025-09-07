import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// 簡化版 PDF 生成 API - 使用瀏覽器內建功能
export async function POST(request: NextRequest) {
  try {
    const { html, filename = 'resume.pdf' } = await request.json()

    if (!html) {
      return NextResponse.json(
        { error: 'HTML 內容為必填欄位' },
        { status: 400 }
      )
    }

    // 返回 HTML 內容，讓前端使用瀏覽器內建列印功能
    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html',
        'Content-Disposition': `inline; filename="${filename.replace('.pdf', '.html')}"`,
      },
    })
  } catch (error) {
    console.error('PDF generation error:', error)
    return NextResponse.json(
      { error: 'PDF 生成失敗，請稍後再試' },
      { status: 500 }
    )
  }
}
