import { useContext, useEffect, useMemo, useState } from 'react'
import { MessageCircle, Search, UsersRound } from 'lucide-react'
import Chat from './Chat'
import { AuthContext } from '../../context/AuthContext'
import { getJson } from '../../utils/api'

const Messages = () => {
  const { user, isInitializing } = useContext(AuthContext)
  const currentUserId = user?.id || user?._id || ''

  const [users, setUsers] = useState([])
  const [receiverId, setReceiverId] = useState('')
  const [isLoadingUsers, setIsLoadingUsers] = useState(true)
  const [usersError, setUsersError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    if (!currentUserId) return

    let isActive = true

    const fetchUsers = async () => {
      setIsLoadingUsers(true)
      setUsersError('')

      try {
        const fetchedUsers = await getJson('/api/users')
        if (!isActive) return

        const safeUsers = Array.isArray(fetchedUsers) ? fetchedUsers : []
        setUsers(safeUsers)

        if (safeUsers.length > 0) {
          setReceiverId((previous) => {
            if (previous && safeUsers.some((item) => item._id === previous)) {
              return previous
            }
            return safeUsers[0]._id
          })
        } else {
          setReceiverId('')
        }
      } catch (error) {
        if (!isActive) return
        setUsersError(error?.message || 'Failed to load users')
      } finally {
        if (isActive) {
          setIsLoadingUsers(false)
        }
      }
    }

    fetchUsers()

    return () => {
      isActive = false
    }
  }, [currentUserId])

  const conversationId = useMemo(() => {
    if (!currentUserId || !receiverId) return ''
    return [currentUserId, receiverId].sort().join('*')
  }, [currentUserId, receiverId])

  const filteredUsers = useMemo(() => {
    const query = searchTerm.trim().toLowerCase()
    if (!query) return users
    return users.filter((item) =>
      `${item.name || ''} ${item.email || ''}`.toLowerCase().includes(query),
    )
  }, [searchTerm, users])

  const activeReceiver = useMemo(
    () => users.find((item) => item._id === receiverId) || null,
    [receiverId, users],
  )

  if (isInitializing || !user) {
    return (
      <div className="flex h-[calc(100vh-10rem)] items-center justify-center rounded-[28px] border border-brand-border/70 bg-brand-surface/95 text-brand-text shadow-panel backdrop-blur">
        Loading user session...
      </div>
    )
  }

  return (
    <section className="h-[calc(100vh-9rem)] overflow-hidden rounded-[30px] border border-brand-border/70 bg-brand-surface/92 text-brand-text shadow-lift backdrop-blur-2xl">
      <div className="flex h-full min-h-0 flex-col lg:flex-row">
        <aside className="flex min-h-0 w-full flex-shrink-0 flex-col border-b border-brand-border/70 bg-brand-surface/95 lg:w-[360px] lg:border-b-0 lg:border-r">
          <div className="border-b border-brand-border/70 p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-brand-primary">Inbox</p>
                <h2 className="mt-1 text-2xl font-black text-brand-text">Messages</h2>
              </div>
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-brand-primary/10 text-brand-primary">
                <UsersRound size={21} />
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2 rounded-2xl border border-brand-border/70 bg-brand-background/70 px-3 py-2">
              <Search size={16} className="text-brand-subtext" />
              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search people..."
                className="min-w-0 flex-1 bg-transparent text-sm text-brand-text outline-none placeholder:text-brand-subtext/70"
              />
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto p-3">
            {isLoadingUsers ? <p className="p-3 text-sm text-brand-subtext">Loading users...</p> : null}

            {!isLoadingUsers && usersError ? (
              <p className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-3 text-sm text-rose-500">{usersError}</p>
            ) : null}

            {!isLoadingUsers && !usersError && filteredUsers.length === 0 ? (
              <div className="rounded-2xl border border-brand-border bg-brand-background/70 p-4 text-sm text-brand-subtext">
                No users available to chat.
              </div>
            ) : null}

            <div className="space-y-2">
              {filteredUsers.map((listUser) => {
                const isActive = receiverId === listUser._id
                const initials = (listUser.name || listUser.email || 'U').slice(0, 1).toUpperCase()

                return (
                  <button
                    key={listUser._id}
                    type="button"
                    onClick={() => setReceiverId(listUser._id)}
                    className={`group flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition duration-300 ${
                      isActive
                        ? 'border-transparent bg-gradient-to-r from-brand-primary to-brand-secondary text-white shadow-glow'
                        : 'border-brand-border/70 bg-brand-background/60 text-brand-text hover:-translate-y-0.5 hover:border-brand-primary/30 hover:bg-brand-surface hover:shadow-panel'
                    }`}
                  >
                    <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl text-sm font-black ${isActive ? 'bg-white/18 text-white' : 'bg-brand-primary/10 text-brand-primary'}`}>
                      {initials}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-black">{listUser.name || 'Unnamed user'}</span>
                      <span className={`block truncate text-xs ${isActive ? 'text-white/80' : 'text-brand-subtext'}`}>
                        {listUser.email}
                      </span>
                    </span>
                    <MessageCircle size={16} className={isActive ? 'text-white/80' : 'text-brand-subtext group-hover:text-brand-primary'} />
                  </button>
                )
              })}
            </div>
          </div>
        </aside>

        <main className="min-w-0 flex-1 bg-brand-background/50 p-3 lg:p-4">
          {receiverId && conversationId ? (
            <Chat conversationId={conversationId} receiverId={receiverId} receiver={activeReceiver} />
          ) : (
            <div className="flex h-full items-center justify-center rounded-[26px] border border-dashed border-brand-border/80 bg-brand-surface/80 px-6 text-center text-sm text-brand-subtext">
              Select a conversation to start messaging.
            </div>
          )}
        </main>
      </div>
    </section>
  )
}

export default Messages

