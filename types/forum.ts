export interface ForumPost {
  id: string
  title: string
  content: string
  author: string
  category: 'general' | 'resume-review' | 'portfolio' | 'career-advice' | 'interview'
  likes: number
  comments: ForumComment[]
  createdAt: string
  updatedAt: string
  isDeleted?: boolean // 軟刪除標記
  deletedAt?: string // 刪除時間
  deletedReason?: string // 刪除原因
}

export interface ForumComment {
  id: string
  postId: string
  content: string
  author: string
  likes: number
  createdAt: string
  isDeleted?: boolean // 軟刪除標記
}

export interface CreatePostRequest {
  title: string
  content: string
  author: string
  category: ForumPost['category']
}

export interface CreateCommentRequest {
  postId: string
  content: string
  author: string
}

export interface ForumStats {
  totalPosts: number
  totalComments: number
  todayPosts: number
  todayComments: number
}

// 新增：用戶角色和權限相關類型
export type UserRole = 'user' | 'developer' | 'admin'

export interface User {
  id: string
  name: string
  role: UserRole
  createdAt: string
}

export interface DeveloperAuth {
  token: string
  role: UserRole
  name: string
}

// 新增：管理操作相關類型
export interface DeletePostRequest {
  postId: string
  reason?: string
}

export interface DeleteCommentRequest {
  commentId: string
  postId: string
  reason?: string
}

export interface RestorePostRequest {
  postId: string
}

export interface RestoreCommentRequest {
  commentId: string
  postId: string
}

// 新增：管理統計類型
export interface AdminStats {
  totalPosts: number
  totalComments: number
  deletedPosts: number
  deletedComments: number
  todayPosts: number
  todayComments: number
  activeUsers: number
} 