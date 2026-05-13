const Loader = ({ size = 'md', fullScreen = false }) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  }

  const spinnerSize = sizeClasses[size] || sizeClasses.md

  const Spinner = () => (
    <div className="flex items-center justify-center">
      <div
        className={`${spinnerSize} rounded-full border-4 border-brand-primary/15 border-t-brand-primary shadow-glow animate-spin`}
      ></div>
    </div>
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-surface/75 backdrop-blur-xl">
        <Spinner />
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center p-8">
      <Spinner />
    </div>
  )
}

export default Loader



