import fs from 'fs'
import path from 'path'

// 數據文件路徑
const DATA_DIR = path.join(process.cwd(), 'data')
const POSTS_FILE = path.join(DATA_DIR, 'posts.json')
const CONTACTS_FILE = path.join(DATA_DIR, 'contacts.json')
const FEEDBACKS_FILE = path.join(DATA_DIR, 'feedbacks.json')
const ANNOUNCEMENTS_FILE = path.join(DATA_DIR, 'announcements.json')

// 確保數據目錄存在
function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
  }
}

// 讀取數據文件
function readDataFile(filePath: string, defaultValue: any[] = []) {
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf8')
      return JSON.parse(data)
    }
  } catch (error) {
    console.error(`讀取數據文件失敗: ${filePath}`, error)
  }
  return defaultValue
}

// 寫入數據文件
function writeDataFile(filePath: string, data: any[]) {
  try {
    ensureDataDir()
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2))
    return true
  } catch (error) {
    console.error(`寫入數據文件失敗: ${filePath}`, error)
    return false
  }
}

// 生成唯一 ID
function generateId() {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9)
}

// 討論區文章數據管理
export const postsData = {
  getAll: () => readDataFile(POSTS_FILE),
  
  add: (post: any) => {
    const posts = postsData.getAll()
    const newPost = {
      id: generateId(),
      ...post,
      createdAt: new Date().toISOString(),
      likes: 0,
      comments: 0,
      isVisible: true,
      replies: []
    }
    posts.push(newPost)
    writeDataFile(POSTS_FILE, posts)
    return newPost
  },
  
  update: (id: string, updates: any) => {
    const posts = postsData.getAll()
    const index = posts.findIndex((post: any) => post.id === id)
    if (index !== -1) {
      posts[index] = { ...posts[index], ...updates }
      writeDataFile(POSTS_FILE, posts)
      return posts[index]
    }
    return null
  },
  
  addReply: (id: string, reply: any) => {
    const posts = postsData.getAll()
    const index = posts.findIndex((post: any) => post.id === id)
    if (index !== -1) {
      const newReply = {
        id: generateId(),
        ...reply,
        createdAt: new Date().toISOString()
      }
      posts[index].replies = posts[index].replies || []
      posts[index].replies.push(newReply)
      posts[index].comments = (posts[index].comments || 0) + 1
      writeDataFile(POSTS_FILE, posts)
      return posts[index]
    }
    return null
  },
  
  delete: (id: string) => {
    const posts = postsData.getAll()
    const filteredPosts = posts.filter((post: any) => post.id !== id)
    writeDataFile(POSTS_FILE, filteredPosts)
    return true
  }
}

// 聯絡訊息數據管理
export const contactsData = {
  getAll: () => readDataFile(CONTACTS_FILE),
  
  add: (contact: any) => {
    const contacts = contactsData.getAll()
    const newContact = {
      id: generateId(),
      ...contact,
      createdAt: new Date().toISOString(),
      isRead: false,
      isReplied: false,
      replies: []
    }
    contacts.push(newContact)
    writeDataFile(CONTACTS_FILE, contacts)
    return newContact
  },
  
  update: (id: string, updates: any) => {
    const contacts = contactsData.getAll()
    const index = contacts.findIndex((contact: any) => contact.id === id)
    if (index !== -1) {
      contacts[index] = { ...contacts[index], ...updates }
      writeDataFile(CONTACTS_FILE, contacts)
      return contacts[index]
    }
    return null
  },
  
  addReply: (id: string, reply: any) => {
    const contacts = contactsData.getAll()
    const index = contacts.findIndex((contact: any) => contact.id === id)
    if (index !== -1) {
      const newReply = {
        id: generateId(),
        ...reply,
        createdAt: new Date().toISOString()
      }
      contacts[index].replies = contacts[index].replies || []
      contacts[index].replies.push(newReply)
      contacts[index].isReplied = true
      writeDataFile(CONTACTS_FILE, contacts)
      return contacts[index]
    }
    return null
  },
  
  delete: (id: string) => {
    const contacts = contactsData.getAll()
    const filteredContacts = contacts.filter((contact: any) => contact.id !== id)
    writeDataFile(CONTACTS_FILE, filteredContacts)
    return true
  }
}

// 意見回饋數據管理
export const feedbacksData = {
  getAll: () => readDataFile(FEEDBACKS_FILE),
  
  add: (feedback: any) => {
    const feedbacks = feedbacksData.getAll()
    const newFeedback = {
      id: generateId(),
      ...feedback,
      createdAt: new Date().toISOString(),
      isRead: false,
      isProcessed: false,
      replies: []
    }
    feedbacks.push(newFeedback)
    writeDataFile(FEEDBACKS_FILE, feedbacks)
    return newFeedback
  },
  
  update: (id: string, updates: any) => {
    const feedbacks = feedbacksData.getAll()
    const index = feedbacks.findIndex((feedback: any) => feedback.id === id)
    if (index !== -1) {
      feedbacks[index] = { ...feedbacks[index], ...updates }
      writeDataFile(FEEDBACKS_FILE, feedbacks)
      return feedbacks[index]
    }
    return null
  },
  
  addReply: (id: string, reply: any) => {
    const feedbacks = feedbacksData.getAll()
    const index = feedbacks.findIndex((feedback: any) => feedback.id === id)
    if (index !== -1) {
      const newReply = {
        id: generateId(),
        ...reply,
        createdAt: new Date().toISOString()
      }
      feedbacks[index].replies = feedbacks[index].replies || []
      feedbacks[index].replies.push(newReply)
      feedbacks[index].isProcessed = true
      writeDataFile(FEEDBACKS_FILE, feedbacks)
      return feedbacks[index]
    }
    return null
  },
  
  delete: (id: string) => {
    const feedbacks = feedbacksData.getAll()
    const filteredFeedbacks = feedbacks.filter((feedback: any) => feedback.id !== id)
    writeDataFile(FEEDBACKS_FILE, filteredFeedbacks)
    return true
  }
}

// 公告數據管理
export const announcementsData = {
  getAll: () => readDataFile(ANNOUNCEMENTS_FILE),
  
  getById: (id: string) => {
    const announcements = announcementsData.getAll()
    return announcements.find((announcement: any) => announcement.id === id)
  },
  
  add: (announcement: any) => {
    const announcements = announcementsData.getAll()
    const newAnnouncement = {
      id: generateId(),
      ...announcement,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    announcements.push(newAnnouncement)
    writeDataFile(ANNOUNCEMENTS_FILE, announcements)
    return newAnnouncement
  },
  
  update: (id: string, updates: any) => {
    const announcements = announcementsData.getAll()
    const index = announcements.findIndex((announcement: any) => announcement.id === id)
    if (index !== -1) {
      announcements[index] = { 
        ...announcements[index], 
        ...updates,
        updatedAt: new Date().toISOString()
      }
      writeDataFile(ANNOUNCEMENTS_FILE, announcements)
      return announcements[index]
    }
    return null
  },
  
  delete: (id: string) => {
    const announcements = announcementsData.getAll()
    const filteredAnnouncements = announcements.filter((announcement: any) => announcement.id !== id)
    writeDataFile(ANNOUNCEMENTS_FILE, filteredAnnouncements)
    return true
  }
}

// 獲取統計數據
export function getStats() {
  const posts = postsData.getAll()
  const contacts = contactsData.getAll()
  const feedbacks = feedbacksData.getAll()
  const announcements = announcementsData.getAll()
  
  // 計算最近活動（過去24小時）
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
  const recentActivity = [
    ...posts.filter((post: any) => new Date(post.createdAt) > oneDayAgo),
    ...contacts.filter((contact: any) => new Date(contact.createdAt) > oneDayAgo),
    ...feedbacks.filter((feedback: any) => new Date(feedback.createdAt) > oneDayAgo),
    ...announcements.filter((announcement: any) => new Date(announcement.createdAt) > oneDayAgo)
  ].length
  
  return {
    totalPosts: posts.length,
    totalContacts: contacts.length,
    totalFeedbacks: feedbacks.length,
    totalAnnouncements: announcements.length,
    recentActivity
  }
}
