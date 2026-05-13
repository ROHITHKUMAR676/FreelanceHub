import nodemailer from 'nodemailer'
import crypto from 'crypto'

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail', // or your email service
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  })
}

// Generate OTP
export const generateOTP = () => {
  return crypto.randomInt(1000, 9999).toString()
}

// Send OTP email
export const sendOTPEmail = async (email, otp, type = 'registration') => {
  try {
    const transporter = createTransporter()

    const subject = type === 'registration' ? 'Verify Your Email - FreelanceHub' : 'Payment Verification - FreelanceHub'
    const html = type === 'registration'
      ? `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #2563eb;">Welcome to FreelanceHub!</h2>
          <p>Your verification code is:</p>
          <div style="background-color: #f3f4f6; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
            <span style="font-size: 32px; font-weight: bold; color: #1f2937; letter-spacing: 4px;">${otp}</span>
          </div>
          <p>This code will expire in 10 minutes.</p>
          <p>If you didn't request this, please ignore this email.</p>
        </div>
      `
      : `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #2563eb;">Payment Verification</h2>
          <p>Your payment verification code is:</p>
          <div style="background-color: #f3f4f6; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
            <span style="font-size: 32px; font-weight: bold; color: #1f2937; letter-spacing: 4px;">${otp}</span>
          </div>
          <p>This code will expire in 10 minutes.</p>
          <p>If you didn't initiate this payment, please contact support immediately.</p>
        </div>
      `

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject,
      html,
    }

    await transporter.sendMail(mailOptions)
    return true
  } catch (error) {
    console.error('Error sending OTP email:', error)
    throw new Error('Failed to send verification email')
  }
}

// Store OTP in memory (in production, use Redis or database)
const otpStore = new Map()

export const storeOTP = (email, otp, type = 'registration') => {
  const key = `${type}:${email}`
  const expiresAt = Date.now() + 10 * 60 * 1000 // 10 minutes
  otpStore.set(key, { otp, expiresAt })

  // Clean up expired OTPs
  setTimeout(() => {
    otpStore.delete(key)
  }, 10 * 60 * 1000)
}

export const verifyOTP = (email, otp, type = 'registration') => {
  const key = `${type}:${email}`
  const stored = otpStore.get(key)

  if (!stored) {
    return false
  }

  if (Date.now() > stored.expiresAt) {
    otpStore.delete(key)
    return false
  }

 if (stored.otp === otp) {
  otpStore.delete(key)
  return true
}

return false
}