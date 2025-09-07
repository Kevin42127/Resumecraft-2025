import { NextResponse } from 'next/server'
import { Announcement, AnnouncementsResponse } from '@/types/announcement'
import { announcementsData } from '@/lib/adminData'

// 獲取活躍的公告（供前端使用）
export async function GET() {
  try {
    const allAnnouncements = announcementsData.getAll()
    const now = new Date()
    
    // 篩選活躍的公告
    const activeAnnouncements = allAnnouncements.filter((announcement: any) => {
      if (!announcement.isActive) return false
      
      const startDate = new Date(announcement.startDate)
      if (startDate > now) return false
      
      if (announcement.endDate) {
        const endDate = new Date(announcement.endDate)
        if (endDate < now) return false
      }
      
      return true
    })
    
    // 按優先級和創建時間排序
    const sortedAnnouncements = activeAnnouncements.sort((a: any, b: any) => {
      const priorityOrder: { [key: string]: number } = { high: 3, medium: 2, low: 1 }
      const aPriority = priorityOrder[a.priority] || 0
      const bPriority = priorityOrder[b.priority] || 0
      
      if (aPriority !== bPriority) {
        return bPriority - aPriority
      }
      
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })

    return NextResponse.json({
      success: true,
      data: sortedAnnouncements
    } as AnnouncementsResponse)
  } catch (error) {
    console.error('Error fetching active announcements:', error)
    return NextResponse.json(
      { success: false, message: '獲取公告失敗' } as AnnouncementsResponse,
      { status: 500 }
    )
  }
}
