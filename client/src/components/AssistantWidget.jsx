import { useEffect, useMemo, useRef, useState } from 'react'
import { Bot, CreditCard, FileText, MessageCircleQuestion, Send, ShieldCheck, Sparkles, UserCheck, X } from 'lucide-react'

const promptGroups = [
  {
    title: 'Client flow',
    items: ['How do I post projects?', 'How do I hire a freelancer?', 'How does proposal review work?'],
  },
  {
    title: 'Money',
    items: ['Explain the payment process', 'Where do I see transactions?'],
  },
  {
    title: 'Trust',
    items: ['What does trust score mean?', 'How do profiles help clients?'],
  },
  {
    title: 'Workspace',
    items: ['How do I use dashboard?', 'Where is chat?', 'How do notifications work?'],
  },
]

const answerFromQuestion = (question) => {
  const q = question.toLowerCase()

  if (q.includes('post') || q.includes('project') || q.includes('job')) {
    return 'Go to Client > Post Job, add a clear title, scope, budget, and deadline, then submit. The app keeps the same posting workflow and sends the job through the existing backend.'
  }

  if (q.includes('proposal') || q.includes('review')) {
    return 'Open Proposals from the client sidebar. You can compare the freelancer message, job context, status, and Trust Level before accepting or rejecting.'
  }

  if (q.includes('hire') || q.includes('freelancer')) {
    return 'Review proposals, check the Trust Level and profile signals, then choose Accept Proposal. The secure payment confirmation appears before the project starts.'
  }

  if (q.includes('payment') || q.includes('transaction') || q.includes('escrow') || q.includes('pay')) {
    return 'Payments are handled through the existing escrow flow. When you accept a proposal, confirm the escrow amount, then track the record from Transactions.'
  }

  if (q.includes('trust') || q.includes('score') || q.includes('verification')) {
    return 'Trust Level is a frontend confidence indicator based on LinkedIn, GitHub, profile basics, verification fields when available, and portfolio-quality proposal details.'
  }

  if (q.includes('profile')) {
    return 'Open Profile from the sidebar or account menu. Freelancers can add LinkedIn and GitHub links locally so proposal trust indicators have stronger signals.'
  }

  if (q.includes('dashboard')) {
    return 'The dashboard is your command center: clients can post jobs and review proposals; freelancers can browse jobs, track proposals, and manage active work.'
  }

  if (q.includes('message') || q.includes('chat')) {
    return 'Use Messages from the navbar or sidebar. Pick a conversation and continue project communication inside the platform.'
  }

  if (q.includes('notification')) {
    return 'Notifications surface project and workflow updates when the app has them available. Keep an eye on status chips across jobs, proposals, and transactions too.'
  }

  return 'I can guide you through posting projects, reviewing proposals, hiring freelancers, escrow payments, dashboard usage, profiles, trust levels, and messages.'
}

const AssistantWidget = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'assistant',
      text: 'Hi, I am your workspace assistant. Ask about projects, proposals, payments, trust, profiles, or messages.',
    },
  ])
  const scrollRef = useRef(null)

  const canSend = useMemo(() => input.trim().length > 0 && !isTyping, [input, isTyping])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, isTyping])

  const sendMessage = (text) => {
    const userText = text.trim()
    if (!userText || isTyping) return

    const userMsg = { id: `u-${Date.now()}`, role: 'user', text: userText }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setIsTyping(true)

    window.setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: 'assistant',
          text: answerFromQuestion(userText),
        },
      ])
      setIsTyping(false)
    }, 520)
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="fixed bottom-5 right-5 z-[70] inline-flex items-center gap-2 rounded-full border border-brand-border/80 bg-brand-surface/95 px-4 py-3 text-sm font-bold text-brand-text shadow-lift backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-primary/40 hover:shadow-glow"
        aria-label="Open assistant chat"
      >
        <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-brand-primary to-brand-secondary text-white">
          <Sparkles size={16} />
        </span>
        Assistant
      </button>

      {isOpen ? (
        <section className="fixed bottom-20 right-3 z-[80] flex h-[min(36rem,calc(100vh-7rem))] w-[calc(100vw-1.5rem)] max-w-[26rem] flex-col overflow-hidden rounded-[28px] border border-brand-border/80 bg-brand-surface/95 shadow-lift backdrop-blur-2xl sm:right-5">
          <header className="relative overflow-hidden border-b border-brand-border/70 px-4 py-4">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/12 via-transparent to-brand-secondary/12" />
            <div className="relative flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-primary to-brand-secondary text-white shadow-glow">
                  <Bot size={18} />
                </span>
                <div>
                  <p className="text-sm font-black text-brand-text">Smart Assistant</p>
                  <p className="text-xs text-brand-subtext">Platform guidance, no backend needed</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-brand-border bg-brand-surface/75 text-brand-subtext transition hover:text-brand-text"
                aria-label="Close assistant chat"
              >
                <X size={16} />
              </button>
            </div>
          </header>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {messages.map((message) => (
              <div key={message.id} className={`animate-soft-pop max-w-[88%] rounded-2xl px-3 py-2.5 text-sm leading-6 shadow-sm ${message.role === 'assistant' ? 'bg-brand-messageReceived text-brand-text' : 'ml-auto bg-gradient-to-r from-brand-primary to-brand-secondary text-white'}`}>
                {message.text}
              </div>
            ))}
            {isTyping ? (
              <div className="inline-flex items-center gap-1 rounded-2xl bg-brand-messageReceived px-3 py-2 text-brand-subtext">
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-brand-primary" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-brand-primary [animation-delay:120ms]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-brand-primary [animation-delay:240ms]" />
              </div>
            ) : null}
          </div>

          <div className="border-t border-brand-border/70 px-3 py-3">
            <div className="mb-3 grid grid-cols-2 gap-2">
              {promptGroups.flatMap((group) => group.items.slice(0, 1)).map((item, index) => {
                const icons = [FileText, CreditCard, ShieldCheck, UserCheck]
                const Icon = icons[index] || MessageCircleQuestion
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => sendMessage(item)}
                    className="flex items-center gap-2 rounded-2xl border border-brand-border bg-brand-background/65 px-3 py-2 text-left text-xs font-semibold text-brand-subtext transition hover:-translate-y-0.5 hover:border-brand-primary/40 hover:text-brand-text"
                  >
                    <Icon size={14} className="shrink-0 text-brand-primary" />
                    <span className="line-clamp-2">{item}</span>
                  </button>
                )
              })}
            </div>

            <form
              onSubmit={(event) => {
                event.preventDefault()
                sendMessage(input)
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Ask for guidance..."
                className="app-input py-2.5 text-sm"
              />
              <button
                type="submit"
                disabled={!canSend}
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-brand-primary to-brand-secondary text-white shadow-glow disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Send question"
              >
                <Send size={16} />
              </button>
            </form>
          </div>
        </section>
      ) : null}
    </>
  )
}

export default AssistantWidget
