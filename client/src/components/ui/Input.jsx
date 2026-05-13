const Input = ({
  id,
  name,
  type = 'text',
  label,
  className = '',
  inputClassName = '',
  ...props
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label htmlFor={id || name} className="text-sm font-semibold text-brand-text">
          {label}
        </label>
      )}
      <input
        id={id || name}
        name={name}
        type={type}
        className={`app-input ${inputClassName}`}
        {...props}
      />
    </div>
  )
}

export default Input
