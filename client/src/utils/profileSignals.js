const STORAGE_KEY = 'freelancehub:profile-signals'
const ANALYSIS_CACHE_KEY = 'freelancehub:trust-analysis-cache'
const CACHE_TTL_MS = 1000 * 60 * 60 * 6

const readStore = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
  } catch {
    return {}
  }
}

export const getProfileSignals = (email) => {
  if (!email) return {}
  const store = readStore()
  return store[email.toLowerCase()] || {}
}

export const saveProfileSignals = (email, signals) => {
  if (!email) return
  const normalizedEmail = email.toLowerCase()
  const store = readStore()
  store[normalizedEmail] = {
    ...(store[normalizedEmail] || {}),
    ...signals,
    updatedAt: new Date().toISOString(),
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
}

export const mergeProfileSignals = (profile = {}) => {
  const localSignals = getProfileSignals(profile.email)
  return {
    ...profile,
    ...localSignals,
    linkedinUrl: profile.linkedinUrl || profile.linkedin || localSignals.linkedinUrl || '',
    githubUrl: profile.githubUrl || profile.github || localSignals.githubUrl || '',
  }
}

export const extractGithubUsername = (githubUrl = '') => {
  const value = String(githubUrl || '').trim()
  if (!value) return ''

  const directMatch = value.match(/^[a-z\d](?:[a-z\d-]{0,37}[a-z\d])?$/i)
  if (directMatch) return value

  try {
    const parsed = new URL(value.startsWith('http') ? value : `https://${value}`)
    if (!parsed.hostname.toLowerCase().includes('github.com')) return ''
    const [username] = parsed.pathname.split('/').filter(Boolean)
    return username || ''
  } catch {
    return ''
  }
}

export const isValidLinkedInProfile = (linkedinUrl = '') => {
  const value = String(linkedinUrl || '').trim()
  if (!value) return false

  try {
    const parsed = new URL(value.startsWith('http') ? value : `https://${value}`)
    const host = parsed.hostname.toLowerCase()
    return host.includes('linkedin.com') && parsed.pathname.toLowerCase().startsWith('/in/')
  } catch {
    return false
  }
}

const readAnalysisCache = () => {
  try {
    return JSON.parse(localStorage.getItem(ANALYSIS_CACHE_KEY) || '{}')
  } catch {
    return {}
  }
}

const writeAnalysisCache = (cache) => {
  localStorage.setItem(ANALYSIS_CACHE_KEY, JSON.stringify(cache))
}

const scoreGithubAccount = ({ user, repos }) => {
  const repoCount = Number(user?.public_repos || 0)
  const followers = Number(user?.followers || 0)
  const accountAgeYears = user?.created_at
    ? Math.max(0, (Date.now() - new Date(user.created_at).getTime()) / (1000 * 60 * 60 * 24 * 365))
    : 0
  const nonForkRepos = repos.filter((repo) => !repo.fork)
  const stars = repos.reduce((sum, repo) => sum + Number(repo.stargazers_count || 0), 0)
  const recentActivity = repos.some((repo) => {
    if (!repo.pushed_at) return false
    return Date.now() - new Date(repo.pushed_at).getTime() < 1000 * 60 * 60 * 24 * 365
  })

  const score =
    Math.min(12, repoCount * 1.5) +
    Math.min(10, nonForkRepos.length * 2) +
    Math.min(8, followers * 1.5) +
    Math.min(8, stars * 1.2) +
    Math.min(7, accountAgeYears * 2) +
    (recentActivity ? 5 : 0)

  return {
    score: Math.round(Math.min(50, score)),
    repoCount,
    followers,
    stars,
    accountAgeYears: Math.round(accountAgeYears * 10) / 10,
    recentActivity,
  }
}

export const analyzeGithubProfile = async (githubUrl = '') => {
  const username = extractGithubUsername(githubUrl)
  if (!username) return null

  const cache = readAnalysisCache()
  const cached = cache[username]
  if (cached && Date.now() - cached.cachedAt < CACHE_TTL_MS) {
    return cached.analysis
  }

  const [userResponse, reposResponse] = await Promise.all([
    fetch(`https://api.github.com/users/${encodeURIComponent(username)}`),
    fetch(`https://api.github.com/users/${encodeURIComponent(username)}/repos?per_page=20&sort=updated`),
  ])

  if (!userResponse.ok || !reposResponse.ok) {
    throw new Error('GitHub analysis failed')
  }

  const user = await userResponse.json()
  const repos = await reposResponse.json()
  const analysis = {
    username,
    profileUrl: user.html_url,
    ...scoreGithubAccount({ user, repos: Array.isArray(repos) ? repos : [] }),
  }

  cache[username] = {
    cachedAt: Date.now(),
    analysis,
  }
  writeAnalysisCache(cache)

  return analysis
}

export const calculateTrustScore = (profile = {}, proposal = {}, externalAnalysis = {}) => {
  const merged = mergeProfileSignals(profile)
  const hasLinkedIn = isValidLinkedInProfile(merged.linkedinUrl)
  const hasGithub = Boolean(extractGithubUsername(merged.githubUrl))
  const githubAnalysis = externalAnalysis.github || null
  const hasName = Boolean(merged.name)
  const hasEmail = Boolean(merged.email)
  const isVerified = Boolean(merged.isVerified || merged.verified || merged.verificationStatus === 'verified')
  const hasPortfolio =
    Boolean(merged.portfolioUrl || merged.portfolio || merged.website) ||
    (Array.isArray(merged.portfolioItems) && merged.portfolioItems.length > 0) ||
    String(proposal.text || '').length > 180

  const baseScore =
    (hasName ? 12 : 0) +
    (hasEmail ? 12 : 0) +
    (hasLinkedIn ? 16 : 0) +
    (hasGithub ? 8 : 0) +
    (isVerified ? 18 : 0) +
    (hasPortfolio ? 18 : 0)

  const score = baseScore + (githubAnalysis?.score || 0)
  const normalized = Math.min(100, Math.max(20, score))
  const level = normalized >= 78 ? 'High trust' : normalized >= 52 ? 'Growing trust' : 'Needs review'
  const tone = normalized >= 78 ? 'emerald' : normalized >= 52 ? 'gold' : 'rose'

  return {
    score: normalized,
    level,
    tone,
    signals: [
      { label: 'LinkedIn', active: hasLinkedIn },
      { label: githubAnalysis ? `GitHub ${githubAnalysis.score}/50` : 'GitHub', active: hasGithub },
      { label: 'Profile', active: hasName && hasEmail },
      { label: 'Verified', active: isVerified },
      { label: 'Portfolio', active: hasPortfolio },
    ],
    githubAnalysis,
  }
}
