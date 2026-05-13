import { useEffect, useMemo, useState } from 'react'
import Loader from '../../components/Loader'
import EmptyState from '../../components/ui/EmptyState'
import PaymentExperienceModal from '../../components/ui/PaymentExperienceModal'
import TrustIndicator from '../../components/ui/TrustIndicator'
import { fetchClientProposals, updateProposalStatus } from '../../services/proposalService'
import { sendPaymentOTP, verifyPaymentOTP } from '../../services/paymentService'

const AllProposals = () => {
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

        setProposals(Array.isArray(data) ? data : [])
    } catch (err) {
      if (!active) return
      console.error('[AllProposals.loadProposals] error', err)
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
  }, [])

  const acceptingDefaultBudget = useMemo(() => {
    return Number(acceptingProposal?.job?.budget || 0)
  }, [acceptingProposal])

  const openAcceptModal = async (proposal) => {
    setAcceptingProposal(proposal)
    setEscrowAmount(String(Number(proposal?.job?.budget || 0)))
    setPaymentPhase('idle')

    // Send OTP for payment verification
    try {
      const amountValue = Number(proposal?.job?.budget || 0)
      await sendPaymentOTP(amountValue, proposal.job._id)
    } catch (err) {
      console.error('[AllProposals.openAcceptModal] OTP send failed', err)
      setError('Failed to send payment verification code')
    }
  }

  const closeAcceptModal = () => {
    setAcceptingProposal(null)
    setEscrowAmount('')
    setPaymentPhase('idle')
  }

  const handleReject = async (proposalId) => {
    try {
      setUpdatingId(proposalId)
      setError('')

      const response = await updateProposalStatus({ proposalId, status: 'rejected' })
      const updatedProposal = response?.proposal || response

      setProposals((previous) =>
        previous.map((proposal) =>
          proposal._id === proposalId ? updatedProposal : proposal,
        ),
      )
    } catch (err) {
      console.error('[AllProposals.handleReject] error', err)
      setError(err?.message || 'Failed to update proposal status')
    } finally {
      setUpdatingId('')
    }
  }

  const handlePayAndStart = async (otp) => {
    if (!acceptingProposal) return

    const proposalId = acceptingProposal._id
    const amountValue = Number(escrowAmount)

    if (Number.isNaN(amountValue) || amountValue < 0) {
      setError('Please enter a valid amount')
      return
    }

    try {
      setPaymentPhase('processing')
      setError('')

      // First verify the OTP
      await verifyPaymentOTP(otp)

      // Then accept the proposal
      const response = await updateProposalStatus({
        proposalId,
        status: 'accepted',
        amount: amountValue,
      })

      const updatedProposal = response?.proposal || response

      setProposals((previous) =>
        previous.map((proposal) =>
          proposal._id === proposalId ? updatedProposal : proposal,
        ),
      )

      setPaymentPhase('success')
      window.setTimeout(closeAcceptModal, 850)
    } catch (err) {
      console.error('[AllProposals.handlePayAndStart] error', err)
      setError(err?.message || 'Payment verification failed')
      setPaymentPhase('idle')
    }
  }

  if (loading) {
    return <Loader />
  }

  return (
    <section className="mx-auto w-full max-w-6xl space-y-5 text-brand-text">
      <div className="premium-card-premium p-6">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-brand-primary">Hiring queue</p>
        <h1 className="mt-2 text-3xl font-black premium-text-gradient">Proposals</h1>
        <p className="mt-2 text-sm text-brand-subtext">Review freelancer proposals, trust signals, and start escrowed projects.</p>
      </div>

      {error ? (
        <div className="rounded-2xl border border-brand-border bg-brand-messageReceived px-4 py-3 text-sm text-brand-text">
          {error}
        </div>
      ) : null}

      {proposals.length === 0 ? (
        <EmptyState title="No proposals yet" text="New freelancer proposals will appear here with trust signals and escrow actions." />
      ) : (
        <div className="grid gap-4">
          {proposals.map((proposal) => {
            const isPending = proposal.status === 'pending'
            const isUpdating = updatingId === proposal._id

            return (
              <article key={proposal._id} className="premium-card grid gap-5 p-5 lg:grid-cols-[1fr_19rem]">
                <div>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-subtext">Proposal for</p>
                      <h2 className="mt-1 text-lg font-black text-brand-text">
                      {proposal.job?.title || 'Untitled Job'}
                      </h2>
                      <p className="text-sm text-brand-subtext">
                        Freelancer: {proposal.freelancer?.name || 'Unknown'}
                      </p>
                    </div>

                    <span className="rounded-full border border-brand-border bg-brand-messageReceived px-3 py-1 text-xs font-bold text-brand-text capitalize">
                      {proposal.status}
                    </span>
                  </div>

                  <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-brand-text">{proposal.text}</p>

                  <div className="mt-4 flex flex-wrap items-center gap-2 text-sm font-semibold text-brand-subtext">
                    <span className="rounded-full bg-brand-background/70 px-3 py-1">Budget: INR {Number(proposal.job?.budget || 0).toLocaleString()}</span>
                  </div>

                  {isPending ? (
                    <div className="mt-5 flex flex-wrap items-center gap-2">
                      <button type="button" disabled={isUpdating} onClick={() => openAcceptModal(proposal)} className="premium-button px-4 py-2.5 disabled:cursor-not-allowed disabled:opacity-60">
                        Accept Proposal
                      </button>
                      <button type="button" disabled={isUpdating} onClick={() => handleReject(proposal._id)} className="premium-ghost-button px-4 py-2.5 disabled:cursor-not-allowed disabled:opacity-60">
                        Reject
                      </button>
                    </div>
                  ) : null}
                </div>
                <TrustIndicator freelancer={proposal.freelancer} proposal={proposal} />
              </article>
            )
          })}
        </div>
      )}

      <PaymentExperienceModal
        open={Boolean(acceptingProposal)}
        title={`Start ${acceptingProposal?.job?.title || 'project'}`}
        amount={escrowAmount}
        isProcessing={paymentPhase === 'processing'}
        isSuccess={paymentPhase === 'success'}
        error={error}
        onConfirm={handlePayAndStart}
        onCancel={closeAcceptModal}
      >
        <label htmlFor="escrow-amount" className="block text-sm font-bold text-brand-text">
              Amount
            </label>
            <input
              id="escrow-amount"
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

export default AllProposals
