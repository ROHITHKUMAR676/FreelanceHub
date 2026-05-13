const Skeleton = ({ className = '' }) => (
  <div className={`animate-shimmer rounded-2xl bg-[linear-gradient(90deg,rgba(148,163,184,0.12),rgba(255,255,255,0.42),rgba(148,163,184,0.12))] bg-[length:200%_100%] ${className}`} />
)

export default Skeleton
