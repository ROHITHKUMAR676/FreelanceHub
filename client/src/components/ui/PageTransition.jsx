import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

const PageTransition = ({ children }) => {
  const location = useLocation()
  const [phase, setPhase] = useState('entered')

  useEffect(() => {
    setPhase('entering')
    const timer = window.setTimeout(() => setPhase('entered'), 40)
    return () => window.clearTimeout(timer)
  }, [location.pathname])

  return (
    <div className={`route-transition route-transition--${phase}`}>
      {children}
    </div>
  )
}

export default PageTransition
