import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 border-b border-brand-border/70 bg-brand-surface/80 shadow-panel backdrop-blur-2xl">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">

        <Link to="/" className="group flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-3xl bg-gradient-to-br from-brand-primary to-brand-secondary text-lg font-bold text-white shadow-glow transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110">
            F
          </span>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.32em] text-brand-subtext">FreelanceHub</p>
            <p className="text-xs text-brand-subtext/80">Premium freelance marketplace</p>
          </div>
        </Link>

        <div className="flex items-center gap-3 sm:gap-5">
          <Link
            to="/login"
            className="text-sm font-semibold text-brand-text transition hover:text-brand-primary"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="premium-button-gold inline-flex items-center justify-center px-4 py-2.5"
          >
            Sign Up
          </Link>
        </div>

      </div>
    </header>
  )
}

export default Navbar

