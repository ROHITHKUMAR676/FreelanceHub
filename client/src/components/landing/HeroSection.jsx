import { Link } from 'react-router-dom'
import { ArrowRight, BriefcaseBusiness, CheckCircle2, CreditCard, ShieldCheck, Sparkles, Star, UsersRound } from 'lucide-react'

const projectCards = [
  { title: 'SaaS dashboard redesign', meta: 'INR 85,000', status: '12 proposals', tone: 'from-brand-primary to-brand-secondary' },
  { title: 'AI portfolio website', meta: 'INR 42,000', status: 'Escrow ready', tone: 'from-brand-gold to-orange-400' },
  { title: 'Mobile app prototype', meta: 'INR 1,20,000', status: 'High trust talent', tone: 'from-brand-emerald to-brand-turquoise' },
]

const trustSignals = [
  { label: 'Verified profiles', icon: ShieldCheck },
  { label: 'Escrow payments', icon: CreditCard },
  { label: 'Fast proposals', icon: UsersRound },
]

const HeroSection = () => {
  return (
    <section className="relative min-h-[calc(100vh-4rem)] overflow-hidden bg-brand-background text-brand-text">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_8%,rgba(0,184,148,0.2),transparent_28rem),radial-gradient(circle_at_87%_0%,rgba(0,122,255,0.24),transparent_32rem),radial-gradient(circle_at_72%_74%,rgba(255,159,67,0.16),transparent_24rem)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-brand-surface/60 to-transparent" />

      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 pb-16 pt-16 md:grid-cols-[1.02fr_0.98fr] md:items-center lg:pb-20 lg:pt-20">
        <div className="animate-fade-up">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-primary/20 bg-brand-surface/75 px-5 py-2 text-xs font-black uppercase tracking-[0.2em] text-brand-primary shadow-panel backdrop-blur-xl">
            <Sparkles size={14} />
            Premium freelance marketplace
          </span>

          <h1 className="mt-7 text-balance text-5xl font-black leading-[1.02] premium-text-gradient md:text-7xl">
            FreelanceHub
          </h1>

          <p className="mt-5 max-w-2xl text-balance text-2xl font-black leading-tight text-brand-text md:text-4xl">
            Hire trusted talent, review smarter proposals, and start projects with escrow confidence.
          </p>

          <p className="mt-6 max-w-xl text-base leading-8 text-brand-subtext md:text-lg">
            A polished workspace for clients and freelancers to move from project brief to delivery without losing clarity, trust, or momentum.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link to="/register" className="premium-button px-7 py-4 text-base">
              Get Started
              <ArrowRight size={18} className="ml-2" />
            </Link>
            <Link to="/login" className="premium-ghost-button px-7 py-4 text-base">
              Login
            </Link>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {trustSignals.map((item) => {
              const Icon = item.icon
              return (
                <div key={item.label} className="flex items-center gap-2 rounded-2xl border border-brand-border/70 bg-brand-surface/65 px-3 py-2 text-sm font-bold text-brand-text shadow-sm backdrop-blur-xl">
                  <Icon size={16} className="text-brand-primary" />
                  {item.label}
                </div>
              )
            })}
          </div>
        </div>

        <div className="relative animate-fade-up md:animate-delay-100">
          <div className="absolute -left-6 top-8 hidden rounded-3xl border border-brand-border/70 bg-brand-surface/80 p-4 shadow-lift backdrop-blur-xl lg:block">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-brand-emerald/10 text-brand-emerald">
                <ShieldCheck size={20} />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand-subtext">Trust Level</p>
                <p className="text-lg font-black text-brand-text">94 High</p>
              </div>
            </div>
          </div>

          <div className="absolute -right-3 bottom-16 hidden rounded-3xl border border-brand-border/70 bg-brand-surface/80 p-4 shadow-lift backdrop-blur-xl lg:block">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-brand-gold/15 text-brand-gold">
                <CreditCard size={20} />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand-subtext">Escrow</p>
                <p className="text-lg font-black text-brand-text">Protected</p>
              </div>
            </div>
          </div>

          <div className="premium-card-premium relative overflow-hidden p-5 sm:p-6">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/10 via-transparent to-brand-secondary/10" />
            <div className="relative">
              <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-brand-subtext">Live marketplace</p>
                  <h2 className="mt-1 text-xl font-black text-brand-text">Investor-ready workflow</h2>
                </div>
                <span className="rounded-full bg-brand-messageSent px-3 py-1 text-xs font-black text-brand-text">98% match rate</span>
              </div>

              <div className="space-y-4 stagger-in">
                {projectCards.map((project) => (
                  <article key={project.title} className="rounded-3xl border border-brand-border/70 bg-brand-surface/85 p-4 shadow-panel transition duration-300 hover:-translate-y-1 hover:border-brand-primary/35">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className={`grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br ${project.tone} text-white shadow-glow`}>
                          <BriefcaseBusiness size={19} />
                        </div>
                        <div>
                          <p className="text-base font-black text-brand-text">{project.title}</p>
                          <p className="mt-1 text-sm font-semibold text-brand-subtext">{project.meta}</p>
                        </div>
                      </div>
                      <Star size={17} className="shrink-0 fill-brand-gold text-brand-gold" />
                    </div>
                    <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl bg-brand-background/70 px-3 py-2">
                      <span className="inline-flex items-center gap-1.5 text-xs font-black text-brand-emerald">
                        <CheckCircle2 size={14} />
                        {project.status}
                      </span>
                      <span className="text-xs font-bold text-brand-subtext">View details</span>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
