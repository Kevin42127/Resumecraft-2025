export interface Announcement {
  id: string
  title: string
  content: string
  link?: string
  linkText?: string
  isActive: boolean
  priority: 'low' | 'medium' | 'high'
  startDate: string
  endDate?: string
  createdAt: string
  updatedAt: string
  createdBy: string
}

export interface CreateAnnouncementRequest {
  title: string
  content: string
  link?: string
  linkText?: string
  isActive: boolean
  priority: 'low' | 'medium' | 'high'
  startDate: string
  endDate?: string
}

export interface UpdateAnnouncementRequest extends Partial<CreateAnnouncementRequest> {
  id: string
}

export interface AnnouncementResponse {
  success: boolean
  data?: Announcement
  message?: string
}

export interface AnnouncementsResponse {
  success: boolean
  data?: Announcement[]
  message?: string
}
