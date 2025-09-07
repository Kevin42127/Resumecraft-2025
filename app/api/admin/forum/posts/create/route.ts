import { NextRequest, NextResponse } from 'next/server'
import { postsData } from '@/lib/adminData'

export async function POST(request: NextRequest) {
  try {
    // 檢查認證
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: '未授權' },
        { status: 401 }
      )
    }

    const { title, content, author } = await request.json()

    // 驗證必要欄位
    if (!title || !content || !author) {
      return NextResponse.json(
        { error: '標題、內容和作者都是必填的' },
        { status: 400 }
      )
    }

    if (title.trim().length === 0 || content.trim().length === 0 || author.trim().length === 0) {
      return NextResponse.json(
        { error: '標題、內容和作者不能為空' },
        { status: 400 }
      )
    }

    // 創建新文章
    const newPost = postsData.add({
      title: title.trim(),
      content: content.trim(),
      author: author.trim()
    })

    return NextResponse.json({
      success: true,
      message: '文章發布成功',
      post: newPost
    })
  } catch (error) {
    console.error('創建文章錯誤:', error)
    return NextResponse.json(
      { error: '創建文章失敗' },
      { status: 500 }
    )
  }
}
