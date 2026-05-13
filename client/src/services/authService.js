import { getJson, sendJson } from '../utils/api'

export const registerWithEmail = async ({ name, email, password, role }) => {
  return sendJson('/api/auth/register', {
    method: 'POST',
    body: { name, email, password, role },
  })
}

export const sendRegistrationOTP = async (email) => {
  return sendJson('/api/auth/register/send-otp', {
    method: 'POST',
    body: { email },
  })
}

export const verifyRegistrationOTP = async (email, otp) => {
  return sendJson('/api/auth/register/verify-otp', {
    method: 'POST',
    body: { email, otp },
  })
}

export const loginWithEmail = async ({ email, password }) => {
  return sendJson('/api/auth/login', {
    method: 'POST',
    body: { email, password },
  })
}

// ✅ FIX: send "credential" NOT "token"
export const loginWithGoogle = async (googleCredential) => {
  return sendJson('/api/auth/google', {
    method: 'POST',
    body: { credential: googleCredential },
  })
}

export const getCurrentUser = async () => {
  return getJson('/api/auth/me')
}
