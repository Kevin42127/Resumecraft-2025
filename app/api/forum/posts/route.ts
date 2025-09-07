import { NextRequest, NextResponse } from 'next/server'
import { ForumPost, CreatePostRequest } from '@/types/forum'
import { postsData } from '@/lib/adminData'

export async function GET() {
  try {
    // 從後台管理系統的數據源獲取文章
    const allPosts = postsData.getAll()
    
    // 只顯示可見的文章，按創建時間排序，最新的在前
    const visiblePosts = allPosts
      .filter((post: any) => post.isVisible)
      .sort((a: any, b: any) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )

    // 轉換數據格式以匹配前端期望的格式
    const formattedPosts: ForumPost[] = visiblePosts.map((post: any) => ({
      id: post.id,
      title: post.title,
      content: post.content,
      author: post.author,
      category: 'general', // 默認分類
      likes: post.likes || 0,
      comments: post.replies || [],
      createdAt: post.createdAt,
      updatedAt: post.createdAt,
      isDeleted: false
    }))

    return NextResponse.json({ posts: formattedPosts })
  } catch (error) {
    console.error('Error fetching posts:', error)
    return NextResponse.json(
      { error: '獲取討論失敗' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: CreatePostRequest = await request.json()
    
    // 驗證必要欄位
    if (!body.title?.trim() || !body.content?.trim() || !body.author?.trim()) {
      return NextResponse.json(
        { error: '請填寫所有必要欄位' },
        { status: 400 }
      )
    }

    // 使用後台管理系統的數據源創建新文章
    const newPost = postsData.add({
      title: body.title.trim(),
      content: body.content.trim(),
      author: body.author.trim()
    })

    // 轉換為前端期望的格式
    const formattedPost: ForumPost = {
      id: newPost.id,
      title: newPost.title,
      content: newPost.content,
      author: newPost.author,
      category: body.category || 'general',
      likes: newPost.likes || 0,
      comments: newPost.replies || [],
      createdAt: newPost.createdAt,
      updatedAt: newPost.createdAt,
      isDeleted: false
    }

    return NextResponse.json(formattedPost, { status: 201 })
  } catch (error) {
    console.error('Error creating post:', error)
    return NextResponse.json(
      { error: '創建討論失敗' },
      { status: 500 }
    )
  }
} 