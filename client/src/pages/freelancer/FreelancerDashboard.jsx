import { Link } from 'react-router-dom'

const browseProjects = [
  {
    id: 'f-301',
    title: 'SaaS Marketing Website',
    budget: '$700 - $1000',
  },
  {
    id: 'f-302',
    title: 'React + Node Booking App',
    budget: '$1200 - $1600',
  },
]

const myProposals = [
  {
    id: 'mp-1',
    projectTitle: 'SaaS Marketing Website',
    status: 'Pending',
  },
  {
    id: 'mp-2',
    projectTitle: 'React + Node Booking App',
    status: 'Shortlisted',
  },
]

const FreelancerDashboard = () => {
  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      <div className="premium-card-premium p-6 premium-card-hover">
        <h1 className="text-3xl font-bold tracking-tight premium-text-gradient animate-fade-up">Freelancer Dashboard</h1>
        <p className="mt-2 text-sm text-brand-subtext">Browse projects, track proposals, and monitor earnings.</p>
      </div>

      <section className="premium-card-premium p-6 premium-card-hover">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-xl font-semibold premium-text-gradient">Browse Projects</h2>
          <Link
            to="/freelancer/browse-jobs"
            className="premium-button-gold animate-bounce-subtle"
          >
            Browse Projects
          </Link>
        </div>
        <div className="mt-4 space-y-3 stagger-in">
          {browseProjects.map((project) => (
            <div key={project.id} className="rounded-2xl border border-brand-border bg-brand-surface/70 p-4 transition duration-300 hover:-translate-y-0.5 hover:border-brand-primary/30 hover:bg-brand-surface hover:shadow-panel">
              <p className="text-base font-medium text-brand-text">{project.title}</p>
              <p className="mt-1 text-sm text-brand-subtext">{project.budget}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="premium-card p-5">
        <h2 className="text-lg font-semibold text-brand-text">My Proposals</h2>
        <div className="mt-4 space-y-3 stagger-in">
          {myProposals.map((proposal) => (
            <div key={proposal.id} className="rounded-2xl border border-brand-border bg-brand-messageSent/80 p-4 transition duration-300 hover:-translate-y-0.5 hover:border-brand-primary/30 hover:bg-brand-surface hover:shadow-panel">
              <p className="text-base font-medium text-brand-text">{proposal.projectTitle}</p>
              <p className="mt-1 text-sm text-brand-subtext">{proposal.status}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="premium-card p-5">
        <h2 className="text-lg font-semibold text-brand-text">Earnings</h2>
        <div className="mt-4 rounded-2xl border border-brand-border bg-brand-surface/80 p-4 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-panel">
          <p className="text-sm text-brand-subtext">Total Earnings</p>
          <p className="mt-1 text-2xl font-semibold text-brand-text">$0.00</p>
          <p className="mt-1 text-sm text-brand-subtext">Placeholder until payouts are connected.</p>
        </div>
      </section>
    </div>
  )
}

export default FreelancerDashboard

