import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Send, ShieldCheck } from 'lucide-react'
import { createProposal } from '../../services/proposalService'

const SubmitProposal = () => {
  const { projectId } = useParams()
  const navigate = useNavigate()

  const [text, setText] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()

    const normalizedText = text.trim()
    if (!normalizedText) {
      setError('Proposal text is required')
      return
    }

    try {
      setIsSubmitting(true)
      setError('')

      await createProposal({ jobId: projectId, text: normalizedText })
      navigate('/freelancer/my-proposals')
    } catch (err) {
      setError(err?.message || 'Failed to submit proposal')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="mx-auto w-full max-w-3xl space-y-5 text-brand-text">
      <div className="premium-card-premium p-6">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-brand-primary">Win the brief</p>
        <h1 className="mt-2 text-3xl font-black premium-text-gradient">Send Proposal</h1>
        <p className="mt-2 text-sm text-brand-subtext">Share your approach, proof of fit, and next steps for this job.</p>
      </div>

      <form onSubmit={handleSubmit} className="premium-card space-y-5 p-6">
        <div>
          <label htmlFor="proposal-text" className="mb-2 flex items-center gap-2 text-sm font-bold text-brand-text">
            <Send size={16} className="text-brand-primary" />
            Proposal
          </label>
          <textarea
            id="proposal-text"
            value={text}
            onChange={(event) => setText(event.target.value)}
            rows={8}
            className="app-input min-h-48 text-sm"
            placeholder="Write a concise plan, timeline, relevant experience, and what you need from the client."
          />
        </div>

        <div className="rounded-2xl border border-brand-primary/20 bg-brand-primary/10 p-4">
          <div className="flex items-start gap-3">
            <ShieldCheck size={18} className="mt-0.5 text-brand-primary" />
            <p className="text-sm leading-6 text-brand-subtext">
              Tip: complete your profile with LinkedIn and GitHub URLs so clients see stronger Trust Level signals on your proposal.
            </p>
          </div>
        </div>

        {error ? (
          <p className="rounded-xl border border-brand-border bg-brand-messageReceived px-3 py-2 text-sm text-brand-text">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="premium-button px-5 py-2.5 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? 'Sending...' : 'Send'}
        </button>
      </form>
    </section>
  )
}

export default SubmitProposal
