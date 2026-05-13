import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CalendarDays, FileText, IndianRupee, Sparkles } from 'lucide-react'
import Card from '../../components/ui/Card'
import { createJob } from '../../services/jobService'

const initialFormState = {
  title: '',
  description: '',
  budget: '',
  deadline: '',
}

const PostJob = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState(initialFormState)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const todayDate = new Date().toISOString().slice(0, 10)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    const parsedBudget = Number(form.budget)
    const selectedDeadline = new Date(form.deadline)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (!form.title.trim() || !form.description.trim()) {
      setError('Title and description are required.')
      return
    }

    if (Number.isNaN(parsedBudget) || parsedBudget <= 0) {
      setError('Budget must be greater than zero.')
      return
    }

    if (!form.deadline) {
      setError('Please choose a deadline.')
      return
    }

    if (selectedDeadline < today) {
      setError('Deadline cannot be in the past.')
      return
    }

    setSubmitting(true)

    try {
      await createJob({
        title: form.title.trim(),
        description: form.description.trim(),
        budget: parsedBudget,
        deadline: form.deadline,
      })

      navigate('/client/dashboard', { replace: true })
    } catch (err) {
      setError(err.message || 'Failed to post job')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="mx-auto w-full max-w-5xl space-y-6 p-1 text-brand-text">
      <Card className="overflow-hidden p-0">
        <div className="relative p-6 sm:p-8">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/10 via-transparent to-brand-secondary/10" />
          <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-brand-primary">Client Workspace</p>
              <h1 className="mt-2 text-3xl font-black premium-text-gradient">Post a New Job</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-brand-subtext">Create a clear job brief so freelancers can send strong proposals with realistic plans and timelines.</p>
            </div>
            <div className="grid h-16 w-16 place-items-center rounded-3xl bg-gradient-to-br from-brand-primary to-brand-secondary text-white shadow-glow">
              <Sparkles size={28} />
            </div>
          </div>
        </div>
      </Card>

      <Card as="form" onSubmit={handleSubmit} className="p-6 sm:p-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_18rem]">
          <div className="space-y-6">
          <div>
            <label htmlFor="title" className="flex items-center gap-2 text-sm font-bold text-brand-text">
              <FileText size={16} className="text-brand-primary" />
              Job Title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              value={form.title}
              onChange={handleChange}
              required
              placeholder="e.g. Build a modern portfolio website"
              className="app-input mt-2"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-bold text-brand-text">
              Job Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={6}
              value={form.description}
              onChange={handleChange}
              required
              placeholder="Share project scope, expectations, and key deliverables"
              className="app-input mt-2 min-h-40"
            />
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label htmlFor="budget" className="flex items-center gap-2 text-sm font-bold text-brand-text">
                <IndianRupee size={16} className="text-brand-primary" />
                Budget
              </label>
              <input
                id="budget"
                name="budget"
                type="number"
                min="1"
                step="0.01"
                value={form.budget}
                onChange={handleChange}
                required
                placeholder="Enter total budget"
                className="app-input mt-2"
              />
            </div>

            <div>
              <label htmlFor="deadline" className="flex items-center gap-2 text-sm font-bold text-brand-text">
                <CalendarDays size={16} className="text-brand-primary" />
                Deadline
              </label>
              <input
                id="deadline"
                name="deadline"
                type="date"
                min={todayDate}
                value={form.deadline}
                onChange={handleChange}
                required
                className="app-input mt-2"
              />
            </div>
          </div>

          {error ? (
            <div className="rounded-2xl border border-brand-border bg-brand-messageReceived p-3">
              <p className="text-sm text-brand-text">{error}</p>
            </div>
          ) : null}

          <button type="submit" disabled={submitting} className="premium-button w-full disabled:cursor-not-allowed disabled:opacity-60">
            {submitting ? 'Publishing...' : 'Publish Job'}
          </button>
          </div>

          <aside className="rounded-[24px] border border-brand-border/70 bg-brand-background/70 p-5">
            <p className="text-sm font-black text-brand-text">Brief quality checklist</p>
            <div className="mt-4 space-y-3 text-sm text-brand-subtext">
              {['Specific deliverables', 'Realistic budget', 'Clear deadline', 'Success criteria'].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-brand-secondary" />
                  {item}
                </div>
              ))}
            </div>
          </aside>
        </div>
      </Card>
    </section>
  )
}

export default PostJob
