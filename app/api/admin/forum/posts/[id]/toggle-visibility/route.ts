import { NextRequest, NextResponse } from 'next/server'
import { postsData } from '@/lib/adminData'

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

    const { isVisible } = await request.json()
    const postId = params.id

    // 更新文章可見性
    const updatedPost = postsData.update(postId, { isVisible })
    
    if (!updatedPost) {
      return NextResponse.json(
        { error: '文章不存在' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: '文章可見性已更新',
      post: updatedPost
    })
  } catch (error) {
    console.error('更新文章可見性錯誤:', error)
    return NextResponse.json(
      { error: '更新文章可見性失敗' },
      { status: 500 }
    )
  }
}
