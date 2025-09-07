import { NextRequest, NextResponse } from 'next/server'
import { postsData } from '@/lib/adminData'

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

    const postId = params.id

    // 刪除文章
    const success = postsData.delete(postId)
    
    if (!success) {
      return NextResponse.json(
        { error: '文章不存在' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: '文章已刪除'
    })
  } catch (error) {
    console.error('刪除文章錯誤:', error)
    return NextResponse.json(
      { error: '刪除文章失敗' },
      { status: 500 }
    )
  }
}
