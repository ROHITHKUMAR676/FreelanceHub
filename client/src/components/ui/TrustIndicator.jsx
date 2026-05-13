import { useEffect, useState } from 'react'
import { CheckCircle2, Github, Linkedin, ShieldCheck } from 'lucide-react'
import { analyzeGithubProfile, calculateTrustScore, mergeProfileSignals } from '../../utils/profileSignals'

const toneMap = {
  emerald: {
    ring: '#36c78c',
    className: 'from-emerald-500/15 to-teal-400/10 text-emerald-500 border-emerald-400/30',
  },
  gold: {
    ring: '#f6c453',
    className: 'from-yellow-500/15 to-orange-400/10 text-yellow-600 border-yellow-400/30',
  },
  rose: {
    ring: '#ff3d8b',
    className: 'from-rose-500/15 to-red-400/10 text-rose-500 border-rose-400/30',
  },
}

const TrustIndicator = ({ freelancer, proposal }) => {
  const [githubAnalysis, setGithubAnalysis] = useState(null)
  const [analysisState, setAnalysisState] = useState('idle')
  const mergedFreelancer = mergeProfileSignals(freelancer)
  const trust = calculateTrustScore(freelancer, proposal, { github: githubAnalysis })
  const tone = toneMap[trust.tone]
  const circle = {
    background: `conic-gradient(${tone.ring} ${trust.score * 3.6}deg, rgba(148,163,184,0.22) 0deg)`,
  }

  useEffect(() => {
    let active = true

    const runAnalysis = async () => {
      if (!mergedFreelancer.githubUrl) {
        setGithubAnalysis(null)
        setAnalysisState('idle')
        return
      }

      try {
        setAnalysisState('loading')
        const analysis = await analyzeGithubProfile(mergedFreelancer.githubUrl)
        if (!active) return
        setGithubAnalysis(analysis)
        setAnalysisState(analysis ? 'done' : 'idle')
      } catch {
        if (!active) return
        setGithubAnalysis(null)
        setAnalysisState('error')
      }
    }

    runAnalysis()

    return () => {
      active = false
    }
  }, [mergedFreelancer.githubUrl])

  return (
    <div className={`group relative rounded-2xl border bg-gradient-to-br px-4 py-3 ${tone.className}`}>
      <div className="flex items-center gap-3">
        <div className="grid h-14 w-14 place-items-center rounded-full" style={circle}>
          <div className="grid h-11 w-11 place-items-center rounded-full bg-brand-surface text-sm font-black text-brand-text">
            {trust.score}
          </div>
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} />
            <p className="text-sm font-bold">{trust.level}</p>
          </div>
          <p className="mt-1 text-xs text-brand-subtext">
            {analysisState === 'loading' ? 'Analyzing GitHub activity...' : 'Trust Level based on analyzed signals'}
          </p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {trust.signals.map((signal) => (
          <span
            key={signal.label}
            className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-[11px] font-semibold ${
              signal.active
                ? 'border-brand-emerald/30 bg-brand-emerald/10 text-brand-emerald'
                : 'border-brand-border bg-brand-surface/60 text-brand-subtext'
            }`}
          >
            {signal.label === 'LinkedIn' ? <Linkedin size={11} /> : signal.label === 'GitHub' ? <Github size={11} /> : <CheckCircle2 size={11} />}
            {signal.label}
          </span>
        ))}
      </div>

      <div className="pointer-events-none absolute right-0 top-full z-20 mt-2 w-72 rounded-2xl border border-brand-border bg-brand-surface/95 p-3 text-xs leading-5 text-brand-subtext opacity-0 shadow-lift backdrop-blur-xl transition group-hover:opacity-100">
        {githubAnalysis ? (
          <>
            GitHub analyzed: {githubAnalysis.repoCount} repos, {githubAnalysis.followers} followers, {githubAnalysis.stars} stars, {githubAnalysis.accountAgeYears} years old, {githubAnalysis.recentActivity ? 'recent activity found' : 'limited recent activity'}.
          </>
        ) : analysisState === 'error' ? (
          'GitHub analysis could not be completed right now. Score falls back to validated profile signals.'
        ) : (
          'Score uses validated LinkedIn URL, GitHub username detection, profile basics, verification fields, portfolio indicators, and proposal detail. GitHub is analyzed when a public profile is available.'
        )}
      </div>
    </div>
  )
}

export default TrustIndicator
