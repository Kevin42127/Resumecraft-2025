import { NextRequest, NextResponse } from 'next/server'

// 模擬資料庫存儲（實際應該從資料庫讀取）
let posts = [
  {
    id: '1',
    likes: 12,
  },
  {
    id: '2',
    likes: 8,
  },
  {
    id: '3',
    likes: 15,
  }
]

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // 找到對應的討論並增加按讚數
    const post = posts.find(p => p.id === id)
    if (!post) {
      return NextResponse.json(
        { error: '討論不存在' },
        { status: 404 }
      )
    }

    post.likes += 1

    return NextResponse.json({ likes: post.likes })
  } catch (error) {
    console.error('Error liking post:', error)
    return NextResponse.json(
      { error: '按讚失敗' },
      { status: 500 }
    )
  }
} 