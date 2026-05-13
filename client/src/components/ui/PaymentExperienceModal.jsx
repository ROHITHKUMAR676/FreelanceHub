
import { useEffect, useMemo, useState } from 'react'
import {
  Check,
  CreditCard,
  IndianRupee,
  Landmark,
  LockKeyhole,
  Shield,
  Smartphone,
} from 'lucide-react'

import OTPInput from './OTPInput'

const methods = [
  {
    id: 'upi',
    label: 'UPI',
    detail: 'rohith@upi',
    icon: Smartphone,
  },
  {
    id: 'card',
    label: 'Card',
    detail: 'Visa ending 4242',
    icon: CreditCard,
  },
  {
    id: 'bank',
    label: 'Bank',
    detail: 'Instant escrow transfer',
    icon: Landmark,
  },
]

const PaymentExperienceModal = ({
  open,
  title = 'Secure escrow payment',
  amount,
  isProcessing = false,
  isSuccess = false,
  error = '',
  onConfirm,
  onCancel,
  confirmLabel = 'Pay & Start Project',
}) => {
  const [method, setMethod] = useState('upi')
  const [otp, setOtp] = useState('')
  const [otpTouched, setOtpTouched] = useState(false)

  useEffect(() => {
    if (!open) {
      setMethod('upi')
      setOtp('')
      setOtpTouched(false)
    }
  }, [open])

  const selectedMethod = useMemo(
    () => methods.find((item) => item.id === method) || methods[0],
    [method]
  )

  const canConfirm = otp.length === 4 && !isProcessing && !isSuccess

  const handleOtpChange = (value) => {
    setOtp(value)
    setOtpTouched(true)
  }

  const handleConfirm = () => {
    setOtpTouched(true)

    if (!canConfirm) return

    onConfirm(otp)
  }

  if (!open) return null

  const MethodIcon = selectedMethod.icon

  return (
    <div
      className="
        fixed
        inset-0
        z-[75]
        overflow-y-auto
        bg-brand-ink/70
        backdrop-blur-md
        px-3
        py-4
        sm:px-4
        sm:py-6
      "
    >
      <div className="min-h-full grid place-items-center">
        <section
          className="
            w-full
            max-w-xl
            overflow-hidden
            rounded-[26px]
            border
            border-brand-border/70
            bg-brand-surface/95
            shadow-lift
            backdrop-blur-2xl
          "
        >
          <div className="relative overflow-hidden p-5 sm:p-6">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/10 via-transparent to-brand-secondary/10" />

            <div className="relative flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="payment-orbit shrink-0">
                  {isSuccess ? (
                    <Check size={22} />
                  ) : isProcessing ? (
                    <LockKeyhole size={22} />
                  ) : (
                    <MethodIcon size={22} />
                  )}
                </div>

                <div>
                  <p className="text-[10px] sm:text-xs font-black uppercase tracking-[0.18em] text-brand-primary">
                    Secure Payment
                  </p>

                  <h2 className="mt-1 text-xl sm:text-2xl font-black text-brand-text leading-tight">
                    {title}
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-brand-subtext">
                    Your payment will be securely moved into escrow after OTP verification.
                  </p>
                </div>
              </div>

              <div className="hidden sm:flex flex-col items-end rounded-2xl border border-brand-border/70 bg-brand-background/70 px-4 py-3">
                <p className="text-[10px] uppercase tracking-[0.16em] text-brand-subtext font-black">
                  Amount
                </p>

                <p className="mt-1 flex items-center text-2xl font-black text-brand-text">
                  <IndianRupee size={18} />
                  {Number(amount || 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="px-5 pb-5 sm:px-6 sm:pb-6">
            <div className="rounded-2xl border border-brand-border/70 bg-brand-background/60 p-4 sm:hidden mb-5">
              <p className="text-[10px] uppercase tracking-[0.16em] text-brand-subtext font-black">
                Amount
              </p>

              <p className="mt-1 flex items-center text-xl font-black text-brand-text">
                <IndianRupee size={18} />
                {Number(amount || 0).toLocaleString()}
              </p>
            </div>

            <div>
              <p className="mb-3 text-sm font-black text-brand-text">
                Choose payment method
              </p>

              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                {methods.map((item) => {
                  const Icon = item.icon
                  const active = item.id === method

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setMethod(item.id)}
                      disabled={isProcessing || isSuccess}
                      className={`rounded-2xl border p-4 text-left transition-all duration-300 ${
                        active
                          ? 'border-brand-primary/40 bg-brand-primary/10 text-brand-text shadow-panel'
                          : 'border-brand-border bg-brand-background/60 text-brand-subtext hover:border-brand-primary/30 hover:text-brand-text'
                      }`}
                    >
                      <Icon
                        size={18}
                        className={active ? 'text-brand-primary' : 'text-brand-subtext'}
                      />

                      <p className="mt-3 text-sm font-black">
                        {item.label}
                      </p>

                      <p className="mt-1 text-xs truncate">
                        {item.detail}
                      </p>
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="mt-5">
              <OTPInput
                value={otp}
                onChange={handleOtpChange}
                length={4}
                disabled={isProcessing || isSuccess}
                error={
                  otpTouched && otp.length !== 4
                    ? 'Enter the complete 4-digit OTP.'
                    : ''
                }
                label={`Enter secure ${
                  method === 'upi' ? 'UPI' : 'payment'
                } verification code`}
                placeholder="0"
              />
            </div>

            {error ? (
              <div className="mt-4 rounded-2xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-500">
                {error}
              </div>
            ) : null}

            {isProcessing ? (
              <div className="mt-4 rounded-2xl border border-brand-primary/20 bg-brand-primary/10 px-4 py-3 text-sm font-bold text-brand-primary">
                Verifying OTP and securing escrow payment...
              </div>
            ) : null}

            {isSuccess ? (
              <div className="mt-4 rounded-2xl border border-brand-emerald/30 bg-brand-emerald/10 px-4 py-3 text-sm font-bold text-brand-emerald">
                Payment secured successfully. Project workspace is starting.
              </div>
            ) : null}

            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={onCancel}
                disabled={isProcessing}
                className="premium-ghost-button w-full sm:w-auto px-4 py-3"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirm}
                disabled={!canConfirm}
                className="premium-button w-full sm:w-auto px-5 py-3 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isProcessing
                  ? 'Processing...'
                  : isSuccess
                  ? 'Escrowed'
                  : confirmLabel}
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default PaymentExperienceModal



