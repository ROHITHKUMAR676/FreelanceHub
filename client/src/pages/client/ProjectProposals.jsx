import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import EmptyState from '../../components/ui/EmptyState'
import PaymentExperienceModal from '../../components/ui/PaymentExperienceModal'
import Skeleton from '../../components/ui/Skeleton'
import TrustIndicator from '../../components/ui/TrustIndicator'
import { fetchClientProposals, updateProposalStatus } from '../../services/proposalService'

const ProjectProposals = () => {
  const { projectId } = useParams()

  const [proposals, setProposals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [updatingId, setUpdatingId] = useState('')

  const [acceptingProposal, setAcceptingProposal] = useState(null)
  const [escrowAmount, setEscrowAmount] = useState('')
  const [paymentPhase, setPaymentPhase] = useState('idle')

  useEffect(() => {
    let active = true

    const loadProposals = async () => {
      try {
        setLoading(true)
        setError('')

        const data = await fetchClientProposals()
        if (!active) return

        const safe = Array.isArray(data) ? data : []
        setProposals(safe.filter((proposal) => proposal.job?._id === projectId))
      } catch (err) {
        if (!active) return
        console.error('[ProjectProposals.loadProposals] error', err)
        setError(err?.message || 'Failed to load proposals')
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    loadProposals()

    return () => {
      active = false
    }
  }, [projectId])

  const acceptingDefaultBudget = useMemo(() => {
    return Number(acceptingProposal?.job?.budget || 0)
  }, [acceptingProposal])

  const openAcceptModal = (proposal) => {
    setAcceptingProposal(proposal)
    setEscrowAmount(String(Number(proposal?.job?.budget || 0)))
    setPaymentPhase('idle')
  }

  const closeAcceptModal = () => {
    setAcceptingProposal(null)
    setEscrowAmount('')
    setPaymentPhase('idle')
  }

  const handleStatusUpdate = async ({ proposalId, status, amount }) => {
    try {
      setUpdatingId(proposalId)
      if (status === 'accepted') setPaymentPhase('processing')
      setError('')

      const response = await updateProposalStatus({ proposalId, status, amount })
      const updated = response?.proposal || response

      setProposals((previous) =>
        previous.map((proposal) => (proposal._id === proposalId ? updated : proposal)),
      )

      if (status === 'accepted') {
        setPaymentPhase('success')
        window.setTimeout(closeAcceptModal, 850)
      }
    } catch (err) {
      console.error('[ProjectProposals.handleStatusUpdate] error', err)
      setError(err?.message || 'Failed to update proposal status')
      setPaymentPhase('idle')
    } finally {
      setUpdatingId('')
    }
  }

  return (
    <section className="mx-auto w-full max-w-6xl space-y-5 text-brand-text">
      <div className="premium-card-premium p-6">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-brand-primary">Project shortlist</p>
        <h1 className="mt-2 text-3xl font-black premium-text-gradient">Project Proposals</h1>
        <p className="mt-2 text-sm text-brand-subtext">Evaluate candidates with trust signals and escrow-ready actions.</p>
      </div>

      {loading ? (
        <div className="grid gap-4">
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
        </div>
      ) : null}

      {!loading && error ? (
        <div className="rounded-2xl border border-brand-border bg-brand-messageReceived p-5 text-sm text-brand-text">
          {error}
        </div>
      ) : null}

      {!loading && !error && proposals.length === 0 ? (
        <EmptyState title="No proposals for this job yet" text="When freelancers apply, their proposals and trust indicators will appear here." />
      ) : null}

      {!loading && !error && proposals.length > 0 ? (
        <div className="grid gap-4">
          {proposals.map((proposal) => (
            <article key={proposal._id} className="premium-card grid gap-5 p-5 lg:grid-cols-[1fr_19rem]">
              <div>
                <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-lg font-black text-brand-text">
                    {proposal.freelancer?.name || 'Freelancer'}
                  </p>
                  <p className="text-sm text-brand-subtext">{proposal.freelancer?.email || 'No email'}</p>
                </div>

                <span className="rounded-full border border-brand-border bg-brand-messageReceived px-3 py-1 text-xs font-bold capitalize text-brand-text">
                  {proposal.status}
                </span>
              </div>

              <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-brand-text">{proposal.text}</p>

              {proposal.status === 'pending' ? (
                <div className="mt-5 flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => openAcceptModal(proposal)}
                    disabled={updatingId === proposal._id}
                    className="premium-button px-4 py-2.5 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Accept Proposal
                  </button>
                  <button
                    type="button"
                    onClick={() => handleStatusUpdate({ proposalId: proposal._id, status: 'rejected' })}
                    disabled={updatingId === proposal._id}
                    className="premium-ghost-button px-4 py-2.5 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Reject
                  </button>
                </div>
              ) : null}
              </div>
              <TrustIndicator freelancer={proposal.freelancer} proposal={proposal} />
            </article>
          ))}
        </div>
      ) : null}

      <PaymentExperienceModal
        open={Boolean(acceptingProposal)}
        title={`Start ${acceptingProposal?.job?.title || 'project'}`}
        amount={escrowAmount}
        isProcessing={paymentPhase === 'processing'}
        isSuccess={paymentPhase === 'success'}
        error={error}
        onCancel={closeAcceptModal}
        onConfirm={() =>
          handleStatusUpdate({
            proposalId: acceptingProposal._id,
            status: 'accepted',
            amount: Number(escrowAmount),
          })
        }
      >
        <label htmlFor="project-escrow-amount" className="block text-sm font-bold text-brand-text">
              Amount
            </label>
            <input
              id="project-escrow-amount"
              type="number"
              min="0"
              value={escrowAmount}
              onChange={(event) => setEscrowAmount(event.target.value)}
              placeholder={String(acceptingDefaultBudget)}
              className="app-input mt-2"
            />
      </PaymentExperienceModal>
    </section>
  )
}

export default ProjectProposals
