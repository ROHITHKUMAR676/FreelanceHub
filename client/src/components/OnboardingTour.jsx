import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { BriefcaseBusiness, CheckCircle2, CreditCard, MessageSquareText, Search, Send, Sparkles, Star, UserRoundCheck } from 'lucide-react'

const iconMap = {
  welcome: Sparkles,
  post: BriefcaseBusiness,
  proposals: UserRoundCheck,
  pay: CreditCard,
  messages: MessageSquareText,
  browse: Search,
  proposal: Send,
  profile: Star,
  earnings: CheckCircle2,
}

const clientSteps = [
  {
    id: 'welcome',
    title: 'Welcome to FreelanceHub',
    text: "Your client workspace is ready. This quick tour shows how to post work, compare proposals, fund escrow, and keep the project moving.",
    accent: 'from-brand-primary to-brand-secondary',
    tag: 'Welcome',
  },
  {
    id: 'post',
    title: 'Post a polished project',
    text: 'Use Post Job to define scope, budget, and deadline. Clear briefs attract stronger freelancers and better proposal details.',
    accent: 'from-brand-gold to-orange-400',
    tag: 'Step 1',
  },
  {
    id: 'proposals',
    title: 'Compare proposals with trust signals',
    text: 'Proposal cards include a Trust Level, profile signal chips, and status actions so you can evaluate fit quickly.',
    accent: 'from-brand-emerald to-brand-turquoise',
    tag: 'Step 2',
  },
  {
    id: 'pay',
    title: 'Start safely with escrow',
    text: 'When you accept a proposal, the existing payment flow is wrapped in a secure confirmation experience before the project starts.',
    accent: 'from-brand-amethyst to-brand-rose',
    tag: 'Step 3',
  },
  {
    id: 'messages',
    title: 'Collaborate in messages',
    text: 'Use Messages to keep project decisions, feedback, and delivery conversations close to the work.',
    accent: 'from-brand-sapphire to-brand-primary',
    tag: 'Step 4',
  },
]

const freelancerSteps = [
  {
    id: 'welcome',
    title: 'Welcome to FreelanceHub',
    text: "Your freelancer workspace is ready. This quick tour shows where to find jobs, submit proposals, build trust, and track earnings.",
    accent: 'from-brand-emerald to-brand-turquoise',
    tag: 'Welcome',
  },
  {
    id: 'browse',
    title: 'Browse open projects',
    text: 'Use Browse Jobs to find client projects that match your skillset, timeline, and budget expectations.',
    accent: 'from-brand-primary to-brand-secondary',
    tag: 'Step 1',
  },
  {
    id: 'proposal',
    title: 'Send a convincing proposal',
    text: 'A specific plan, realistic delivery note, and relevant experience help your proposal stand out.',
    accent: 'from-brand-gold to-orange-400',
    tag: 'Step 2',
  },
  {
    id: 'profile',
    title: 'Strengthen your Trust Level',
    text: 'Add LinkedIn and GitHub URLs in your profile. Clients see these profile signals when reviewing proposals.',
    accent: 'from-brand-amethyst to-brand-rose',
    tag: 'Step 3',
  },
  {
    id: 'earnings',
    title: 'Track delivery and earnings',
    text: 'Accepted projects and payment records stay visible from your workspace so you can follow progress clearly.',
    accent: 'from-brand-sapphire to-brand-emerald',
    tag: 'Step 4',
  },
]

const OnboardingTour = () => {
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false)
  const [step, setStep] = useState(0)
  const [role, setRole] = useState('client')
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    const shouldShow = localStorage.getItem('freelancehub:show-onboarding')
    if (shouldShow === 'true') {
      const detectedRole = location.pathname.includes('freelancer') ? 'freelancer' : 'client'
      setRole(detectedRole)
      setStep(0)
      const timer = window.setTimeout(() => setIsOpen(true), 550)
      return () => window.clearTimeout(timer)
    }
    return undefined
  }, [location.pathname])

  if (!isOpen) return null

  const steps = role === 'freelancer' ? freelancerSteps : clientSteps
  const currentStep = steps[step]
  const Icon = iconMap[currentStep.id] || Sparkles
  const isLastStep = step === steps.length - 1
  const progress = ((step + 1) / steps.length) * 100

  const closeTour = () => {
    setLeaving(true)
    window.setTimeout(() => {
      localStorage.setItem('freelancehub:onboarding-complete', 'true')
      localStorage.removeItem('freelancehub:show-onboarding')
      setIsOpen(false)
      setLeaving(false)
    }, 260)
  }

  const goNext = () => {
    if (isLastStep) closeTour()
    else setStep((current) => current + 1)
  }

  return (
    <>
      <div className={`tour-backdrop transition-opacity duration-300 ${leaving ? 'opacity-0' : 'opacity-100'}`} onClick={closeTour} aria-hidden="true" />
      <section className={`onboarding-panel ${leaving ? 'onboarding-panel--leaving' : 'animate-soft-pop'}`} aria-label="Onboarding tour" role="dialog" aria-modal="true">
        <div className="onboarding-progress-track">
          <div className="onboarding-progress-fill" style={{ width: `${progress}%` }} />
        </div>

        <button type="button" onClick={closeTour} className="onboarding-close" aria-label="Skip tour">
          <span aria-hidden="true">x</span>
        </button>

        <div className="onboarding-tag-row">
          <span className={`onboarding-tag bg-gradient-to-r ${currentStep.accent}`}>{currentStep.tag}</span>
          <span className="onboarding-step-counter">{step + 1} of {steps.length}</span>
        </div>

        <div className="onboarding-body">
          <div className={`onboarding-icon-wrap bg-gradient-to-br ${currentStep.accent}`}>
            <Icon size={30} className="text-white" />
          </div>
          <div className="onboarding-text-block">
            <h2 className="onboarding-title">{currentStep.title}</h2>
            <p className="onboarding-desc">{currentStep.text}</p>
          </div>
        </div>

        <div className="onboarding-dots" aria-label="Tour progress">
          {steps.map((item, index) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setStep(index)}
              className={`onboarding-dot ${index === step ? 'onboarding-dot--active' : index < step ? 'onboarding-dot--done' : ''}`}
              aria-label={`Go to step ${index + 1}`}
            />
          ))}
        </div>

        <div className="onboarding-nav">
          <button type="button" onClick={closeTour} className="onboarding-skip-btn">Skip tour</button>
          <div className="flex items-center gap-2">
            {step > 0 ? (
              <button type="button" onClick={() => setStep((current) => current - 1)} className="premium-ghost-button px-4 py-2.5 text-sm">
                Back
              </button>
            ) : null}
            <button type="button" onClick={goNext} className="premium-button px-6 py-2.5 text-sm">
              {isLastStep ? 'Start workspace' : 'Next'}
            </button>
          </div>
        </div>
      </section>
    </>
  )
}

export default OnboardingTour
