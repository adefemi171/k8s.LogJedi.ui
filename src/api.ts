export type Analysis = {
  analysis_id?: string
  timestamp?: string
  resource_kind?: string
  resource_name?: string
  namespace?: string
  reason?: string
  summary?: string
  root_cause?: string
  recommendation?: string
  action?: {
    type?: string
    target?: { kind?: string; namespace?: string; name?: string }
    patch?: Record<string, unknown>
  } | null
  usage?: {
    estimated_tokens?: number
    estimated_cost_usd?: number
  } | null
}

export type Report = {
  analysis_id?: string
  timestamp?: string
  resource_kind?: string
  resource_name?: string
  namespace?: string
  reason?: string
  steps?: Array<{ step?: number; timestamp?: string; message?: string }>
}

function trimSlash(url: string): string {
  return url.replace(/\/+$/, '')
}

/** Base URL for LLM service. Empty = use Vite `/api` proxy in dev. */
export function getApiBase(): string {
  const fromEnv = (import.meta.env.VITE_LLM_API_URL as string | undefined)?.trim()
  if (fromEnv) return trimSlash(fromEnv)
  return '/api'
}

export function getStoredAuth(): string {
  return localStorage.getItem('logjedi.auth') || ''
}

export function setStoredAuth(value: string): void {
  if (value) localStorage.setItem('logjedi.auth', value)
  else localStorage.removeItem('logjedi.auth')
}

async function apiFetch<T>(path: string, authHeader: string): Promise<T> {
  const headers: Record<string, string> = { Accept: 'application/json' }
  if (authHeader) headers.Authorization = authHeader

  const res = await fetch(`${getApiBase()}${path}`, { headers })
  if (!res.ok) {
    const detail = await res.text().catch(() => '')
    throw new Error(`${res.status} ${res.statusText}${detail ? `: ${detail}` : ''}`)
  }
  return res.json() as Promise<T>
}

export function fetchAnalyses(limit = 50, authHeader = getStoredAuth()) {
  return apiFetch<Analysis[]>(`/analyses?limit=${limit}`, authHeader)
}

export function fetchReports(limit = 50, authHeader = getStoredAuth()) {
  return apiFetch<Report[]>(`/reports?limit=${limit}`, authHeader)
}

export function fetchHealth() {
  return apiFetch<{ status?: string }>('/health', '')
}
