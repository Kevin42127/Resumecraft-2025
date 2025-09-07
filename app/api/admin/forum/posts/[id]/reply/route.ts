import { NextRequest, NextResponse } from 'next/server'
import { postsData } from '@/lib/adminData'

export async function POST(
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

    const { content, author } = await request.json()
    const postId = params.id

    // 驗證必要欄位
    if (!content || !author) {
      return NextResponse.json(
        { error: '回復內容和作者都是必填的' },
        { status: 400 }
      )
    }

    if (content.trim().length === 0 || author.trim().length === 0) {
      return NextResponse.json(
        { error: '回復內容和作者不能為空' },
        { status: 400 }
      )
    }

    // 獲取文章
    const posts = postsData.getAll()
    const post = posts.find((p: any) => p.id === postId)
    
    if (!post) {
      return NextResponse.json(
        { error: '文章不存在' },
        { status: 404 }
      )
    }

    // 添加回復
    const updatedPost = postsData.addReply(postId, {
      content: content.trim(),
      author: author.trim()
    })

    return NextResponse.json({
      success: true,
      message: '回復發布成功',
      post: updatedPost
    })
  } catch (error) {
    console.error('發布回復錯誤:', error)
    return NextResponse.json(
      { error: '發布回復失敗' },
      { status: 500 }
    )
  }
}
