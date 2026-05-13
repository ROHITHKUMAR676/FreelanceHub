import { useEffect, useRef } from 'react'
import MessageBubble from './MessageBubble'
import MessageInput from './MessageInput'

const ChatWindow = ({ conversation, project, messages, currentUserId, onSendMessage }) => {
  const bottomRef = useRef(null)

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  if (!conversation) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-brand-subtext premium-bg-gradient rounded-3xl">
        Select a conversation to start chatting.
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col premium-card-premium premium-card-hover rounded-3xl overflow-hidden">
      <div className="border-b border-brand-border/50 px-6 py-4 premium-bg-gradient">
        <h2 className="text-lg font-semibold premium-text-gradient">
          {project?.title || 'Project Conversation'}
        </h2>
        <p className="text-sm text-brand-subtext">Project-based chat between client and freelancer</p>
      </div>

      <div className="flex-1 overflow-y-auto premium-bg-gradient px-6 py-4 space-y-4">
        {messages.map((m) => (
          <MessageBubble key={m.id} message={m} isOwn={m.senderId === currentUserId} />
        ))}
        <div ref={bottomRef} />
      </div>

      <MessageInput onSend={onSendMessage} />
    </div>
  )
}

export default ChatWindow

