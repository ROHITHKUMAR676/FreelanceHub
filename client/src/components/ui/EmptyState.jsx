import { SearchX } from 'lucide-react'

const EmptyState = ({ title = 'Nothing here yet', text = 'New activity will appear here as soon as it is available.', action = null }) => (
  <div className="premium-surface flex flex-col items-center justify-center rounded-[28px] px-6 py-12 text-center">
    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-primary/15 to-brand-secondary/15 text-brand-primary">
      <SearchX size={26} />
    </div>
    <h3 className="mt-4 text-lg font-bold text-brand-text">{title}</h3>
    <p className="mt-2 max-w-md text-sm leading-6 text-brand-subtext">{text}</p>
    {action ? <div className="mt-5">{action}</div> : null}
  </div>
)

export default EmptyState
