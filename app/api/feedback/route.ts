import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { FeedbackForm } from '@/types/resume'
import { feedbacksData } from '@/lib/adminData'

export async function POST(request: NextRequest) {
  try {
    const body: FeedbackForm = await request.json()

    // Validate required fields
    if (!body.content || body.content.trim().length === 0) {
      return NextResponse.json(
        { error: '意見內容為必填欄位' },
        { status: 400 }
      )
    }

    // 保存到後台管理系統
    const feedback = feedbacksData.add({
      rating: body.rating || 5,
      name: body.name || '',
      email: body.email || '',
      content: body.content
    })

    // Create email transporter
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: 'tyouxipindao@gmail.com',
        pass: 'ecao uqoa lpxx sswi', // 直接使用密碼進行測試
      },
    })

    // Prepare email content
    const emailContent = `
      新的意見回饋

      評分: ${body.rating}/5
      姓名: ${body.name || '未提供'}
      電子郵件: ${body.email || '未提供'}
      
      意見內容:
      ${body.content}
      
      提交時間: ${new Date().toLocaleString('zh-TW')}
    `

    // Send email
    await transporter.sendMail({
      from: 'tyouxipindao@gmail.com',
      to: 'tyouxipindao@gmail.com',
      subject: 'ResumeCraft 意見回饋',
      text: emailContent,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">新的意見回饋</h2>
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>評分:</strong> ${body.rating}/5</p>
            <p><strong>姓名:</strong> ${body.name || '未提供'}</p>
            <p><strong>電子郵件:</strong> ${body.email || '未提供'}</p>
          </div>
          <div style="background-color: #fefefe; padding: 20px; border-left: 4px solid #2563eb; margin: 20px 0;">
            <h3 style="margin-top: 0;">意見內容:</h3>
            <p style="white-space: pre-wrap;">${body.content}</p>
          </div>
          <p style="color: #6b7280; font-size: 14px;">
            提交時間: ${new Date().toLocaleString('zh-TW')}
          </p>
        </div>
      `,
    })

    return NextResponse.json(
      { message: '意見回饋已成功提交' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Feedback submission error:', error)
    return NextResponse.json(
      { error: '提交失敗，請稍後再試' },
      { status: 500 }
    )
  }
} 