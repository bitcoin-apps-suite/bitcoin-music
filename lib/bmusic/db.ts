/**
 * Minimal PostgREST calls for the bMusic key server (self-hosted Supabase, service role). Server-side only.
 * No supabase-js: this repo can't add it (blocked exotic subdependency), and these four calls are all we need.
 */
const base = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error('NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set')
  return { url: `${url}/rest/v1`, headers: { apikey: key, authorization: `Bearer ${key}`, 'content-type': 'application/json' } }
}

async function call<T>(path: string, init: RequestInit & { prefer?: string } = {}): Promise<T> {
  const { url, headers } = base()
  const r = await fetch(`${url}/${path}`, {
    ...init,
    cache: 'no-store',
    headers: { ...headers, ...(init.prefer ? { prefer: init.prefer } : {}) },
  })
  const text = await r.text()
  if (!r.ok) throw new Error(JSON.parse(text || '{}').message ?? `database error ${r.status}`)
  return (text ? JSON.parse(text) : null) as T
}

const eq = (v: string) => `eq.${encodeURIComponent(v)}`

export async function getOne<T>(table: string, col: string, value: string, select = '*'): Promise<T | null> {
  const rows = await call<T[]>(`${table}?${col}=${eq(value)}&select=${select}&limit=1`)
  return rows[0] ?? null
}

export async function insert(table: string, row: object): Promise<void> {
  await call(table, { method: 'POST', body: JSON.stringify(row), prefer: 'return=minimal' })
}

export async function upsert(table: string, row: object, onConflict: string): Promise<void> {
  await call(`${table}?on_conflict=${onConflict}`, { method: 'POST', body: JSON.stringify(row), prefer: 'resolution=merge-duplicates,return=minimal' })
}

/** Update rows matching every filter; returns the updated rows (empty = nothing matched, e.g. lost a race). */
export async function updateWhere<T>(table: string, filters: Record<string, string>, patch: object): Promise<T[]> {
  const q = Object.entries(filters).map(([k, v]) => `${k}=${eq(v)}`).join('&')
  return call<T[]>(`${table}?${q}`, { method: 'PATCH', body: JSON.stringify(patch), prefer: 'return=representation' })
}
