import { ShieldCheck, Users, MessageCircle } from 'lucide-react'

const features = [
  {
    title: 'Secure Payments',
    desc: 'Your payments are protected and safe.',
    icon: ShieldCheck,
  },
  {
    title: 'Top Talent',
    desc: 'Hire the best freelancers globally.',
    icon: Users,
  },
  {
    title: 'Real-time Chat',
    desc: 'Communicate instantly with built-in chat.',
    icon: MessageCircle,
  },
]

const FeaturesSection = () => {
  return (
    <section className="py-24">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-center text-4xl font-extrabold tracking-tight premium-text-gradient animate-fade-up">
          Why Choose FreelanceHub?
        </h2>

        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3 stagger-in">
          {features.map((f, i) => {
            const Icon = f.icon
            return (
              <div
                key={i}
                className="premium-card-premium group p-8 premium-card-hover animate-scale-in"
                style={{ animationDelay: `${i * 200}ms` }}
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-brand-border/50 bg-gradient-to-br from-brand-primary to-brand-secondary text-white shadow-glow transition-all duration-500 group-hover:scale-125 group-hover:rotate-12 animate-float">
                  <Icon size={28} />
                </div>

                <h3 className="mt-6 text-xl font-bold premium-text-gradient group-hover:scale-105 transition-transform duration-300">
                  {f.title}
                </h3>

                <p className="mt-3 text-base leading-7 text-brand-subtext">
                  {f.desc}
                </p>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}

export default FeaturesSection
