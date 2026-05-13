import { useContext, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import { useSidebar } from '../../context/SidebarContext'

const Navbar = () => {
  const { user, logout } = useContext(AuthContext)
  const { toggleSidebar } = useSidebar()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    logout()
    setMobileMenuOpen(false)
  }

  const getDashboardPath = () => {
    if (!user) return '/'
    return user.role === 'client' ? '/client/dashboard' : '/freelancer/dashboard'
  }

  const closeMobileMenu = () => {
    setMobileMenuOpen(false)
    setDropdownOpen(false)
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-brand-border/80 bg-brand-surface/80 text-brand-text shadow-panel backdrop-blur-2xl premium-bg-gradient">
      <div className="mx-auto w-full max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 min-w-0 items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            {user && (
              <button
                type="button"
                onClick={toggleSidebar}
                className="hidden h-10 w-10 items-center justify-center rounded-xl border border-brand-border bg-brand-surface/70 text-brand-text shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-primary/40 hover:shadow-panel hover:shadow-glow md:inline-flex"
                aria-label="Toggle sidebar"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.8"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            )}

            <Link to="/" className="group flex min-w-0 items-center gap-2">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-gold to-brand-emerald shadow-glow-gold transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110 animate-float">
                <span className="text-lg font-bold text-white">F</span>
              </div>
              <span className="truncate text-base font-bold tracking-tight premium-text-gradient sm:text-lg">FreelanceHub</span>
            </Link>
          </div>

          <div className="hidden items-center gap-3 md:flex">
            {user ? (
              <>
                <Link
                  to="/messages"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-brand-border bg-brand-surface/70 text-brand-text shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-primary/40 hover:bg-brand-surface hover:shadow-panel"
                  aria-label="Messages"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.8"
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </Link>

                <div className="relative" ref={dropdownRef}>
                  <button
                    type="button"
                    onClick={() => setDropdownOpen((prev) => !prev)}
                    className="flex items-center gap-2 rounded-xl border border-brand-border bg-brand-surface/70 px-2 py-1 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-primary/40 hover:bg-brand-surface hover:shadow-panel"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-brand-primary to-brand-secondary text-sm font-semibold text-white shadow-glow">
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <svg
                      className={`h-4 w-4 text-brand-subtext transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.8"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-52 overflow-hidden rounded-2xl border border-brand-border/80 bg-brand-surface/95 py-1 shadow-lift backdrop-blur-xl animate-fade-up">
                      <Link
                        to={getDashboardPath()}
                        onClick={() => setDropdownOpen(false)}
                        className="block px-4 py-2 text-sm text-brand-text transition hover:bg-brand-messageSent"
                      >
                        Dashboard
                      </Link>
                      <Link
                        to={`/${user.role}/profile`}
                        onClick={() => setDropdownOpen(false)}
                        className="block px-4 py-2 text-sm text-brand-text transition hover:bg-brand-messageSent"
                      >
                        Profile
                      </Link>
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="block w-full px-4 py-2 text-left text-sm text-brand-text transition hover:bg-red-50 hover:text-red-600"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="premium-ghost-button px-4 py-2">
                  Login
                </Link>
                <Link to="/register" className="premium-button px-4 py-2">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-brand-border bg-brand-surface/70 text-brand-text shadow-sm transition hover:bg-brand-surface md:hidden"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        <div className={`${mobileMenuOpen ? 'block' : 'hidden'} border-t border-brand-border py-3 md:hidden`}>
          <div className="flex flex-col gap-2">
            {user ? (
              <>
                <button
                  type="button"
                  onClick={() => {
                    toggleSidebar()
                    closeMobileMenu()
                  }}
                  className="w-full rounded-lg border border-brand-border px-3 py-2 text-left text-sm text-brand-text"
                >
                  Toggle Sidebar
                </button>
                <Link
                  to="/messages"
                  onClick={closeMobileMenu}
                  className="w-full rounded-lg border border-brand-border px-3 py-2 text-sm text-brand-text"
                >
                  Messages
                </Link>
                <Link
                  to={getDashboardPath()}
                  onClick={closeMobileMenu}
                  className="w-full rounded-lg border border-brand-border px-3 py-2 text-sm text-brand-text"
                >
                  Dashboard
                </Link>
                <Link
                  to={`/${user.role}/profile`}
                  onClick={closeMobileMenu}
                  className="w-full rounded-lg border border-brand-border px-3 py-2 text-sm text-brand-text"
                >
                  Profile
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full rounded-lg border border-brand-border px-3 py-2 text-left text-sm text-brand-text hover:bg-slate-100"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={closeMobileMenu}
                  className="w-full rounded-lg border border-brand-border px-3 py-2 text-sm text-brand-text"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={closeMobileMenu}
                  className="premium-button w-full px-3 py-2"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
