import { useContext, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

const Navbar = () => {
  const { user, logout } = useContext(AuthContext)
  const [dropdownOpen, setDropdownOpen] = useState(false)
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

  const getDashboardPath = () => {
    if (!user) return '/'
    return user.role === 'client' ? '/client/dashboard' : '/freelancer/dashboard'
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-brand-border/70 bg-brand-surface/80 shadow-sm backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="group flex items-center space-x-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-primary to-brand-secondary shadow-glow transition duration-300 group-hover:rotate-3">
              <span className="text-lg font-bold text-white">F</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-brand-text">FreelanceHub</span>
          </Link>

          {user ? (
            <div className="flex items-center space-x-4">
              <button className="relative rounded-xl p-2 text-brand-subtext transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-surface hover:text-brand-primary hover:shadow-panel">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
              </button>

              <Link to="/messages" className="rounded-xl p-2 text-brand-subtext transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-surface hover:text-brand-primary hover:shadow-panel">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </Link>

              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center space-x-2 rounded-xl border border-brand-border bg-brand-surface/70 px-2 py-1 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-panel focus:outline-none"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-brand-primary to-brand-secondary font-semibold text-white shadow-glow">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <svg className={`h-4 w-4 text-brand-subtext transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 z-50 mt-2 w-48 overflow-hidden rounded-2xl border border-brand-border/70 bg-brand-surface/90 py-1 shadow-lift backdrop-blur-xl animate-fade-up">
                    <Link to={getDashboardPath()} className="block px-4 py-2 text-sm text-brand-text transition hover:bg-brand-messageSent" onClick={() => setDropdownOpen(false)}>
                      Dashboard
                    </Link>
                    <Link to={`/${user.role}/profile`} className="block px-4 py-2 text-sm text-brand-text transition hover:bg-brand-messageSent" onClick={() => setDropdownOpen(false)}>
                      Profile
                    </Link>
                    <Link to="/settings" className="block px-4 py-2 text-sm text-brand-text transition hover:bg-brand-messageSent" onClick={() => setDropdownOpen(false)}>
                      Settings
                    </Link>
                    <button type="button" onClick={logout} className="block w-full px-4 py-2 text-left text-sm text-red-600 transition hover:bg-red-50">
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link to="/login" className="font-semibold text-brand-subtext transition hover:text-brand-primary">
                Login
              </Link>
              <Link to="/register" className="premium-button px-4 py-2">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar

