import { NextRequest, NextResponse } from 'next/server'
import { writeFileSync, readFileSync, existsSync } from 'fs'
import { join } from 'path'

const ACCESS_LOG_FILE = join(process.cwd(), 'data', 'access-log.json')

interface AccessLogEntry {
  id: string
  type: 'unauthorized_access' | 'unauthorized_admin_access' | 'invalid_key' | 'successful_login' | 'failed_login' | 'network_error'
  path: string
  key?: string
  timestamp: string
  userAgent: string
  ip: string
  success: boolean
}

// 確保數據目錄存在
function ensureDataDir() {
  const dataDir = join(process.cwd(), 'data')
  if (!existsSync(dataDir)) {
    require('fs').mkdirSync(dataDir, { recursive: true })
  }
}

// 讀取訪問日誌
function readAccessLog(): AccessLogEntry[] {
  try {
    ensureDataDir()
    if (!existsSync(ACCESS_LOG_FILE)) {
      return []
    }
    const data = readFileSync(ACCESS_LOG_FILE, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Error reading access log:', error)
    return []
  }
}

// 寫入訪問日誌
function writeAccessLog(logs: AccessLogEntry[]) {
  try {
    ensureDataDir()
    writeFileSync(ACCESS_LOG_FILE, JSON.stringify(logs, null, 2))
  } catch (error) {
    console.error('Error writing access log:', error)
  }
}

// 生成唯一 ID
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

// 獲取客戶端 IP
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  const cfConnectingIP = request.headers.get('cf-connecting-ip')
  
  if (cfConnectingIP) return cfConnectingIP
  if (realIP) return realIP
  if (forwarded) return forwarded.split(',')[0].trim()
  
  return 'unknown'
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, path, key, timestamp, userAgent } = body
    
    // 獲取真實 IP
    const ip = getClientIP(request)
    
    // 創建日誌條目
    const logEntry: AccessLogEntry = {
      id: generateId(),
      type,
      path,
      key,
      timestamp: timestamp || new Date().toISOString(),
      userAgent: userAgent || request.headers.get('user-agent') || 'unknown',
      ip,
      success: type === 'successful_login'
    }
    
    // 讀取現有日誌
    const logs = readAccessLog()
    
    // 添加新條目
    logs.push(logEntry)
    
    // 限制日誌數量（保留最近 1000 條）
    if (logs.length > 1000) {
      logs.splice(0, logs.length - 1000)
    }
    
    // 寫入日誌
    writeAccessLog(logs)
    
    // 記錄到控制台（用於監控）
    console.log(`[ACCESS LOG] ${type.toUpperCase()}: ${path} from ${ip} at ${logEntry.timestamp}`)
    
    return NextResponse.json({ 
      success: true, 
      message: 'Access logged successfully',
      logId: logEntry.id
    })
    
  } catch (error) {
    console.error('Error logging access:', error)
    return NextResponse.json(
      { error: 'Failed to log access' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    // 檢查是否有管理員權限
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    const logs = readAccessLog()
    
    // 按時間倒序排列
    logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    
    // 統計信息
    const stats = {
      total: logs.length,
      unauthorized: logs.filter(log => log.type.includes('unauthorized')).length,
      failedLogins: logs.filter(log => log.type === 'failed_login').length,
      successfulLogins: logs.filter(log => log.type === 'successful_login').length,
      last24Hours: logs.filter(log => {
        const logTime = new Date(log.timestamp).getTime()
        const now = Date.now()
        return (now - logTime) < 24 * 60 * 60 * 1000
      }).length
    }
    
    return NextResponse.json({
      logs: logs.slice(0, 100), // 只返回最近 100 條
      stats
    })
    
  } catch (error) {
    console.error('Error fetching access log:', error)
    return NextResponse.json(
      { error: 'Failed to fetch access log' },
      { status: 500 }
    )
  }
}
