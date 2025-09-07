import { NextRequest, NextResponse } from 'next/server'
import { UpdateAnnouncementRequest, AnnouncementResponse } from '@/types/announcement'
import { announcementsData } from '@/lib/adminData'

// 獲取單個公告
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const announcement = announcementsData.getById(params.id)
    
    if (!announcement) {
      return NextResponse.json(
        { success: false, message: '公告不存在' } as AnnouncementResponse,
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: announcement
    } as AnnouncementResponse)
  } catch (error) {
    console.error('Error fetching announcement:', error)
    return NextResponse.json(
      { success: false, message: '獲取公告失敗' } as AnnouncementResponse,
      { status: 500 }
    )
  }
}

// 更新公告
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body: UpdateAnnouncementRequest = await request.json()
    
    // 驗證必要欄位
    if (body.title !== undefined && !body.title.trim()) {
      return NextResponse.json(
        { success: false, message: '標題不能為空' },
        { status: 400 }
      )
    }

    if (body.content !== undefined && !body.content.trim()) {
      return NextResponse.json(
        { success: false, message: '內容不能為空' },
        { status: 400 }
      )
    }

    // 更新公告
    const updatedAnnouncement = announcementsData.update(params.id, {
      title: body.title?.trim(),
      content: body.content?.trim(),
      link: body.link?.trim(),
      linkText: body.linkText?.trim(),
      isActive: body.isActive,
      priority: body.priority,
      startDate: body.startDate,
      endDate: body.endDate
    })

    if (!updatedAnnouncement) {
      return NextResponse.json(
        { success: false, message: '公告不存在' } as AnnouncementResponse,
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: updatedAnnouncement,
      message: '公告更新成功'
    } as AnnouncementResponse)
  } catch (error) {
    console.error('Error updating announcement:', error)
    return NextResponse.json(
      { success: false, message: '更新公告失敗' } as AnnouncementResponse,
      { status: 500 }
    )
  }
}

// 刪除公告
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const deleted = announcementsData.delete(params.id)
    
    if (!deleted) {
      return NextResponse.json(
        { success: false, message: '公告不存在' } as AnnouncementResponse,
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: '公告刪除成功'
    } as AnnouncementResponse)
  } catch (error) {
    console.error('Error deleting announcement:', error)
    return NextResponse.json(
      { success: false, message: '刪除公告失敗' } as AnnouncementResponse,
      { status: 500 }
    )
  }
}
