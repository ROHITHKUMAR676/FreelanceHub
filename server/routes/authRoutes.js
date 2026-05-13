import { Router } from 'express'
import { login, register, googleAuth, getMe, sendRegistrationOTP, verifyRegistrationOTP } from '../controllers/authController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = Router()

// Email/Password Auth
router.post('/register', register)
router.post('/register/send-otp', sendRegistrationOTP)
router.post('/register/verify-otp', verifyRegistrationOTP)
router.post('/login', login)

// ✅ Google Auth (IMPORTANT)
router.post('/google', googleAuth)
router.get('/me', protect, getMe)

export default router
