import { NextRequest, NextResponse } from 'next/server'
import { DeletePostRequest, RestorePostRequest } from '@/types/forum'

// 模擬資料庫存儲（與主要posts路由共享）
// 在實際應用中，這應該從資料庫中獲取
let posts: any[] = []

// 驗證開發者身份
function validateDeveloperAuth(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return false
  }
  
  const token = authHeader.replace('Bearer ', '')
  const validTokens = ['dev-token-2024', 'admin-token-2024']
  return validTokens.includes(token)
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!validateDeveloperAuth(request)) {
      return NextResponse.json(
        { error: '需要開發者權限' },
        { status: 403 }
      )
    }

    const { id } = params
    const body: DeletePostRequest = await request.json()

    // 找到對應的討論
    const postIndex = posts.findIndex(p => p.id === id)
    if (postIndex === -1) {
      return NextResponse.json(
        { error: '討論不存在' },
        { status: 404 }
      )
    }

    // 軟刪除：標記為已刪除
    posts[postIndex].isDeleted = true
    posts[postIndex].deletedAt = new Date().toISOString()
    posts[postIndex].deletedReason = body.reason || '管理員刪除'

    return NextResponse.json({ 
      message: '討論已刪除',
      postId: id 
    })
  } catch (error) {
    console.error('Error deleting post:', error)
    return NextResponse.json(
      { error: '刪除討論失敗' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!validateDeveloperAuth(request)) {
      return NextResponse.json(
        { error: '需要開發者權限' },
        { status: 403 }
      )
    }

    const { id } = params
    const body: RestorePostRequest = await request.json()

    // 找到對應的討論
    const postIndex = posts.findIndex(p => p.id === id)
    if (postIndex === -1) {
      return NextResponse.json(
        { error: '討論不存在' },
        { status: 404 }
      )
    }

    // 恢復：移除刪除標記
    posts[postIndex].isDeleted = false
    delete posts[postIndex].deletedAt
    delete posts[postIndex].deletedReason

    return NextResponse.json({ 
      message: '討論已恢復',
      postId: id 
    })
  } catch (error) {
    console.error('Error restoring post:', error)
    return NextResponse.json(
      { error: '恢復討論失敗' },
      { status: 500 }
    )
  }
} 