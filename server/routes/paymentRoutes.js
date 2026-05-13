import { Router } from 'express'
import { getClientPayments, sendPaymentOTP, verifyPaymentOTP } from '../controllers/paymentController.js'
import { authorizeRoles, protect } from '../middleware/authMiddleware.js'

const router = Router()

router.get('/client', protect, authorizeRoles('client'), getClientPayments)
router.post('/send-otp', protect, sendPaymentOTP)
router.post('/verify-otp', protect, verifyPaymentOTP)

export default router
