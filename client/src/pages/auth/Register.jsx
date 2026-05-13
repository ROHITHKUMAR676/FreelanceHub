import { useState } from 'react'
import { useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { registerWithEmail, sendRegistrationOTP, verifyRegistrationOTP } from '../../services/authService'
import { saveProfileSignals } from '../../utils/profileSignals'
import OTPInput from '../../components/ui/OTPInput'

const roles = [
  {
    type: 'client',
    title: 'Client',
    desc: 'Post tasks and hire skilled freelancers.',
    accent: 'from-brand-primary to-sky-400',
  },
  {
    type: 'freelancer',
    title: 'Freelancer',
    desc: 'Find work and complete projects.',
    accent: 'from-brand-secondary to-emerald-400',
  },
]

const Register = () => {
  const { login } = useContext(AuthContext)
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const initialRole = searchParams.get('role')

  const [selectedRole, setSelectedRole] = useState(
    roles.some((role) => role.type === initialRole) ? initialRole : '',
  )
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    linkedinUrl: '',
    githubUrl: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [step, setStep] = useState('form') // 'form' or 'otp'
  const [otp, setOtp] = useState('')
  const [registrationEmail, setRegistrationEmail] = useState('')

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const validateEmail = (value) => /^\S+@\S+\.\S+$/.test(value)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!selectedRole) {
      setError('Please select a role first')
      return
    }

    const payload = {
      role: selectedRole,
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      password: formData.password,
    }

    if (!payload.name || !payload.email || !payload.password) {
      setError('Name, email, and password are required')
      return
    }

    if (!validateEmail(payload.email)) {
      setError('Please enter a valid email address.')
      return
    }

    setIsSubmitting(true)

    try {
      console.log('[register] sending OTP request', {
        name: payload.name,
        email: payload.email,
        role: payload.role,
      })

      const response = await registerWithEmail(payload)
      setRegistrationEmail(payload.email)
      setStep('otp')
    } catch (err) {
      console.error('[register] failed', err)
      const message = err?.message || 'Failed to send OTP'
      const isEmailDuplicate = err?.status === 409 || /email.*exists|already.*email|duplicate.*email/i.test(message)
      setError(isEmailDuplicate ? 'This email address is already registered.' : message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleVerifyOTP = async () => {
    if (otp.length !== 4) {
      setError('Please enter the complete 4-digit OTP')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      const authResponse = await verifyRegistrationOTP(registrationEmail, otp)
      if (selectedRole === 'freelancer') {
        saveProfileSignals(registrationEmail, {
          linkedinUrl: formData.linkedinUrl.trim(),
          githubUrl: formData.githubUrl.trim(),
          profileCompletion: 70,
        })
      }
      login(authResponse)
      localStorage.removeItem('freelancehub:onboarding-complete')
      localStorage.setItem('freelancehub:show-onboarding', 'true')

      const role = authResponse?.user?.role || selectedRole

      if (role === 'freelancer') {
        navigate('/freelancer/dashboard')
      } else {
        navigate('/client/dashboard')
      }
    } catch (err) {
      console.error('[verify OTP] failed', err)
      setError(err?.message || 'OTP verification failed')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleResendOTP = async () => {
    setIsSubmitting(true)
    setError('')

    try {
      await sendRegistrationOTP(registrationEmail)
      setError('') // Clear any previous errors
    } catch (err) {
      setError('Failed to resend OTP')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleBackToForm = () => {
    setStep('form')
    setOtp('')
    setError('')
    setRegistrationEmail('')
  }

  return (
    <div className="premium-shell min-h-screen overflow-x-hidden px-4 py-6 sm:px-6 sm:py-8">
      <div className="premium-card mx-auto w-full max-w-4xl overflow-hidden p-4 sm:p-6 md:p-8 animate-fade-up">

        {step === 'form' ? (
          <>
            <h2 className="text-center text-2xl leading-tight font-black text-brand-text sm:text-3xl">
              Create Your Account
            </h2>

            <p className="mt-2 text-center text-sm text-brand-subtext sm:text-base">
              Join FreelanceHub and start your journey
            </p>

        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 stagger-in">
          {roles.map((role) => (
            <div
              key={role.type}
              onClick={() => setSelectedRole(role.type)}
              className={`group cursor-pointer rounded-2xl border p-4 min-h-[140px] transition-all duration-300 sm:p-5 ${
                selectedRole === role.type
                  ? 'border-transparent bg-gradient-to-br from-brand-primary to-brand-secondary shadow-glow'
                  : 'border-brand-border bg-brand-surface/70 hover:-translate-y-1 hover:border-brand-primary/30 hover:bg-brand-surface hover:shadow-panel'
              }`}
            >
              <div className={`mb-4 h-10 w-10 rounded-2xl bg-gradient-to-br ${role.accent} shadow-glow transition duration-300 group-hover:rotate-3 group-hover:scale-110`} />
              <h3 className={`text-lg font-semibold ${selectedRole === role.type ? 'text-white' : 'text-brand-text'}`}>
                {role.title}
              </h3>
              <p className={`mt-2 text-sm ${selectedRole === role.type ? 'text-white/85' : 'text-brand-subtext'}`}>
                {role.desc}
              </p>
            </div>
          ))}
        </div>

        {selectedRole && (
          <form onSubmit={handleSubmit} className="mx-auto mt-8 w-full max-w-md space-y-4 px-1 animate-fade-up">

            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className="app-input"
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className="app-input"
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="app-input"
              required
            />

            {selectedRole === 'freelancer' ? (
              <div className="grid gap-3 animate-fade-up">
                <input
                  type="url"
                  name="linkedinUrl"
                  placeholder="LinkedIn URL (optional)"
                  value={formData.linkedinUrl}
                  onChange={handleChange}
                  className="app-input"
                />

                <input
                  type="url"
                  name="githubUrl"
                  placeholder="GitHub URL (optional)"
                  value={formData.githubUrl}
                  onChange={handleChange}
                  className="app-input"
                />

                <p className="rounded-2xl border border-brand-primary/20 bg-brand-primary/10 px-3 py-2 text-xs leading-5 text-brand-subtext">
                  These profile links are stored safely in the frontend profile layer and help clients understand your Trust Level.
                </p>
              </div>
            ) : null}

            {error && <p className="text-sm text-red-500">{error}</p>}

            <button
              type="submit"
              disabled={isSubmitting}
              className="premium-button w-full disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? 'Sending OTP...' : `Continue as ${selectedRole}`}
            </button>

          </form>
        )}
          </>
        ) : (
          <>
            <div className="text-center">
              <h2 className="text-2xl font-black text-brand-text sm:text-3xl">
                Verify Your Email
              </h2>

              <p className="mt-2 break-all text-sm text-brand-subtext sm:text-base">
                We've sent a 4-digit code to <strong>{registrationEmail}</strong>
              </p>
            </div>

            <div className="mx-auto mt-8 w-full max-w-md space-y-6 rounded-[28px] border border-brand-border bg-brand-surface/80 p-5 shadow-panel animate-fade-up sm:p-6">
              <OTPInput
                value={otp}
                onChange={setOtp}
                length={4}
                disabled={isSubmitting}
                error={error}
                label="Enter verification code"
                placeholder="0"
              />

              <div className="flex flex-col gap-3">
                <button
                  type="button"
                  onClick={handleVerifyOTP}
                  disabled={isSubmitting || otp.length !== 4}
                  className="premium-button w-full disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSubmitting ? 'Verifying...' : 'Verify & Complete Registration'}
                </button>

                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={isSubmitting}
                  className="premium-ghost-button w-full disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Resend Code
                </button>

                <button
                  type="button"
                  onClick={handleBackToForm}
                  disabled={isSubmitting}
                  className="text-sm font-semibold text-brand-primary transition hover:text-brand-secondary disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Back to Registration
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Register

