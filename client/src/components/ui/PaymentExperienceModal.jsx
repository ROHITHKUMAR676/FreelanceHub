import { useEffect, useMemo, useState } from 'react'
import { Check, CreditCard, IndianRupee, Landmark, LockKeyhole, Shield, Smartphone } from 'lucide-react'

const methods = [
  { id: 'upi', label: 'UPI', detail: 'rohith@upi', icon: Smartphone },
  { id: 'card', label: 'Card', detail: 'Visa ending 4242', icon: CreditCard },
  { id: 'bank', label: 'Bank', detail: 'Instant escrow transfer', icon: Landmark },
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
  children,
  confirmLabel = 'Pay & Start Project',
}) => {
  const [visualStep, setVisualStep] = useState('method')
  const [method, setMethod] = useState('upi')
  const [pin, setPin] = useState('')
  const [pinTouched, setPinTouched] = useState(false)

  useEffect(() => {
    if (!open) {
      setVisualStep('method')
      setMethod('upi')
      setPin('')
      setPinTouched(false)
      return
    }
    if (isProcessing) setVisualStep('processing')
    if (isSuccess) setVisualStep('success')
  }, [open, isProcessing, isSuccess])

  const selectedMethod = useMemo(() => methods.find((item) => item.id === method) || methods[0], [method])
  const canConfirm = pin.length === 4 && !isProcessing && !isSuccess

  const handlePinChange = (event) => {
    setPin(event.target.value.replace(/\D/g, '').slice(0, 4))
    setPinTouched(true)
  }

  const handleConfirm = () => {
    setPinTouched(true)
    if (!canConfirm) return
    onConfirm()
  }

  if (!open) return null

  const MethodIcon = selectedMethod.icon

  return (
    <div className="fixed inset-0 z-[75] grid place-items-center bg-brand-ink/60 px-4 py-6 backdrop-blur-md">
      <section className="payment-modal w-full max-w-2xl overflow-hidden rounded-[30px] border border-brand-border/70 bg-brand-surface/95 shadow-lift backdrop-blur-2xl">
        <div className="relative overflow-hidden border-b border-brand-border/70 p-6">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/12 via-transparent to-brand-secondary/12" />
          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="payment-orbit">
                {visualStep === 'success' ? <Check size={24} /> : visualStep === 'processing' ? <LockKeyhole size={24} /> : <MethodIcon size={24} />}
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-brand-primary">Secure payment gateway</p>
                <h2 className="mt-1 text-2xl font-black text-brand-text">{title}</h2>
                <p className="mt-2 max-w-lg text-sm leading-6 text-brand-subtext">
                  Choose a payment method, enter your secure PIN, and the amount will be marked as escrowed through the existing project workflow.
                </p>
              </div>
            </div>

            <div className="rounded-3xl border border-brand-border/70 bg-brand-background/70 p-4 text-right">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-brand-subtext">Escrow amount</p>
              <p className="mt-1 flex items-center justify-end text-2xl font-black text-brand-text">
                <IndianRupee size={20} />
                {Number(amount || 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-5 p-6 lg:grid-cols-[1fr_18rem]">
          <div className="space-y-5">
            <div className="grid grid-cols-3 gap-2">
              {['Method', 'PIN', 'Escrowed'].map((item, index) => (
                <div
                  key={item}
                  className={`rounded-2xl border px-3 py-2 text-center text-xs font-black ${
                    (visualStep === 'method' && index === 0) ||
                    (visualStep === 'processing' && index <= 1) ||
                    visualStep === 'success'
                      ? 'border-brand-primary/30 bg-brand-primary/10 text-brand-primary'
                      : 'border-brand-border bg-brand-background/60 text-brand-subtext'
                  }`}
                >
                  {item}
                </div>
              ))}
            </div>

            {children}

            <div>
              <p className="mb-2 text-sm font-black text-brand-text">Payment method</p>
              <div className="grid gap-2 sm:grid-cols-3">
                {methods.map((item) => {
                  const Icon = item.icon
                  const active = item.id === method
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setMethod(item.id)}
                      disabled={isProcessing || isSuccess}
                      className={`rounded-2xl border p-3 text-left transition ${
                        active
                          ? 'border-brand-primary/40 bg-brand-primary/10 text-brand-text shadow-panel'
                          : 'border-brand-border bg-brand-background/60 text-brand-subtext hover:border-brand-primary/30 hover:text-brand-text'
                      }`}
                    >
                      <Icon size={18} className={active ? 'text-brand-primary' : 'text-brand-subtext'} />
                      <p className="mt-2 text-sm font-black">{item.label}</p>
                      <p className="mt-1 truncate text-xs">{item.detail}</p>
                    </button>
                  )
                })}
              </div>
            </div>

            <div>
              <label htmlFor="payment-pin" className="mb-2 flex items-center gap-2 text-sm font-black text-brand-text">
                <LockKeyhole size={16} className="text-brand-primary" />
                Enter secure {method === 'upi' ? 'UPI' : 'payment'} PIN
              </label>
              <input
                id="payment-pin"
                type="password"
                inputMode="numeric"
                value={pin}
                onChange={handlePinChange}
                disabled={isProcessing || isSuccess}
                placeholder="4 digit PIN"
                className="app-input text-center text-2xl font-black tracking-[0.55em]"
              />
              {pinTouched && pin.length !== 4 ? (
                <p className="mt-2 text-xs font-semibold text-rose-500">Enter a 4 digit PIN to continue.</p>
              ) : null}
            </div>

            {error ? <p className="rounded-2xl border border-rose-400/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-500">{error}</p> : null}
          </div>

          <aside className="rounded-[26px] border border-brand-border/70 bg-brand-background/70 p-5">
            <div className="rounded-3xl bg-gradient-to-br from-brand-ink to-brand-primary p-5 text-white shadow-lift">
              <div className="flex items-center justify-between">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-white/70">{selectedMethod.label}</p>
                <Shield size={18} />
              </div>
              <p className="mt-8 text-sm text-white/75">{selectedMethod.detail}</p>
              <p className="mt-2 text-2xl font-black">INR {Number(amount || 0).toLocaleString()}</p>
            </div>

            {visualStep === 'processing' ? (
              <div className="mt-4 rounded-2xl border border-brand-primary/20 bg-brand-primary/10 p-4 text-sm font-bold text-brand-primary">
                Verifying PIN and moving funds to escrow...
              </div>
            ) : null}

            {visualStep === 'success' ? (
              <div className="mt-4 rounded-2xl border border-brand-emerald/30 bg-brand-emerald/10 p-4 text-sm font-bold text-brand-emerald">
                Amount has been escrowed. Project workspace is starting.
              </div>
            ) : (
              <div className="mt-4 rounded-2xl border border-brand-border bg-brand-surface/70 p-4 text-xs leading-5 text-brand-subtext">
                FreelanceHub Secure confirms your intent before moving this project amount into escrow.
              </div>
            )}
          </aside>
        </div>

        <div className="flex flex-col-reverse gap-2 border-t border-brand-border/70 px-6 py-4 sm:flex-row sm:justify-end">
          <button type="button" onClick={onCancel} disabled={isProcessing} className="premium-ghost-button px-4 py-2.5">
            Cancel
          </button>
          <button type="button" onClick={handleConfirm} disabled={!canConfirm} className="premium-button px-5 py-2.5 disabled:cursor-not-allowed disabled:opacity-50">
            {isProcessing ? 'Processing...' : isSuccess ? 'Escrowed' : confirmLabel}
          </button>
        </div>
      </section>
    </div>
  )
}

export default PaymentExperienceModal
