const MessageBubble = ({ message, isOwn }) => {
  const date = message.timestamp ? new Date(message.timestamp) : null
  const timeLabel = date
    ? date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    : ''

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} animate-slide-in-right`}>
      <div
        className={`max-w-xs md:max-w-md px-4 py-2 rounded-3xl shadow-panel text-sm leading-5 backdrop-blur-sm transition-all duration-300 hover:scale-105 ${
          isOwn
            ? 'bg-gradient-to-r from-brand-primary to-brand-secondary text-white rounded-br-none shadow-glow animate-pulse-glow'
            : 'bg-gradient-to-r from-white to-brand-lavender/30 text-brand-text border border-brand-border/50 rounded-bl-none shadow-inner-glow'
        }`}
      >
        <p className="whitespace-pre-wrap break-words">{message.message}</p>
        <div className="mt-1 flex items-center justify-end space-x-1 text-[10px]">
          <span className={isOwn ? 'text-blue-100' : 'text-brand-subtext'}>{timeLabel}</span>
          {isOwn && (
            <span className={message.readStatus === 'read' ? 'text-blue-100 animate-bounce-subtle' : 'text-blue-200'}>
              {message.readStatus === 'read' ? '✓✓' : '✓'}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export default MessageBubble

