import { NextRequest, NextResponse } from 'next/server'
import { feedbacksData } from '@/lib/adminData'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 檢查認證
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: '未授權' },
        { status: 401 }
      )
    }

    const feedbackId = params.id

    // 標記為已處理
    const updatedFeedback = feedbacksData.update(feedbackId, { isProcessed: true })
    
    if (!updatedFeedback) {
      return NextResponse.json(
        { error: '意見回饋不存在' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: '已標記為已處理',
      feedback: updatedFeedback
    })
  } catch (error) {
    console.error('標記已處理錯誤:', error)
    return NextResponse.json(
      { error: '標記已處理失敗' },
      { status: 500 }
    )
  }
}
