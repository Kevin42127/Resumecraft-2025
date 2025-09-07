import { NextRequest, NextResponse } from 'next/server'
import { getStats } from '@/lib/adminData'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // 檢查認證（簡化版本）
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: '未授權' },
        { status: 401 }
      )
    }

    // 獲取統計數據
    const stats = getStats()
    return NextResponse.json(stats)
  } catch (error) {
    console.error('獲取統計數據錯誤:', error)
    return NextResponse.json(
      { error: '獲取統計數據失敗' },
      { status: 500 }
    )
  }
}
