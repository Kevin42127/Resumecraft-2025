import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { contactsData } from '@/lib/adminData'

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message } = await request.json()

    // 驗證必要欄位
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: '所有欄位都是必填的' },
        { status: 400 }
      )
    }

    // 保存到後台管理系統
    const contact = contactsData.add({
      name,
      email,
      subject,
      message
    })

    // 創建郵件傳輸器 - 使用與意見回饋相同的配置
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: 'tyouxipindao@gmail.com',
        pass: 'ecao uqoa lpxx sswi', // 使用與意見回饋相同的密碼
      },
    })

    // 準備郵件內容
    const emailContent = `
      新的聯絡表單訊息

      姓名: ${name}
      電子郵件: ${email}
      主題: ${subject}
      
      訊息內容:
      ${message}
      
      提交時間: ${new Date().toLocaleString('zh-TW')}
    `

    // 發送郵件
    await transporter.sendMail({
      from: 'tyouxipindao@gmail.com',
      to: 'tyouxipindao@gmail.com',
      subject: `[ResumeCraft 聯絡表單] ${subject}`,
      text: emailContent,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">ResumeCraft 聯絡表單</h2>
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>姓名:</strong> ${name}</p>
            <p><strong>電子郵件:</strong> ${email}</p>
            <p><strong>主題:</strong> ${subject}</p>
          </div>
          <div style="background-color: #fefefe; padding: 20px; border-left: 4px solid #2563eb; margin: 20px 0;">
            <h3 style="margin-top: 0;">訊息內容:</h3>
            <p style="white-space: pre-wrap;">${message}</p>
          </div>
          <p style="color: #6b7280; font-size: 14px;">
            提交時間: ${new Date().toLocaleString('zh-TW')}
          </p>
        </div>
      `,
      replyTo: email, // 設定回覆地址為用戶的郵件
    })

    return NextResponse.json(
      { message: '郵件發送成功！我們會盡快回覆您。' },
      { status: 200 }
    )

  } catch (error) {
    console.error('郵件發送錯誤:', error)
    return NextResponse.json(
      { error: '郵件發送失敗，請稍後再試或直接發送郵件至 tyouxipindao@gmail.com' },
      { status: 500 }
    )
  }
}
