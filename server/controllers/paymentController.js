import Payment from '../models/Payment.js'
import { generateOTP, sendOTPEmail, storeOTP, verifyOTP } from '../utils/otpUtils.js'

export const getClientPayments = async (req, res) => {
  try {
    const clientId = req.user?._id
    if (!clientId) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    const payments = await Payment.find({ client: clientId })
      .populate('job', 'title')
      .populate('freelancer', 'name email')
      .sort({ createdAt: -1 })

    return res.status(200).json(payments)
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch transactions' })
  }
}

export const sendPaymentOTP = async (req, res) => {
  try {
    const userId = req.user?._id
    const userEmail = req.user?.email

    if (!userId || !userEmail) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    const { amount, jobId } = req.body || {}

    if (!amount || !jobId) {
      return res.status(400).json({ message: 'Amount and job ID are required' })
    }

    const otp = generateOTP()
    await sendOTPEmail(userEmail, otp, 'payment')
    storeOTP(userEmail, otp, 'payment')

    // Store payment data temporarily
    const paymentData = {
      userId,
      email: userEmail,
      amount,
      jobId,
      expiresAt: Date.now() + 10 * 60 * 1000 // 10 minutes
    }
    global.tempPayments = global.tempPayments || new Map()
    global.tempPayments.set(userEmail, paymentData)

    return res.status(200).json({
      message: 'Payment OTP sent to your email',
      email: userEmail
    })
  } catch (error) {
    console.error('[payment.sendPaymentOTP] error', error)
    return res.status(500).json({ message: 'Failed to send payment OTP' })
  }
}

export const verifyPaymentOTP = async (req, res) => {
  try {
    const userId = req.user?._id
    const userEmail = req.user?.email

    if (!userId || !userEmail) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    const { otp } = req.body || {}

    if (!otp) {
      return res.status(400).json({ message: 'OTP is required' })
    }

    if (!verifyOTP(userEmail, otp, 'payment')) {
      return res.status(400).json({ message: 'Invalid or expired OTP' })
    }

    // Get temp payment data
    global.tempPayments = global.tempPayments || new Map()
    const paymentData = global.tempPayments.get(userEmail)

    if (!paymentData || Date.now() > paymentData.expiresAt) {
      return res.status(400).json({ message: 'Payment session expired. Please try again.' })
    }

    // Verify the payment data belongs to the user
    if (paymentData.userId.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Unauthorized payment verification' })
    }

    // Clean up temp data
    global.tempPayments.delete(userEmail)

    // Here you would typically process the actual payment
    // For now, we'll just return success
    return res.status(200).json({
      message: 'Payment verified successfully',
      amount: paymentData.amount,
      jobId: paymentData.jobId
    })
  } catch (error) {
    console.error('[payment.verifyPaymentOTP] error', error)
    return res.status(500).json({ message: error.message || 'Payment verification failed' })
  }
}
