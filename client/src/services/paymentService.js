import { getJson, sendJson } from '../utils/api'

export const fetchClientTransactions = async () => {
  return getJson('/api/payments/client')
}

export const sendPaymentOTP = async (amount, jobId) => {
  return sendJson('/api/payments/send-otp', {
    method: 'POST',
    body: { amount, jobId },
  })
}

export const verifyPaymentOTP = async (otp) => {
  return sendJson('/api/payments/verify-otp', {
    method: 'POST',
    body: { otp },
  })
}
