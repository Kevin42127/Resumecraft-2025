import { NextRequest, NextResponse } from 'next/server'
import { feedbacksData } from '@/lib/adminData'

export async function DELETE(
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

    // 刪除意見回饋
    const success = feedbacksData.delete(feedbackId)
    
    if (!success) {
      return NextResponse.json(
        { error: '意見回饋不存在' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: '意見回饋已刪除'
    })
  } catch (error) {
    console.error('刪除意見回饋錯誤:', error)
    return NextResponse.json(
      { error: '刪除意見回饋失敗' },
      { status: 500 }
    )
  }
}
