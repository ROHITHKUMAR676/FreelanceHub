import { useState } from 'react'

const LoginForm = ({ role, onBack, onLogin }) => {
  const [form, setForm] = useState({
    name: '',
    email: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onLogin(form)
  }

  return (
    <div className="animate-fade-up">
      <button
        type="button"
        onClick={onBack}
        className="mb-4 text-sm font-semibold text-brand-primary transition hover:text-brand-secondary"
      >
        Back
      </button>

      <h2 className="text-2xl font-bold capitalize tracking-tight text-brand-text">
        {role} Login
      </h2>

      <p className="mt-1 text-sm text-brand-subtext">
        Enter your details to continue
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <div>
          <label className="text-sm font-semibold text-brand-text">Full Name</label>
          <input
            type="text"
            name="name"
            required
            value={form.name}
            onChange={handleChange}
            className="app-input mt-1"
            placeholder="Enter your name"
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-brand-text">Email</label>
          <input
            type="email"
            name="email"
            required
            value={form.email}
            onChange={handleChange}
            className="app-input mt-1"
            placeholder="Enter your email"
          />
        </div>

        <button type="submit" className="premium-button w-full">
          Continue
        </button>
      </form>
    </div>
  )
}

export default LoginForm
