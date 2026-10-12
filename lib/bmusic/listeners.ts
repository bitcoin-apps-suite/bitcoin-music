/**
 * Listener boards: opt-in attribution of anonymous listening sessions to a wallet identity, fan scores and
 * badges, all computed from the per-second payment rows. Nothing here is a token; badges are labels.
 */
import { ProtoWallet, Utils } from '@bsv/sdk'
import { rpc } from './db'

export const CLAIM_PROTOCOL: [2, string] = [2, 'bmusic listen claim']
export const ARTIST_AUTH_PROTOCOL: [2, string] = [2, 'bmusic artist auth']
const anyone = new ProtoWallet('anyone')

/**
 * Verify a BRC-3 signature made by `identityKey`'s wallet with createSignature({ protocolID, keyID,
 * counterparty: 'anyone', data: utf8(message) }). `ts` (ms) must be within 5 minutes.
 */
export async function verifyWalletSig(identityKey: string, protocolID: [2, string], keyID: string, message: string, sigHex: string, ts: number) {
  if (!Number.isFinite(ts) || Math.abs(Date.now() - ts) > 5 * 60_000) return false
  try {
    const { valid } = await anyone.verifySignature({
      data: Utils.toArray(message, 'utf8'), signature: Utils.toArray(sigHex, 'hex'), protocolID, keyID, counterparty: identityKey,
    })
    return valid
  } catch {
    return false
  }
}

export type Stats = {
  listener: string; claimed: boolean; handle: string | null; seconds_total: number; seconds_self_paid: number; seconds_sponsored: number
  sats_self_paid: number; completed_tracks: number; distinct_tracks: number; first_at: string; last_at: string; first_claim_rank: number | null
}

export const fanScore = (s: Stats) => Number(s.seconds_self_paid) + 0.25 * Number(s.seconds_sponsored) + 60 * Number(s.completed_tracks)

/** Artist-only signal: mostly sponsored seconds and little finished listening. Never shown publicly. */
export const potDrain = (s: Stats) =>
  Number(s.seconds_total) >= 300 && Number(s.seconds_sponsored) / Number(s.seconds_total) > 0.9 && Number(s.completed_tracks) === 0

export async function albumStats(albumId: string, window: string) {
  const days = window === '7d' ? 7 : window === '30d' ? 30 : 0
  const since = days ? new Date(Date.now() - days * 86_400_000).toISOString() : '1970-01-01T00:00:00Z'
  const rows = await rpc<Stats[]>('bmusic_listener_stats', { p_album: albumId, p_since: since })
  const tracks = 12
  const claimed = rows.filter((r) => r.claimed).sort((a, b) => fanScore(b) - fanScore(a))
  const topSelf = [...claimed].sort((a, b) => Number(b.seconds_self_paid) - Number(a.seconds_self_paid))[0]
  const badges = (r: Stats, i: number) => [
    ...(i === 0 ? ['Top listener'] : []),
    ...(topSelf && r === topSelf && Number(r.seconds_self_paid) > 0 ? ['Superfan'] : []),
    ...(r.first_claim_rank !== null && Number(r.first_claim_rank) <= 100 ? ['First 100'] : []),
    ...(Number(r.completed_tracks) >= tracks ? ['Completed the album'] : []),
  ]
  const anon = rows.filter((r) => !r.claimed)
  return { rows, claimed, badges, anonCount: anon.length, anonSeconds: anon.reduce((n, r) => n + Number(r.seconds_total), 0) }
}

export const publicEntry = (r: Stats, i: number, badges: string[]) => ({
  rank: i + 1, identityKey: r.listener, handle: r.handle, fanScore: Math.round(fanScore(r)),
  secondsTotal: Number(r.seconds_total), secondsSelfPaid: Number(r.seconds_self_paid), secondsSponsored: Number(r.seconds_sponsored),
  completedTracks: Number(r.completed_tracks), distinctTracks: Number(r.distinct_tracks), badges,
})
