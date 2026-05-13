import { useContext, useEffect, useMemo, useState } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { sendJson } from '../../utils/api'
import { getProfileSignals, saveProfileSignals } from '../../utils/profileSignals'

const FreelancerProfile = () => {
  const { user, updateUser, logout } = useContext(AuthContext)

  const [formState, setFormState] = useState({ name: '', email: '', linkedinUrl: '', githubUrl: '' })
  const [isSaving, setIsSaving] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const signals = getProfileSignals(user?.email)
    setFormState({
      name: user?.name || '',
      email: user?.email || '',
      linkedinUrl: user?.linkedinUrl || signals.linkedinUrl || '',
      githubUrl: user?.githubUrl || signals.githubUrl || '',
    })
  }, [user?.name, user?.email])

  const roleLabel = user?.role
    ? `${user.role.charAt(0).toUpperCase()}${user.role.slice(1)}`
    : 'Freelancer'

  const hasChanges = useMemo(() => {
    const trimmedName = formState.name.trim()
    const trimmedEmail = formState.email.trim().toLowerCase()
    const signals = getProfileSignals(user?.email)

    return (
      trimmedName !== (user?.name || '') ||
      trimmedEmail !== (user?.email || '').toLowerCase() ||
      formState.linkedinUrl.trim() !== (user?.linkedinUrl || signals.linkedinUrl || '') ||
      formState.githubUrl.trim() !== (user?.githubUrl || signals.githubUrl || '')
    )
  }, [formState.name, formState.email, formState.linkedinUrl, formState.githubUrl, user?.name, user?.email, user?.linkedinUrl, user?.githubUrl])

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
      saveProfileSignals(payload.email, {
        linkedinUrl: formState.linkedinUrl.trim(),
        githubUrl: formState.githubUrl.trim(),
        profileCompletion: 90,
      })

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
        <p className="text-xs font-black uppercase tracking-[0.2em] text-brand-primary">Freelancer identity</p>
        <h1 className="mt-2 text-3xl font-black premium-text-gradient">Freelancer Profile</h1>
        <p className="mt-2 text-sm text-brand-subtext">Manage your account details</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label
              htmlFor="freelancer-name"
              className="mb-1 block text-sm font-medium text-brand-subtext"
            >
              Name
            </label>
            <input
              id="freelancer-name"
              name="name"
              type="text"
              value={formState.name}
              onChange={handleChange}
              className="app-input"
              autoComplete="name"
            />
          </div>

          <div>
            <label
              htmlFor="freelancer-email"
              className="mb-1 block text-sm font-medium text-brand-subtext"
            >
              Email
            </label>
            <input
              id="freelancer-email"
              name="email"
              type="email"
              value={formState.email}
              onChange={handleChange}
              className="app-input"
              autoComplete="email"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="freelancer-linkedin" className="mb-1 block text-sm font-medium text-brand-subtext">
                LinkedIn URL
              </label>
              <input
                id="freelancer-linkedin"
                name="linkedinUrl"
                type="url"
                value={formState.linkedinUrl}
                onChange={handleChange}
                className="app-input"
                placeholder="https://linkedin.com/in/your-profile"
              />
            </div>

            <div>
              <label htmlFor="freelancer-github" className="mb-1 block text-sm font-medium text-brand-subtext">
                GitHub URL
              </label>
              <input
                id="freelancer-github"
                name="githubUrl"
                type="url"
                value={formState.githubUrl}
                onChange={handleChange}
                className="app-input"
                placeholder="https://github.com/username"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="freelancer-role"
              className="mb-1 block text-sm font-medium text-brand-subtext"
            >
              Role
            </label>
            <input
              id="freelancer-role"
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

export default FreelancerProfile

