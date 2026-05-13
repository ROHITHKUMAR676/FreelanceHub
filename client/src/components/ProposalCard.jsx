const ProposalCard = ({
  proposal,
  onAccept,
  onReject,
  onMessage,
  showActions = true,
}) => {
  const freelancer = proposal?.freelancer || proposal
  const rating = freelancer?.rating || proposal?.rating || 0
  const bidAmount = proposal?.bidAmount || proposal?.amount || 0
  const deliveryTime = proposal?.deliveryTime || proposal?.estimatedDays || 0

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)

    return (
      <div className="flex items-center space-x-1">
        {[...Array(fullStars)].map((_, i) => (
          <svg
            key={i}
            className="w-4 h-4 text-yellow-400 fill-current"
            viewBox="0 0 20 20"
          >
            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
          </svg>
        ))}
        {hasHalfStar && (
          <svg
            className="w-4 h-4 text-yellow-400 fill-current"
            viewBox="0 0 20 20"
          >
            <defs>
              <linearGradient id="half">
                <stop offset="50%" stopColor="currentColor" />
                <stop offset="50%" stopColor="transparent" stopOpacity="1" />
              </linearGradient>
            </defs>
            <path
              fill="url(#half)"
              d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"
            />
          </svg>
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <svg
            key={i}
            className="w-4 h-4 text-gray-300 fill-current"
            viewBox="0 0 20 20"
          >
            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
          </svg>
        ))}
        <span className="text-sm text-gray-600 ml-1">({rating})</span>
      </div>
    )
  }

  return (
    <div className="premium-card-premium p-6 premium-card-hover group">
      <div className="flex items-start space-x-4 mb-4">
        {/* Avatar */}
        <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-emerald to-brand-turquoise text-xl font-bold text-white shadow-glow-emerald animate-float">
          {freelancer?.name?.charAt(0).toUpperCase() ||
            proposal?.freelancerName?.charAt(0).toUpperCase() ||
            'F'}
        </div>

        {/* Freelancer Info */}
        <div className="flex-1 min-w-0">
          <h3 className="truncate text-lg font-semibold premium-text-gradient group-hover:scale-105 transition-transform duration-300">
            {freelancer?.name || proposal?.freelancerName || 'Freelancer'}
          </h3>
          {renderStars(rating)}
          {freelancer?.location && (
            <p className="mt-1 text-sm text-brand-subtext">
              {freelancer.location}
            </p>
          )}
        </div>

        {/* Bid Amount */}
        <div className="text-right">
          <div className="premium-gradient-text text-3xl font-bold animate-bounce-subtle">
            ${bidAmount.toLocaleString()}
          </div>
          <div className="text-sm text-brand-subtext">Bid Amount</div>
        </div>
      </div>

      {/* Proposal Message */}
      <div className="mb-4">
        <p className="line-clamp-3 text-brand-subtext">
          {proposal?.message || proposal?.proposalMessage || 'No message provided'}
        </p>
      </div>

      {/* Proposal Details */}
      <div className="mb-4 flex items-center justify-between border-b border-brand-border pb-4">
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <div className="flex items-center space-x-1">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Delivery: {deliveryTime} days</span>
          </div>
          {proposal?.status && (
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                proposal.status === 'accepted'
                  ? 'bg-green-100 text-green-700'
                  : proposal.status === 'rejected'
                  ? 'bg-red-100 text-red-700'
                  : 'bg-yellow-100 text-yellow-700'
              }`}
            >
              {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
            </span>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      {showActions && (
        <div className="flex items-center space-x-3">
          {onAccept && (
            <button
              onClick={() => onAccept(proposal)}
              className="flex-1 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-emerald-700 hover:shadow-panel"
            >
              Accept Proposal
            </button>
          )}
          {onReject && (
            <button
              onClick={() => onReject(proposal)}
              className="flex-1 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-red-700 hover:shadow-panel"
            >
              Reject
            </button>
          )}
          {onMessage && (
            <button
              onClick={() => onMessage(proposal)}
              className="premium-ghost-button px-4 py-2"
            >
              Message
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default ProposalCard


