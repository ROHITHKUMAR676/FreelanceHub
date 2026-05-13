const reviews = [
  {
    text: 'Amazing platform, got clients instantly!',
    name: 'Rahul',
  },
  {
    text: 'Very smooth hiring experience.',
    name: 'Priya',
  },
  {
    text: "Best freelancing platform I've used.",
    name: 'Arjun',
  },
]

const ReviewsSection = () => {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="text-center text-3xl font-extrabold tracking-tight premium-text-gradient">
          What Users Say
        </h2>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3 stagger-in">
          {reviews.map((r) => (
            <div key={r.name} className="premium-card p-6">
              <p className="text-sm leading-6 text-brand-subtext">"{r.text}"</p>
              <p className="mt-4 text-sm font-bold uppercase tracking-[0.14em] text-brand-text">- {r.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ReviewsSection
