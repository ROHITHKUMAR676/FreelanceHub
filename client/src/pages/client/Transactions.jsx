import { useEffect, useState } from 'react'
import EmptyState from '../../components/ui/EmptyState'
import Skeleton from '../../components/ui/Skeleton'
import { fetchClientTransactions } from '../../services/paymentService'

const Transactions = () => {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    const loadTransactions = async () => {
      try {
        setLoading(true)
        setError('')

        const data = await fetchClientTransactions()
        if (!active) return

        setTransactions(Array.isArray(data) ? data : [])
      } catch (err) {
        if (!active) return
        setError(err?.message || 'Failed to load transactions')
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    loadTransactions()

    return () => {
      active = false
    }
  }, [])

  return (
    <section className="mx-auto w-full max-w-6xl space-y-5 text-brand-text">
      <div className="premium-card-premium p-6">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-brand-primary">Escrow ledger</p>
        <h1 className="mt-2 text-3xl font-black premium-text-gradient">Transactions</h1>
        <p className="mt-2 text-sm text-brand-subtext">Escrow records for accepted proposals and active projects.</p>
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
      ) : null}

      {!loading && error ? (
        <div className="rounded-2xl border border-brand-border bg-brand-messageReceived p-5 text-sm text-brand-text">
          {error}
        </div>
      ) : null}

      {!loading && !error && transactions.length === 0 ? (
        <EmptyState title="No transactions yet" text="Accepted proposals will create escrow records here." />
      ) : null}

      {!loading && !error && transactions.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {transactions.map((transaction) => (
            <article
              key={transaction._id}
              className="premium-card p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-black text-brand-text">
                    {transaction.job?.title || 'Job'}
                  </h2>
                  <p className="text-sm text-brand-subtext">
                    Freelancer: {transaction.freelancer?.name || 'Unknown'}
                  </p>
                </div>

                <span className="rounded-full border border-brand-emerald/30 bg-brand-emerald/10 px-3 py-1 text-xs font-bold capitalize text-brand-emerald">
                  {transaction.status}
                </span>
              </div>

              <p className="mt-5 text-2xl font-black text-brand-text">
                INR {Number(transaction.amount || 0).toLocaleString()}
              </p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-brand-subtext">Escrow amount</p>
            </article>
          ))}
        </div>
      ) : null}
    </section>
  )
}

export default Transactions
