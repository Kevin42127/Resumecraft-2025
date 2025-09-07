import { NextRequest, NextResponse } from 'next/server'
import { feedbacksData } from '@/lib/adminData'
import nodemailer from 'nodemailer'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 檢查認證
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: '未授權' },
        { status: 401 }
      )
    }

    const { message } = await request.json()
    const feedbackId = params.id

    if (!message || message.trim().length === 0) {
      return NextResponse.json(
        { error: '回復內容不能為空' },
        { status: 400 }
      )
    }

    // 獲取意見回饋
    const feedbacks = feedbacksData.getAll()
    const feedback = feedbacks.find((f: any) => f.id === feedbackId)
    
    if (!feedback) {
      return NextResponse.json(
        { error: '意見回饋不存在' },
        { status: 404 }
      )
    }

    // 添加回復到數據庫
    const updatedFeedback = feedbacksData.addReply(feedbackId, {
      message: message.trim(),
      adminName: '管理員'
    })

    // 如果用戶有提供郵件地址，發送回復郵件
    if (feedback.email) {
      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: 'tyouxipindao@gmail.com',
          pass: 'ecao uqoa lpxx sswi',
        },
      })

      const emailContent = `
        感謝您對 ResumeCraft 的意見回饋！

        您的回饋：
        評分：${feedback.rating}/5
        內容：${feedback.content}

        我們的回復：
        ${message}

        感謝您的支持，我們會持續改進服務！

        感謝您選擇 ResumeCraft，祝您求職順利！

        ResumeCraft 團隊
      `

      await transporter.sendMail({
        from: 'tyouxipindao@gmail.com',
        to: feedback.email,
        subject: 'ResumeCraft 意見回饋回復',
        text: emailContent,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">ResumeCraft 意見回饋回復</h2>
            
            <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0;">您的意見回饋</h3>
              <p><strong>評分：</strong> ${feedback.rating}/5 ⭐</p>
              <p><strong>內容：</strong></p>
              <div style="background-color: #ffffff; padding: 15px; border-left: 4px solid #e5e7eb; margin: 10px 0;">
                <p style="white-space: pre-wrap; margin: 0;">${feedback.content}</p>
              </div>
            </div>
            
            <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #1e40af;">我們的回復</h3>
              <div style="background-color: #ffffff; padding: 15px; border-left: 4px solid #3b82f6; margin: 10px 0;">
                <p style="white-space: pre-wrap; margin: 0;">${message}</p>
              </div>
            </div>
            
            <div style="text-align: center; margin-top: 30px; padding: 20px; background-color: #f9fafb; border-radius: 8px;">
              <p style="margin: 0; color: #6b7280;">
                感謝您的支持，我們會持續改進服務！<br><br>
                感謝您選擇 ResumeCraft，祝您求職順利！<br><br>
                <strong>ResumeCraft 團隊</strong>
              </p>
            </div>
          </div>
        `,
      })
    }

    return NextResponse.json({
      success: true,
      message: feedback.email ? '回復已發送' : '回復已保存',
      feedback: updatedFeedback
    })
  } catch (error) {
    console.error('發送回復錯誤:', error)
    return NextResponse.json(
      { error: '發送回復失敗' },
      { status: 500 }
    )
  }
}
