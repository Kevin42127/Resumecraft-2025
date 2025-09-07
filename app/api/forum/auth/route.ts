import { NextRequest, NextResponse } from 'next/server'
import { DeveloperAuth } from '@/types/forum'

// 開發者身份驗證
// 在實際應用中，這應該使用更安全的身份驗證方式
const DEVELOPER_TOKENS = {
  'dev-token-2024': {
    role: 'developer' as const,
    name: 'ResumeCraft Developer'
  },
  'admin-token-2024': {
    role: 'admin' as const,
    name: 'ResumeCraft Admin'
  }
}

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json(
        { error: '請提供驗證令牌' },
        { status: 400 }
      )
    }

    const developerInfo = DEVELOPER_TOKENS[token as keyof typeof DEVELOPER_TOKENS]

    if (!developerInfo) {
      return NextResponse.json(
        { error: '無效的驗證令牌' },
        { status: 401 }
      )
    }

    const auth: DeveloperAuth = {
      token,
      role: developerInfo.role,
      name: developerInfo.name
    }

    return NextResponse.json(auth)
  } catch (error) {
    console.error('Error authenticating developer:', error)
    return NextResponse.json(
      { error: '身份驗證失敗' },
      { status: 500 }
    )
  }
} 