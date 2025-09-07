import { NextRequest, NextResponse } from 'next/server'
import { contactsData } from '@/lib/adminData'
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
    const contactId = params.id

    if (!message || message.trim().length === 0) {
      return NextResponse.json(
        { error: '回復內容不能為空' },
        { status: 400 }
      )
    }

    // 獲取聯絡訊息
    const contacts = contactsData.getAll()
    const contact = contacts.find((c: any) => c.id === contactId)
    
    if (!contact) {
      return NextResponse.json(
        { error: '聯絡訊息不存在' },
        { status: 404 }
      )
    }

    // 添加回復到數據庫
    const updatedContact = contactsData.addReply(contactId, {
      message: message.trim(),
      adminName: '管理員'
    })

    // 發送回復郵件給用戶
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
      感謝您聯絡 ResumeCraft！

      您的原始訊息：
      主題：${contact.subject}
      內容：${contact.message}

      我們的回復：
      ${message}

      如果您還有其他問題，請隨時與我們聯繫。

      感謝您選擇 ResumeCraft，祝您求職順利！

      ResumeCraft 團隊
    `

    await transporter.sendMail({
      from: 'tyouxipindao@gmail.com',
      to: contact.email,
      subject: `Re: ${contact.subject}`,
      text: emailContent,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">ResumeCraft 回復</h2>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">您的原始訊息</h3>
            <p><strong>主題：</strong> ${contact.subject}</p>
            <p><strong>內容：</strong></p>
            <div style="background-color: #ffffff; padding: 15px; border-left: 4px solid #e5e7eb; margin: 10px 0;">
              <p style="white-space: pre-wrap; margin: 0;">${contact.message}</p>
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
              如果您還有其他問題，請隨時與我們聯繫。<br><br>
              感謝您選擇 ResumeCraft，祝您求職順利！<br><br>
              <strong>ResumeCraft 團隊</strong>
            </p>
          </div>
        </div>
      `,
    })

    return NextResponse.json({
      success: true,
      message: '回復已發送',
      contact: updatedContact
    })
  } catch (error) {
    console.error('發送回復錯誤:', error)
    return NextResponse.json(
      { error: '發送回復失敗' },
      { status: 500 }
    )
  }
}
