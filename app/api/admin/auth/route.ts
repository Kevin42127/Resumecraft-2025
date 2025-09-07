import { NextRequest, NextResponse } from 'next/server'
import { writeFileSync, readFileSync, existsSync } from 'fs'
import { join } from 'path'

// 簡單的管理員認證（實際應用中應該使用更安全的方式）
const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'resumecraft2025' // 實際應用中應該使用環境變數
}

// 訪問日誌文件路徑
const ACCESS_LOG_FILE = join(process.cwd(), 'data', 'access-log.json')

// 確保數據目錄存在
function ensureDataDir() {
  const dataDir = join(process.cwd(), 'data')
  if (!existsSync(dataDir)) {
    require('fs').mkdirSync(dataDir, { recursive: true })
  }
}

// 記錄登入嘗試
function logLoginAttempt(username: string, success: boolean, ip: string, userAgent: string) {
  try {
    ensureDataDir()
    
    const logEntry = {
      id: Date.now().toString(36) + Math.random().toString(36).substr(2),
      type: success ? 'successful_login' : 'failed_login',
      username,
      success,
      timestamp: new Date().toISOString(),
      ip,
      userAgent
    }
    
    let logs = []
    if (existsSync(ACCESS_LOG_FILE)) {
      const data = readFileSync(ACCESS_LOG_FILE, 'utf-8')
      logs = JSON.parse(data)
    }
    
    logs.push(logEntry)
    
    // 限制日誌數量
    if (logs.length > 1000) {
      logs.splice(0, logs.length - 1000)
    }
    
    writeFileSync(ACCESS_LOG_FILE, JSON.stringify(logs, null, 2))
    
    console.log(`[LOGIN] ${success ? 'SUCCESS' : 'FAILED'}: ${username} from ${ip}`)
  } catch (error) {
    console.error('Error logging login attempt:', error)
  }
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
    const { username, password, accessKey, timestamp } = await request.json()
    const ip = getClientIP(request)
    const userAgent = request.headers.get('user-agent') || 'unknown'

    // 驗證訪問密鑰（如果提供）
    if (accessKey && accessKey !== 'verified') {
      logLoginAttempt(username, false, ip, userAgent)
      return NextResponse.json(
        { error: '無效的訪問密鑰' },
        { status: 403 }
      )
    }

    // 驗證帳號密碼
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      // 記錄成功登入
      logLoginAttempt(username, true, ip, userAgent)
      
      // 生成簡單的 token（實際應用中應該使用 JWT）
      const token = Buffer.from(`${username}:${Date.now()}`).toString('base64')
      
      return NextResponse.json({
        success: true,
        token,
        message: '登入成功',
        loginTime: new Date().toISOString()
      })
    } else {
      // 記錄失敗登入
      logLoginAttempt(username, false, ip, userAgent)
      
      return NextResponse.json(
        { error: '使用者名稱或密碼錯誤' },
        { status: 401 }
      )
    }
  } catch (error) {
    console.error('認證錯誤:', error)
    return NextResponse.json(
      { error: '認證失敗' },
      { status: 500 }
    )
  }
}
