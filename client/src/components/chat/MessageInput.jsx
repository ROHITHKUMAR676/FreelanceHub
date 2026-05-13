import { useState } from 'react'

const MessageInput = ({ onSend }) => {
  const [text, setText] = useState('')
  const [attachment, setAttachment] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!text.trim()) return
    const attachments = attachment
      ? attachment
          .split(',')
          .map((a) => a.trim())
          .filter(Boolean)
      : []
    onSend(text, attachments)
    setText('')
    setAttachment('')
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="border-t border-brand-border/50 bg-gradient-to-br from-white/80 via-brand-lavender/70 to-white/90 px-4 py-3 space-y-3"
    >
      <div className="flex items-center space-x-3">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 rounded-2xl border border-brand-border bg-brand-surface/90 px-4 py-3 text-sm text-brand-text shadow-inner-glow focus:border-brand-primary focus:outline-none focus:ring-4 focus:ring-brand-primary/20"
        />
        <button
          type="submit"
          disabled={!text.trim()}
          className="inline-flex items-center rounded-2xl bg-gradient-to-r from-brand-primary to-brand-secondary px-5 py-3 text-sm font-semibold text-white shadow-glow hover:brightness-110 disabled:opacity-50"
        >
          Send
        </button>
      </div>
      <input
        type="text"
        value={attachment}
        onChange={(e) => setAttachment(e.target.value)}
        placeholder="Attachment URLs (comma separated, optional)"
        className="w-full rounded-2xl border border-brand-border bg-brand-surface/80 px-4 py-2 text-xs text-brand-text focus:border-brand-secondary focus:outline-none focus:ring-4 focus:ring-brand-secondary/20"
      />
    </form>
  )
}

export default MessageInput


