const variantClasses = {
  primary: 'bg-gradient-to-r from-brand-primary to-brand-secondary text-white shadow-glow animate-pulse-glow',
  subtle: 'border border-brand-border bg-gradient-to-r from-brand-lavender/50 to-white/75 text-brand-subtext shadow-inner-glow',
  success: 'bg-gradient-to-r from-brand-emerald to-brand-turquoise text-white shadow-glow-emerald',
  gold: 'bg-gradient-to-r from-brand-gold to-yellow-400 text-black shadow-glow-gold',
  ruby: 'bg-gradient-to-r from-brand-ruby to-pink-400 text-white shadow-glow-ruby',
}

const Badge = ({ children, variant = 'primary', className = '' }) => {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 ${
        variantClasses[variant] || variantClasses.primary
      } ${className}`}
    >
      {children}
    </span>
  )
}

export default Badge
