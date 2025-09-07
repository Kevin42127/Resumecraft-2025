import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(request: NextRequest) {
  try {
    // Create email transporter
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER || 'tyouxipindao@gmail.com',
        pass: process.env.EMAIL_PASS || 'ecao uqoa lpxx sswi',
      },
    })

    // Send test email
    await transporter.sendMail({
      from: process.env.EMAIL_USER || 'tyouxipindao@gmail.com',
      to: process.env.EMAIL_USER || 'tyouxipindao@gmail.com',
      subject: 'ResumeCraft 測試郵件',
      text: '這是一封測試郵件，確認 Email 功能正常運作。',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">ResumeCraft 測試郵件</h2>
          <p>這是一封測試郵件，確認 Email 功能正常運作。</p>
          <p>發送時間: ${new Date().toLocaleString('zh-TW')}</p>
        </div>
      `,
    })

    return NextResponse.json(
      { message: '測試郵件已成功發送' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Test email error:', error)
    return NextResponse.json(
      { error: '測試郵件發送失敗', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
} 