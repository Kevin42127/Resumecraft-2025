import { NextRequest, NextResponse } from 'next/server'
import { contactsData } from '@/lib/adminData'

export async function DELETE(
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

    // 刪除聯絡訊息
    const success = contactsData.delete(contactId)
    
    if (!success) {
      return NextResponse.json(
        { error: '聯絡訊息不存在' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: '聯絡訊息已刪除'
    })
  } catch (error) {
    console.error('刪除聯絡訊息錯誤:', error)
    return NextResponse.json(
      { error: '刪除聯絡訊息失敗' },
      { status: 500 }
    )
  }
}
