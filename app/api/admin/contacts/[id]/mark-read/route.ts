import { NextRequest, NextResponse } from 'next/server'
import { contactsData } from '@/lib/adminData'

export async function PATCH(
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

    const contactId = params.id

    // 標記為已讀
    const updatedContact = contactsData.update(contactId, { isRead: true })
    
    if (!updatedContact) {
      return NextResponse.json(
        { error: '聯絡訊息不存在' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: '已標記為已讀',
      contact: updatedContact
    })
  } catch (error) {
    console.error('標記已讀錯誤:', error)
    return NextResponse.json(
      { error: '標記已讀失敗' },
      { status: 500 }
    )
  }
}
