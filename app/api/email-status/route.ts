import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function GET(request: NextRequest) {
  try {
    // Check environment variables
    const emailUser = 'tyouxipindao@gmail.com'
    const emailPass = process.env.EMAIL_PASS

    if (!emailPass) {
      return NextResponse.json({
        status: 'error',
        message: 'EMAIL_PASS 環境變數未設定',
        config: {
          user: emailUser,
          pass: 'NOT_SET'
        }
      }, { status: 500 })
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    })

    // Verify connection
    const verifyResult = await transporter.verify()

    return NextResponse.json({
      status: 'success',
      message: 'Email 設定正確',
      config: {
        host: 'smtp.gmail.com',
        port: 587,
        user: emailUser,
        pass: emailPass ? 'SET' : 'NOT_SET'
      },
      verification: verifyResult
    }, { status: 200 })

  } catch (error) {
    console.error('Email status check error:', error)
    
    return NextResponse.json({
      status: 'error',
      message: 'Email 設定有問題',
      error: error instanceof Error ? error.message : 'Unknown error',
      config: {
        user: 'tyouxipindao@gmail.com',
        pass: process.env.EMAIL_PASS ? 'SET' : 'NOT_SET'
      }
    }, { status: 500 })
  }
} 