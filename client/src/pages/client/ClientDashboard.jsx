import { Link } from 'react-router-dom'
import { ArrowRight, BriefcaseBusiness, CreditCard, FilePlus2, MessageSquareText, ShieldCheck, UsersRound } from 'lucide-react'

const stats = [
  { label: 'Open projects', value: '2', icon: BriefcaseBusiness, tone: 'from-brand-primary to-brand-secondary' },
  { label: 'New proposals', value: '6', icon: UsersRound, tone: 'from-brand-emerald to-brand-turquoise' },
  { label: 'Escrow ready', value: '3', icon: CreditCard, tone: 'from-brand-gold to-orange-400' },
]

const workflows = [
  {
    title: 'Post a scoped project',
    text: 'Set requirements, budget, and deadline so freelancers can respond with precise plans.',
    icon: FilePlus2,
    to: '/client/post-job',
  },
  {
    title: 'Review trust signals',
    text: 'Compare proposal text, profile completeness, GitHub, LinkedIn, and verification cues.',
    icon: ShieldCheck,
    to: '/client/proposals',
  },
  {
    title: 'Keep momentum in chat',
    text: 'Use messages to clarify details before and after hiring.',
    icon: MessageSquareText,
    to: '/messages',
  },
]

const ClientDashboard = () => {
  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      <section className="premium-card-premium overflow-hidden p-0">
        <div className="relative p-6 sm:p-8">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/12 via-transparent to-brand-secondary/10" />
          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-brand-primary">Client command center</p>
              <h1 className="mt-3 max-w-3xl text-4xl font-black tracking-tight premium-text-gradient sm:text-5xl">
                Hire trusted freelancers with a cleaner workflow.
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-brand-subtext">
                Post projects, compare proposals, fund escrow, and manage delivery from one focused workspace.
              </p>
            </div>
            <Link to="/client/post-job" className="premium-button-gold shrink-0">
              Post Project
              <ArrowRight size={16} className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {stats.map((item) => {
          const Icon = item.icon
          return (
            <article key={item.label} className="premium-card p-5">
              <div className={`grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br ${item.tone} text-white shadow-glow`}>
                <Icon size={22} />
              </div>
              <p className="mt-5 text-3xl font-black text-brand-text">{item.value}</p>
              <p className="mt-1 text-sm font-semibold text-brand-subtext">{item.label}</p>
            </article>
          )
        })}
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {workflows.map((item) => {
          const Icon = item.icon
          return (
            <Link key={item.title} to={item.to} className="premium-card group p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-brand-primary/10 text-brand-primary">
                  <Icon size={20} />
                </div>
                <ArrowRight size={18} className="text-brand-subtext transition group-hover:translate-x-1 group-hover:text-brand-primary" />
              </div>
              <h2 className="mt-5 text-lg font-black text-brand-text">{item.title}</h2>
              <p className="mt-2 text-sm leading-6 text-brand-subtext">{item.text}</p>
            </Link>
          )
        })}
      </section>
    </div>
  )
}

export default ClientDashboard
