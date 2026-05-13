const Card = ({ as: Component = 'div', className = '', children, ...props }) => {
  return (
    <Component
      className={`premium-card ${className}`}
      {...props}
    >
      {children}
    </Component>
  )
}

export default Card
