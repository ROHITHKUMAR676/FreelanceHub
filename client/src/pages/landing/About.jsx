import Navbar from '../../components/landing/Navbar'
import Footer from '../../components/landing/Footer'

function About() {
  return (
    <div className="premium-shell min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-20">
        <section className="premium-card-premium p-10 md:p-12 animate-scale-in premium-card-hover">
          <span className="inline-flex rounded-full bg-gradient-to-r from-brand-gold to-brand-emerald px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-black shadow-glow-gold">
            About
          </span>
          <h1 className="mt-6 text-5xl font-bold tracking-tight premium-text-gradient md:text-6xl">
            A sharper way to connect clients and freelancers.
          </h1>
          <p className="mt-6 max-w-3xl text-xl leading-9 text-brand-subtext">
            FreelanceHub brings project posting, proposals, messaging, and payments into one polished workspace so teams can move from idea to delivery with less friction.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default About
