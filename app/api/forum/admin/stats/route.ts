import { NextRequest, NextResponse } from 'next/server'
import { AdminStats } from '@/types/forum'

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

export async function GET(request: NextRequest) {
  try {
    if (!validateDeveloperAuth(request)) {
      return NextResponse.json(
        { error: '需要開發者權限' },
        { status: 403 }
      )
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // 計算統計數據
    const totalPosts = posts.length
    const totalComments = posts.reduce((sum, post) => sum + post.comments.length, 0)
    const deletedPosts = posts.filter(post => post.isDeleted).length
    const deletedComments = posts.reduce((sum, post) => 
      sum + post.comments.filter((comment: any) => comment.isDeleted).length, 0
    )
    
    const todayPosts = posts.filter(post => {
      const postDate = new Date(post.createdAt)
      return postDate >= today && !post.isDeleted
    }).length
    
    const todayComments = posts.reduce((sum, post) => {
      if (post.isDeleted) return sum
      const todayComments = post.comments.filter((comment: any) => {
        const commentDate = new Date(comment.createdAt)
        return commentDate >= today && !comment.isDeleted
      })
      return sum + todayComments.length
    }, 0)

    // 計算活躍用戶（過去7天內發文或留言的用戶）
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    
    const activeUsers = new Set()
    posts.forEach(post => {
      if (new Date(post.createdAt) >= sevenDaysAgo && !post.isDeleted) {
        activeUsers.add(post.author)
      }
      post.comments.forEach((comment: any) => {
        if (new Date(comment.createdAt) >= sevenDaysAgo && !comment.isDeleted) {
          activeUsers.add(comment.author)
        }
      })
    })

    const stats: AdminStats = {
      totalPosts,
      totalComments,
      deletedPosts,
      deletedComments,
      todayPosts,
      todayComments,
      activeUsers: activeUsers.size
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching admin stats:', error)
    return NextResponse.json(
      { error: '獲取統計數據失敗' },
      { status: 500 }
    )
  }
} 