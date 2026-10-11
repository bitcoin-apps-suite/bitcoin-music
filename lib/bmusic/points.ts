/**
 * bMusic Points: who gets paid when a sealed track plays (docs/STREAMING-SPEC.md §3).
 * v1 is fixed at artist 99 · bmusic 1. The format already allows more roles (holder, collaborators);
 * v1 refuses them so nothing is minted that the key server won't honour.
 */

export type PointsEntry = { role: 'artist' | 'bmusic'; to: string; pts: number }

export type PlayRule = {
  v: 1
  price: { usdCents: number }
  points: PointsEntry[]
  holderPlaysFree: true
  keyHash: string
  /** Base URL of the key server that sells plays (bMusic: https://bitcoin-music.vercel.app/api/bmusic). */
  keyService: string
  /** The track key, encrypted (BRC-2) by the minter's wallet to itself. Re-wrapped to each new owner on transfer. */
  keyWrap: { by: string; protocolID: [2, string]; keyID: string; ct: string }
}

export const PLAY_PRICE_USD_CENTS = 0.5
export const KEY_SERVICE = process.env.NEXT_PUBLIC_BMUSIC_KEY_SERVICE || 'https://bitcoin-music.vercel.app/api/bmusic'
export const KEY_PROTOCOL: [2, string] = [2, 'bmusic track key']
/** Artist → key server hand-off of a track key (BRC-2, keyID = origin, counterparty = server identity). */
export const REGISTER_PROTOCOL: [2, string] = [2, 'bmusic key register']

/**
 * Platform payee, set per deployment; sealed minting is off until it's set.
 * Either a P2PKH address, or `opns:<name>`: pay whoever the OpNS name points to at play time, so the
 * bMusic wallet can change without touching minted tracks. Intended value: `opns:bmusic`.
 */
export const BMUSIC_PAYEE = process.env.NEXT_PUBLIC_BMUSIC_PAYEE_ADDRESS ?? ''

const P2PKH = /^1[1-9A-HJ-NP-Za-km-z]{25,34}$/
/** OpNS names are lowercase; v1 allows them for bMusic's point only (the artist share stays a plain address). */
export const OPNS = /^opns:[a-z0-9][a-z0-9-]{0,62}$/

export function pointsV1(artistAddress: string, bmusicAddress = BMUSIC_PAYEE): PointsEntry[] {
  const points: PointsEntry[] = [
    { role: 'artist', to: artistAddress, pts: 99 },
    { role: 'bmusic', to: bmusicAddress, pts: 1 },
  ]
  const problem = checkPoints(points)
  if (problem) throw new Error(problem)
  return points
}

/** v1 rule: exactly artist 99 + bmusic 1, both valid addresses. Returns a problem string, or null. */
export function checkPoints(points: PointsEntry[]): string | null {
  if (points.length !== 2) return 'v1 Points are artist 99 · bMusic 1 only'
  const artist = points.find((p) => p.role === 'artist')
  const bmusic = points.find((p) => p.role === 'bmusic')
  if (!artist || !bmusic || artist.pts !== 99 || bmusic.pts !== 1) return 'v1 Points are artist 99 · bMusic 1 only'
  if (!P2PKH.test(artist.to)) return 'Artist payee is not a valid address'
  if (!P2PKH.test(bmusic.to) && !OPNS.test(bmusic.to)) return 'bMusic payee is not set (NEXT_PUBLIC_BMUSIC_PAYEE_ADDRESS: an address or opns:<name>)'
  return null
}

/** Split a play price in sats by points; sub-satoshi remainders go to the artist (first entry). */
export function splitSats(totalSats: number, points: PointsEntry[]): { to: string; sats: number }[] {
  const out = points.map((p) => ({ to: p.to, sats: Math.floor((totalSats * p.pts) / 100) }))
  out[0].sats += totalSats - out.reduce((n, o) => n + o.sats, 0)
  return out
}
