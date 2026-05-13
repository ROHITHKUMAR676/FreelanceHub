import { useContext, useEffect, useMemo, useState } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { sendJson } from '../../utils/api'

const ClientProfile = () => {
  const { user, updateUser, logout } = useContext(AuthContext)

  const [formState, setFormState] = useState({ name: '', email: '' })
  const [isSaving, setIsSaving] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    setFormState({
      name: user?.name || '',
      email: user?.email || '',
    })
  }, [user?.name, user?.email])

  const roleLabel = user?.role ? `${user.role.charAt(0).toUpperCase()}${user.role.slice(1)}` : 'Client'

  const hasChanges = useMemo(() => {
    const trimmedName = formState.name.trim()
    const trimmedEmail = formState.email.trim().toLowerCase()

    return (
      trimmedName !== (user?.name || '') ||
      trimmedEmail !== (user?.email || '').toLowerCase()
    )
  }, [formState.name, formState.email, user?.name, user?.email])

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormState((previous) => ({
      ...previous,
      [name]: value,
    }))

    if (statusMessage) setStatusMessage('')
    if (errorMessage) setErrorMessage('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!hasChanges || isSaving) return

    const payload = {
      name: formState.name.trim(),
      email: formState.email.trim().toLowerCase(),
    }

    try {
      setIsSaving(true)
      setStatusMessage('')
      setErrorMessage('')

      const response = await sendJson('/api/users/profile', {
        method: 'PUT',
        body: payload,
      })

      const updatedUser = response?.user
      if (updatedUser) {
        updateUser(updatedUser)
      }

      setStatusMessage('Profile updated successfully.')
    } catch (error) {
      setErrorMessage(error?.message || 'Failed to update profile')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <section className="mx-auto w-full max-w-4xl space-y-6 text-brand-text">
      <div className="premium-card-premium p-6 sm:p-8">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-brand-primary">Account settings</p>
        <h1 className="mt-2 text-3xl font-black premium-text-gradient">Client Profile</h1>
        <p className="mt-2 text-sm text-brand-subtext">Manage your account details</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="client-name" className="mb-1 block text-sm font-medium text-brand-subtext">
              Name
            </label>
            <input
              id="client-name"
              name="name"
              type="text"
              value={formState.name}
              onChange={handleChange}
              className="app-input"
              autoComplete="name"
            />
          </div>

          <div>
            <label htmlFor="client-email" className="mb-1 block text-sm font-medium text-brand-subtext">
              Email
            </label>
            <input
              id="client-email"
              name="email"
              type="email"
              value={formState.email}
              onChange={handleChange}
              className="app-input"
              autoComplete="email"
            />
          </div>

          <div>
            <label htmlFor="client-role" className="mb-1 block text-sm font-medium text-brand-subtext">
              Role
            </label>
            <input
              id="client-role"
              type="text"
              value={roleLabel}
              readOnly
              className="app-input"
            />
          </div>

          {statusMessage ? (
            <p className="rounded-2xl border border-brand-emerald/30 bg-brand-emerald/10 px-3 py-2 text-sm text-brand-emerald">
              {statusMessage}
            </p>
          ) : null}

          {errorMessage ? (
            <p className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-500">
              {errorMessage}
            </p>
          ) : null}

          <div className="flex flex-col gap-3 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="submit"
              disabled={!hasChanges || isSaving}
              className="premium-button disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving ? 'Saving...' : 'Save'}
            </button>

            <button
              type="button"
              onClick={() => logout()}
              className="premium-ghost-button"
            >
              Logout
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}

export default ClientProfile

