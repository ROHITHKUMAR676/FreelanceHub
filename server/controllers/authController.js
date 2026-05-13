import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { OAuth2Client } from 'google-auth-library'
import User from '../models/User.js'
import { generateOTP, sendOTPEmail, storeOTP, verifyOTP } from '../utils/otpUtils.js'

const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

// ✅ FIX: pass CLIENT ID here
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)
const DEFAULT_ROLE = 'freelancer'

const generateToken = ({ userId, role }) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT secret is not configured')
  }

  return jwt.sign({ userId, role }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  })
}

const buildAuthResponse = (user) => {
  const safeRole = user.role || DEFAULT_ROLE
  const token = generateToken({
    userId: user._id.toString(),
    role: safeRole,
  })

  return {
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: safeRole,
    },
  }
}

export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body || {}
    const normalizedName = typeof name === 'string' ? name.trim() : ''
    const normalizedEmail = typeof email === 'string' ? email.toLowerCase().trim() : ''
    const normalizedRole = typeof role === 'string' ? role.trim() : ''

    console.log('[auth.register] incoming request', {
      name: normalizedName,
      email: normalizedEmail,
      role: normalizedRole,
      hasPassword: Boolean(password),
    })

    if (!normalizedName || !normalizedEmail || !password || !normalizedRole) {
      return res.status(400).json({ message: 'All fields are required' })
    }

    if (!isValidEmail(normalizedEmail)) {
      return res.status(400).json({ message: 'Invalid email format' })
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' })
    }

    if (!['client', 'freelancer'].includes(normalizedRole)) {
      return res.status(400).json({ message: 'Invalid role' })
    }

    const existingUser = await User.findOne({ email: normalizedEmail })
    if (existingUser) {
      return res.status(409).json({ message: 'Email already exists' })
    }

    // Generate and send OTP
    const otp = generateOTP()
    await sendOTPEmail(normalizedEmail, otp, 'registration')
    storeOTP(normalizedEmail, otp, 'registration')

    // Store registration data temporarily (in production, use Redis or temp storage)
    const tempData = {
      name: normalizedName,
      email: normalizedEmail,
      password,
      role: normalizedRole,
      expiresAt: Date.now() + 10 * 60 * 1000 // 10 minutes
    }
    // Store in memory for now (use proper storage in production)
    global.tempRegistrations = global.tempRegistrations || new Map()
    global.tempRegistrations.set(normalizedEmail, tempData)

    return res.status(200).json({
      message: 'OTP sent to your email. Please verify to complete registration.',
      email: normalizedEmail
    })
  } catch (error) {
    console.error('[auth.register] error', error)
    return res.status(500).json({ message: error.message || 'Server error' })
  }
}

export const sendRegistrationOTP = async (req, res) => {
  try {
    const { email } = req.body || {}
    const normalizedEmail = typeof email === 'string' ? email.toLowerCase().trim() : ''

    if (!normalizedEmail || !isValidEmail(normalizedEmail)) {
      return res.status(400).json({ message: 'Valid email is required' })
    }

    const otp = generateOTP()
    await sendOTPEmail(normalizedEmail, otp, 'registration')
    storeOTP(normalizedEmail, otp, 'registration')

    return res.status(200).json({ message: 'OTP sent successfully' })
  } catch (error) {
    console.error('[auth.sendRegistrationOTP] error', error)
    return res.status(500).json({ message: 'Failed to send OTP' })
  }
}

export const verifyRegistrationOTP = async (req, res) => {
  try {
    const { email, otp } = req.body || {}
    const normalizedEmail = typeof email === 'string' ? email.toLowerCase().trim() : ''

    if (!normalizedEmail || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required' })
    }

    if (!verifyOTP(normalizedEmail, otp, 'registration')) {
      return res.status(400).json({ message: 'Invalid or expired OTP' })
    }

    // Get temp registration data
    global.tempRegistrations = global.tempRegistrations || new Map()
    const tempData = global.tempRegistrations.get(normalizedEmail)

    if (!tempData || Date.now() > tempData.expiresAt) {
      return res.status(400).json({ message: 'Registration session expired. Please start over.' })
    }

    // Create user
    const hashedPassword = await bcrypt.hash(tempData.password, 10)
    const user = await User.create({
      name: tempData.name,
      email: tempData.email,
      password: hashedPassword,
      role: tempData.role,
    })

    // Clean up temp data
    global.tempRegistrations.delete(normalizedEmail)

    console.log('[auth.verifyRegistrationOTP] user created', {
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    })

    return res.status(201).json({
      message: 'Registration completed successfully',
      ...buildAuthResponse(user),
    })
  } catch (error) {
    console.error('[auth.verifyRegistrationOTP] error', error)
    return res.status(500).json({ message: error.message || 'Server error' })
  }
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body || {}
    const normalizedEmail = typeof email === 'string' ? email.toLowerCase().trim() : ''

    if (!normalizedEmail || !password) {
      return res.status(400).json({ message: 'Email and password required' })
    }

    const user = await User.findOne({ email: normalizedEmail })

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    if (!user.password) {
      return res.status(401).json({ message: 'Use Google Sign-In' })
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    if (!user.role) {
      user.role = DEFAULT_ROLE
      await user.save()
    }

    return res.status(200).json(buildAuthResponse(user))
  } catch (error) {
    console.error('[auth.login] error', error)
    return res.status(500).json({ message: error.message || 'Server error' })
  }
}

// ✅ FINAL FIXED GOOGLE AUTH
export const googleAuth = async (req, res) => {
  try {
    // ✅ FIX: use credential, NOT token
    const { credential } = req.body

    if (!credential) {
      return res.status(400).json({ message: 'Google credential missing' })
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    })

    const payload = ticket.getPayload()

    const email = payload.email.toLowerCase().trim()
    const name = payload.name
    const googleId = payload.sub

    let user = await User.findOne({ email })

    if (!user) {
      user = await User.create({
        name,
        email,
        role: DEFAULT_ROLE,
        password: null,
        googleId,
      })
    } else {
      // attach googleId if missing
      if (!user.googleId) {
        user.googleId = googleId
      }

      if (!user.role) {
        user.role = DEFAULT_ROLE
      }

      if (user.isModified('googleId') || user.isModified('role')) {
        await user.save()
      }
    }

    return res.status(200).json(buildAuthResponse(user))
  } catch (error) {
    console.error(error)
    return res.status(401).json({ message: 'Google authentication failed' })
  }
}

export const getMe = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    return res.status(200).json({
      user: {
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role || DEFAULT_ROLE,
      },
    })
  } catch (error) {
    console.error('[auth.me] error', error)
    return res.status(500).json({ message: error.message || 'Server error' })
  }
}
