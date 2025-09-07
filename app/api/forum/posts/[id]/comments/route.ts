import { NextRequest, NextResponse } from 'next/server'
import { ForumComment, CreateCommentRequest } from '@/types/forum'

// 模擬資料庫存儲（實際應該從資料庫讀取）
let posts = [
  {
    id: '1',
    comments: [
      {
        id: 'c1',
        postId: '1',
        content: '很實用的建議！我也覺得格式一致性很重要，看起來更專業。',
        author: '求職新手',
        likes: 3,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'c2',
        postId: '1',
        content: '請問有推薦的履歷模板嗎？',
        author: '設計師小王',
        likes: 1,
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      }
    ]
  },
  {
    id: '2',
    comments: []
  },
  {
    id: '3',
    comments: []
  }
]

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body: CreateCommentRequest = await request.json()

    // 驗證必要欄位
    if (!body.content?.trim() || !body.author?.trim()) {
      return NextResponse.json(
        { error: '請填寫暱稱和留言內容' },
        { status: 400 }
      )
    }

    // 找到對應的討論
    const post = posts.find(p => p.id === id)
    if (!post) {
      return NextResponse.json(
        { error: '討論不存在' },
        { status: 404 }
      )
    }

    // 創建新留言
    const newComment: ForumComment = {
      id: `c${Date.now()}`,
      postId: id,
      content: body.content.trim(),
      author: body.author.trim(),
      likes: 0,
      createdAt: new Date().toISOString(),
    }

    post.comments.push(newComment)

    return NextResponse.json(newComment, { status: 201 })
  } catch (error) {
    console.error('Error creating comment:', error)
    return NextResponse.json(
      { error: '創建留言失敗' },
      { status: 500 }
    )
  }
} 