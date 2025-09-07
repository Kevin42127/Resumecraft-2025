import { NextRequest, NextResponse } from 'next/server'
import { postsData } from '@/lib/adminData'

export const dynamic = 'force-dynamic'

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

    const posts = postsData.getAll()
    return NextResponse.json({
      posts
    })
  } catch (error) {
    console.error('獲取討論區文章錯誤:', error)
    return NextResponse.json(
      { error: '獲取討論區文章失敗' },
      { status: 500 }
    )
  }
}
