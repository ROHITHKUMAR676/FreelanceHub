import { useEffect, useState } from 'react'
import { BriefcaseBusiness, CheckCircle2, CreditCard, ShieldCheck, Sparkles, UsersRound } from 'lucide-react'

const introSteps = ['Talent', 'Trust', 'Escrow']

const AppIntro = () => {
  const [visible, setVisible] = useState(() => sessionStorage.getItem('freelancehub:intro-seen') !== 'true')
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    if (!visible) return undefined
    const leaveTimer = window.setTimeout(() => setLeaving(true), 1950)
    const hideTimer = window.setTimeout(() => {
      sessionStorage.setItem('freelancehub:intro-seen', 'true')
      setVisible(false)
    }, 2350)

    return () => {
      window.clearTimeout(leaveTimer)
      window.clearTimeout(hideTimer)
    }
  }, [visible])

  if (!visible) return null

  return (
    <div className={`intro-overlay ${leaving ? 'intro-overlay--leaving' : ''}`} aria-hidden="true">
      <div className="intro-grid" />
      <div className="intro-aurora intro-aurora-a" />
      <div className="intro-aurora intro-aurora-b" />

      <div className="intro-stage">
        <div className="intro-logo-system">
          <div className="intro-orbit intro-orbit-one">
            <span><BriefcaseBusiness size={17} /></span>
            <span><UsersRound size={17} /></span>
          </div>
          <div className="intro-orbit intro-orbit-two">
            <span><ShieldCheck size={16} /></span>
            <span><CreditCard size={16} /></span>
          </div>
          <div className="intro-mark">
            <Sparkles size={24} />
            <strong>F</strong>
          </div>
        </div>

        <div className="intro-copy">
          <p className="intro-eyebrow">FreelanceHub</p>
          <h1>Premium work, trusted from proposal to payout.</h1>
          <div className="intro-step-row">
            {introSteps.map((step) => (
              <span key={step}>
                <CheckCircle2 size={14} />
                {step}
              </span>
            ))}
          </div>
        </div>

        <div className="intro-preview">
          <div className="intro-preview-top">
            <span />
            <span />
            <span />
          </div>
          <div className="intro-preview-body">
            <div>
              <p>Live proposal</p>
              <strong>React SaaS dashboard</strong>
            </div>
            <span className="intro-trust-pill">94 Trust</span>
          </div>
          <div className="intro-preview-bars">
            <span />
            <span />
            <span />
          </div>
        </div>
      </div>

      <div className="intro-loader">
        <span />
      </div>
    </div>
  )
}

export default AppIntro
