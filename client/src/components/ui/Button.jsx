const Button = ({
  type = 'button',
  variant = 'primary',
  className = '',
  disabled = false,
  children,
  ...props
}) => {
  const baseClass =
    'inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 hover:-translate-y-0.5'

  const variantClass =
    variant === 'primary'
      ? 'bg-gradient-to-r from-brand-primary to-brand-secondary text-white shadow-glow hover:brightness-110 hover:shadow-lift focus:ring-brand-primary/20 animate-glow-pulse'
      : variant === 'gold'
      ? 'bg-gradient-to-r from-brand-gold to-yellow-500 text-black shadow-glow-gold hover:brightness-110 hover:shadow-lift focus:ring-yellow-300/20'
      : 'border border-brand-border bg-brand-surface/80 text-brand-text shadow-sm backdrop-blur hover:border-brand-primary/40 hover:bg-brand-surface hover:shadow-panel focus:ring-brand-primary/15'

  return (
    <button
      type={type}
      disabled={disabled}
      className={`${baseClass} ${variantClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button

