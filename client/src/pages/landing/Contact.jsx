import Navbar from '../../components/landing/Navbar'
import Footer from '../../components/landing/Footer'

function Contact() {
  return (
    <div className="premium-shell min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-20">
        <section className="premium-card-premium p-10 md:p-12 animate-scale-in premium-card-hover">
          <span className="inline-flex rounded-full bg-gradient-to-r from-brand-gold to-brand-emerald px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-black shadow-glow-gold">
            Contact
          </span>
          <h1 className="mt-6 text-5xl font-bold tracking-tight premium-text-gradient md:text-6xl">
            Need help with a project or account?
          </h1>
          <p className="mt-6 max-w-3xl text-xl leading-9 text-brand-subtext">
            Reach the FreelanceHub support team for marketplace questions, payment support, and account help.
          </p>
          <a href="mailto:support@freelancehub.com" className="premium-button-gold mt-8 inline-flex">
            Contact Support
          </a>
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default Contact
