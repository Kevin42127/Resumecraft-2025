import { NextRequest, NextResponse } from 'next/server'
import { feedbacksData } from '@/lib/adminData'

export async function GET(request: NextRequest) {
  try {
    // 檢查認證
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: '未授權' },
        { status: 401 }
      )
    }

    const feedbacks = feedbacksData.getAll()
    return NextResponse.json({
      feedbacks
    })
  } catch (error) {
    console.error('獲取意見回饋錯誤:', error)
    return NextResponse.json(
      { error: '獲取意見回饋失敗' },
      { status: 500 }
    )
  }
}
