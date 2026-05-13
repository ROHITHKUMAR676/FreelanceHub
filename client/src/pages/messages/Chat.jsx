import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { io } from 'socket.io-client'
import { Paperclip, Send, Sparkles } from 'lucide-react'
import { AuthContext } from '../../context/AuthContext'
import { getJson } from '../../utils/api'

const SOCKET_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

const getMessageId = (message) => {
  if (!message) return null
  if (message._id || message.id) return message._id || message.id

  const senderKey =
    typeof message.sender === 'string'
      ? message.sender
      : message.sender?._id || message.sender?.id || 'unknown'

  return `${senderKey}-${message.createdAt ?? ''}-${message.text ?? ''}`
}

const getSenderId = (sender) => {
  if (!sender) return ''
  if (typeof sender === 'string') return sender
  return sender._id || sender.id || ''
}

const sortByCreatedAt = (items) =>
  [...items].sort(
    (a, b) =>
      new Date(a.createdAt || 0).getTime() -
      new Date(b.createdAt || 0).getTime(),
  )

const mergeUniqueMessages = (existing, incoming) => {
  const map = new Map()
  existing.forEach((message) => map.set(getMessageId(message), message))
  incoming.forEach((message) => map.set(getMessageId(message), message))
  return sortByCreatedAt(Array.from(map.values()))
}

const formatTime = (createdAt) => {
  if (!createdAt) return ''
  const date = new Date(createdAt)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

const Chat = ({ conversationId, receiverId, receiver }) => {
  const { user } = useContext(AuthContext)
  const currentUserId = useMemo(() => user?._id || user?.id || '', [user])

  const socketRef = useRef(null)
  const activeConversationRef = useRef(conversationId || '')
  const endRef = useRef(null)

  const [messages, setMessages] = useState([])
  const [draft, setDraft] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const scrollToBottom = useCallback(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  useEffect(() => {
    activeConversationRef.current = conversationId || ''
    const socket = socketRef.current
    if (socket && socket.connected && conversationId) {
      socket.emit('joinRoom', conversationId)
    }
  }, [conversationId])

  useEffect(() => {
    if (!conversationId) {
      setMessages([])
      setIsLoading(false)
      setError('')
      return undefined
    }

    let active = true

    const fetchMessages = async () => {
      try {
        setIsLoading(true)
        setError('')

        const data = await getJson(`/api/messages/${encodeURIComponent(conversationId)}`)
        if (!active) return

        setMessages(sortByCreatedAt(Array.isArray(data) ? data : []))
      } catch (fetchError) {
        if (!active) return
        setError(fetchError?.message || 'Failed to load messages')
      } finally {
        if (active) setIsLoading(false)
      }
    }

    fetchMessages()

    return () => {
      active = false
    }
  }, [conversationId])

  useEffect(() => {
    if (socketRef.current) return undefined

    const socket = io(SOCKET_URL, { withCredentials: true })
    socketRef.current = socket

    const handleConnect = () => {
      const activeConversationId = activeConversationRef.current
      if (activeConversationId) socket.emit('joinRoom', activeConversationId)
    }

    const handleReceiveMessage = (message) => {
      const activeConversationId = activeConversationRef.current
      if (!message || message.conversationId !== activeConversationId) return
      setMessages((previous) => mergeUniqueMessages(previous, [message]))
    }

    const handleMessageError = (socketError) => {
      setError(socketError?.message || 'Message failed')
    }

    socket.on('connect', handleConnect)
    socket.on('receiveMessage', handleReceiveMessage)
    socket.on('messageError', handleMessageError)

    return () => {
      socket.off('connect', handleConnect)
      socket.off('receiveMessage', handleReceiveMessage)
      socket.off('messageError', handleMessageError)
      socket.disconnect()
      socketRef.current = null
    }
  }, [])

  const handleSend = (event) => {
    event.preventDefault()

    const text = draft.trim()
    if (!text || !conversationId || !receiverId || !currentUserId) return

    setError('')

    socketRef.current?.emit('sendMessage', {
      senderId: currentUserId,
      receiverId,
      conversationId,
      text,
    })

    setDraft('')
  }

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-[26px] border border-brand-border/70 bg-brand-surface/95 text-brand-text shadow-panel backdrop-blur-xl">
      <header className="border-b border-brand-border/70 bg-brand-surface/95 px-5 py-4 backdrop-blur">
        <div className="flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-brand-primary to-brand-secondary text-base font-black text-white shadow-glow">
              {(receiver?.name || receiver?.email || 'U').slice(0, 1).toUpperCase()}
            </div>
            <div className="min-w-0">
              <h2 className="truncate text-lg font-black text-brand-text">{receiver?.name || 'Conversation'}</h2>
              <p className="truncate text-sm text-brand-subtext">{receiver?.email || 'Project chat'}</p>
            </div>
          </div>
          <span className="hidden items-center gap-1.5 rounded-full border border-brand-emerald/25 bg-brand-emerald/10 px-3 py-1 text-xs font-bold text-brand-emerald sm:inline-flex">
            <span className="h-2 w-2 rounded-full bg-brand-emerald" />
            Secure chat
          </span>
        </div>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto bg-[radial-gradient(circle_at_18%_0%,rgba(0,184,148,0.08),transparent_20rem),radial-gradient(circle_at_92%_18%,rgba(0,122,255,0.08),transparent_22rem)] px-4 py-5 sm:px-6">
        {isLoading ? (
          <p className="rounded-2xl border border-brand-border bg-brand-background/70 p-4 text-sm text-brand-subtext">Loading messages...</p>
        ) : null}

        {!isLoading && error ? (
          <p className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-500">{error}</p>
        ) : null}

        {!isLoading && !error && messages.length === 0 ? (
          <div className="flex h-full min-h-[260px] items-center justify-center">
            <div className="max-w-sm rounded-[26px] border border-dashed border-brand-border bg-brand-surface/80 p-6 text-center shadow-panel">
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-brand-primary/10 text-brand-primary">
                <Sparkles size={24} />
              </div>
              <h3 className="mt-4 text-lg font-black text-brand-text">Start the conversation</h3>
              <p className="mt-2 text-sm leading-6 text-brand-subtext">Send a clear message, project update, or delivery question.</p>
            </div>
          </div>
        ) : null}

        {!isLoading && !error && messages.length > 0 ? (
          <div className="space-y-4 pb-2">
            {messages.map((message) => {
              const isMine = getSenderId(message.sender) === currentUserId

              return (
                <div key={getMessageId(message)} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                  <article
                    className={`max-w-[78%] rounded-[24px] px-4 py-3 text-sm shadow-sm transition-all duration-300 sm:max-w-[68%] ${
                      isMine
                        ? 'rounded-br-md bg-gradient-to-r from-brand-primary to-brand-secondary text-right text-white shadow-glow'
                        : message.type === 'revision'
                          ? 'rounded-bl-md border border-yellow-400/30 bg-yellow-500/10 text-left text-brand-text'
                          : 'rounded-bl-md border border-brand-border/70 bg-brand-surface/95 text-left text-brand-text'
                    }`}
                  >
                    {message.type === 'revision' ? (
                      <p className="mb-1 text-xs font-black uppercase tracking-wide text-yellow-600">Revision Requested</p>
                    ) : null}
                    <p className="whitespace-pre-wrap break-words text-sm leading-6">{message.text}</p>
                    <p className={`mt-2 text-xs ${isMine ? 'text-white/70' : 'text-brand-subtext'}`}>{formatTime(message.createdAt)}</p>
                  </article>
                </div>
              )
            })}
          </div>
        ) : null}

        <div ref={endRef} />
      </div>

      <form onSubmit={handleSend} className="sticky bottom-0 border-t border-brand-border/70 bg-brand-surface/95 px-4 py-4 backdrop-blur-xl sm:px-5">
        <div className="flex items-center gap-2 rounded-[22px] border border-brand-border/70 bg-brand-background/70 p-2 shadow-sm">
          <button
            type="button"
            className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-brand-border bg-brand-surface/80 text-brand-subtext transition hover:border-brand-primary/30 hover:text-brand-primary"
            aria-label="Attach file"
          >
            <Paperclip size={18} />
          </button>
          <input
            type="text"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Type a message..."
            className="min-w-0 flex-1 bg-transparent px-2 text-sm text-brand-text outline-none placeholder:text-brand-subtext/70"
            autoComplete="off"
          />
          <button
            type="submit"
            disabled={!draft.trim()}
            className="inline-flex h-11 shrink-0 items-center gap-2 rounded-2xl bg-gradient-to-r from-brand-primary to-brand-secondary px-4 text-sm font-black text-white shadow-glow transition-all duration-300 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Send size={16} />
            <span className="hidden sm:inline">Send</span>
          </button>
        </div>
      </form>
    </div>
  )
}

export default Chat
