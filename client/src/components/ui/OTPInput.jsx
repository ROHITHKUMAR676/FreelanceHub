import { useState, useRef, useEffect } from 'react'
import { LockKeyhole } from 'lucide-react'

const OTPInput = ({
  value,
  onChange,
  length = 4,
  disabled = false,
  error = '',
  label = 'Enter OTP',
  placeholder = 'Enter code'
}) => {
  const [otp, setOtp] = useState(value || '')
  const inputRefs = useRef([])

  useEffect(() => {
    if (value !== otp) {
      setOtp(value || '')
    }
  }, [value])

  const handleChange = (e, index) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 1)
    const newOtp = otp.split('')
    newOtp[index] = val
    const updatedOtp = newOtp.join('')
    setOtp(updatedOtp)
    onChange(updatedOtp)

    // Auto-focus next input
    if (val && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const paste = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length)
    setOtp(paste)
    onChange(paste)

    // Focus the next empty input or the last input
    const nextIndex = paste.length < length ? paste.length : length - 1
    inputRefs.current[nextIndex]?.focus()
  }

  return (
    <div>
      <label className="mb-2 flex items-center gap-2 text-sm font-black text-brand-text">
        <LockKeyhole size={16} className="text-brand-primary" />
        {label}
      </label>

      <div className="flex justify-center gap-2">
        {Array.from({ length }, (_, index) => (
          <input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            inputMode="numeric"
            value={otp[index] || ''}
            onChange={(e) => handleChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onPaste={handlePaste}
            disabled={disabled}
            placeholder={placeholder}
            className="app-input w-12 min-w-[3rem] text-center text-2xl font-black tracking-[0.55em]"
            maxLength={1}
          />
        ))}
      </div>

      {error && (
        <p className="mt-2 text-xs font-semibold text-rose-500">{error}</p>
      )}
    </div>
  )
}

export default OTPInput