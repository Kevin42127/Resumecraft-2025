import { NextRequest, NextResponse } from 'next/server'
import { Announcement, CreateAnnouncementRequest, AnnouncementsResponse } from '@/types/announcement'
import { announcementsData } from '@/lib/adminData'

// 獲取所有公告
export async function GET() {
  try {
    const announcements = announcementsData.getAll()
    return NextResponse.json({
      success: true,
      data: announcements
    } as AnnouncementsResponse)
  } catch (error) {
    console.error('Error fetching announcements:', error)
    return NextResponse.json(
      { success: false, message: '獲取公告失敗' } as AnnouncementsResponse,
      { status: 500 }
    )
  }
}

// 創建新公告
export async function POST(request: NextRequest) {
  try {
    const body: CreateAnnouncementRequest = await request.json()
    
    // 驗證必要欄位
    if (!body.title?.trim() || !body.content?.trim()) {
      return NextResponse.json(
        { success: false, message: '請填寫標題和內容' },
        { status: 400 }
      )
    }

    // 創建新公告
    const newAnnouncement = announcementsData.add({
      title: body.title.trim(),
      content: body.content.trim(),
      link: body.link?.trim(),
      linkText: body.linkText?.trim(),
      isActive: body.isActive,
      priority: body.priority,
      startDate: body.startDate,
      endDate: body.endDate,
      createdBy: 'admin'
    })

    return NextResponse.json({
      success: true,
      data: newAnnouncement,
      message: '公告創建成功'
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating announcement:', error)
    return NextResponse.json(
      { success: false, message: '創建公告失敗' },
      { status: 500 }
    )
  }
}
