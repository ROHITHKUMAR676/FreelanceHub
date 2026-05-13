const stats = [
  { label: 'Freelancers', value: '5,000+' },
  { label: 'Clients', value: '2,000+' },
  { label: 'Projects', value: '10,000+' },
]

const StatsSection = () => {
  return (
    <section className="relative -mt-8 py-14 md:-mt-10">
      <div className="max-w-5xl mx-auto px-4">
        <div className="premium-card-premium grid grid-cols-1 gap-6 rounded-3xl p-8 text-center sm:grid-cols-3">
          {stats.map((stat, i) => (
            <div key={i} className="rounded-2xl border border-brand-border/60 bg-brand-surface/50 p-4 transition duration-300 hover:-translate-y-1 hover:bg-brand-surface/80 hover:shadow-panel">
              <h3 className="premium-gradient-text text-4xl font-extrabold">
                {stat.value}
              </h3>
              <p className="mt-2 text-xs font-bold uppercase tracking-[0.18em] text-brand-subtext">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default StatsSection
