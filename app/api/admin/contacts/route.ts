import { NextRequest, NextResponse } from 'next/server'
import { contactsData } from '@/lib/adminData'

export async function GET(request: NextRequest) {
  try {
    // 檢查認證
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: '未授權' },
        { status: 401 }
      )
    }

    const contacts = contactsData.getAll()
    return NextResponse.json({
      contacts
    })
  } catch (error) {
    console.error('獲取聯絡訊息錯誤:', error)
    return NextResponse.json(
      { error: '獲取聯絡訊息失敗' },
      { status: 500 }
    )
  }
}
