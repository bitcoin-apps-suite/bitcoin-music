import { NextResponse } from 'next/server'
import { ProtoWallet, Utils } from '@bsv/sdk'
import { getOne, insert, query, upsert } from '@/lib/bmusic/db'
import {
  artistSlug,
  isEarlyBacker,
  isFoundingArtist,
  potSharePct,
  rankArtists,
  sponsoredPlaysLeft,
} from '@/lib/bmusic/programme'

/**
 * bMusic artist programme (bwalletX docs/ARTIST-PROGRAMME.md). OFF unless BMUSIC_ARTIST_PROGRAMME=1: every call
 * answers 503 until the owner says the server is clean and runs supabase/migrations/20261014_bmusic_artist_programme.sql.
 *
 * Writes are signed by the wallet's identity key over
 *   bmusic-artist|v1|<action>|slug=<slug>|identityKey=<k>|timestamp=<ms>
 * (BRC-43 [2,'bmusic artist'], key '1', counterparty 'anyone'; verified here against the derived 'anyone' key).
 * GET  ?slug  dashboard | public
 * POST claim {name} | tracks {tracks, potSharePct} | back {txids, sats, unlockHeight} (lock record only, not ranked)
 */
export const dynamic = 'force-dynamic'

const on = () => process.env.BMUSIC_ARTIST_PROGRAMME === '1'
const closed = () => NextResponse.json({ error: 'The artist programme is not open yet.' }, { status: 503 })
const bad = (error: string, status = 400) => NextResponse.json({ error }, { status })
const SLUG = /^[a-z0-9-]{2,40}$/
const KEY = /^0[23][0-9a-f]{64}$/i
const SKEW_MS = 5 * 60_000

type Artist = { slug: string; name: string; identity_key: string; joined_order: number; joined_at: string; pot_share_pct: number }
type Payment = { slug: string; payer_key: string; payer_name: string | null; sats: number; paid_at: string }
type Stat = { slug: string; plays_30d: number; new_listeners_30d: number; sales_sats: number; pot_sats: number; sponsored_plays: number; referral_owed_sats: number }

const DAY_MS = 86_400_000

/** Checks a createSignature(counterparty 'anyone') by the identity key, the BRC-100 way. */
async function verify(action: string, slug: string, identityKey: string, timestamp: number, sig: string): Promise<boolean> {
  try {
    const data = Utils.toArray(['bmusic-artist', 'v1', action, `slug=${slug}`, `identityKey=${identityKey}`, `timestamp=${timestamp}`].join('|'), 'utf8')
    const { valid } = await new ProtoWallet('anyone').verifySignature({
      data, signature: Utils.toArray(sig, 'hex'), protocolID: [2, 'bmusic artist'], keyID: '1', counterparty: identityKey,
    })
    return valid
  } catch {
    return false
  }
}

/** Rank = money paid to the artist in 30 days (linear), minus self-payments; locks play no part (lib/bmusic/programme.ts). */
async function ranked(): Promise<Map<string, number>> {
  const since = new Date(Date.now() - 30 * DAY_MS).toISOString()
  const [artists, stats, pays, linked] = await Promise.all([
    query<Artist>('bmusic_artists?select=slug,identity_key'),
    query<Stat>('bmusic_artist_stats?select=slug,sponsored_plays'),
    query<Payment>(`bmusic_artist_payments?paid_at=gte.${since}&select=slug,payer_key,sats`),
    query<{ slug: string; key: string }>('bmusic_artist_linked_keys?select=slug,key'),
  ])
  const rows = artists.map((a) => {
    const stat = stats.find((s) => s.slug === a.slug)
    return {
      slug: a.slug,
      payments30d: pays.filter((p) => p.slug === a.slug).map((p) => ({ payer: p.payer_key, sats: Number(p.sats) })),
      selfKeys: [a.identity_key, ...linked.filter((l) => l.slug === a.slug).map((l) => l.key)],
      // Sponsored plays (all time; capped at 1,000) count a little so new artists with no sales appear.
      sponsoredPlays30d: Number(stat?.sponsored_plays ?? 0),
    }
  })
  return new Map(rankArtists(rows).map((r, i) => [r.slug, i + 1]))
}

export async function GET(request: Request, { params }: { params: Promise<{ action: string }> }) {
  if (!on()) return closed()
  const { action } = await params
  const slug = new URL(request.url).searchParams.get('slug') ?? ''
  if (!SLUG.test(slug)) return bad('slug required')
  const artist = await getOne<Artist>('bmusic_artists', 'slug', slug)
  if (!artist) return bad('no such artist', 404)
  const stat = await getOne<Stat>('bmusic_artist_stats', 'slug', slug)
  const played = Number(stat?.sponsored_plays ?? 0)
  if (action === 'public') {
    // Backers = fans who paid the artist in 30 days; early backer = among the first 100 paying fans (all time).
    const [pays, linked] = await Promise.all([
      query<Payment>(`bmusic_artist_payments?slug=eq.${slug}&order=paid_at.asc&select=payer_key,payer_name,sats,paid_at`),
      query<{ key: string }>(`bmusic_artist_linked_keys?slug=eq.${slug}&select=key`),
    ])
    const self = new Set([artist.identity_key, ...linked.map((l) => l.key)])
    const order = new Map<string, number>()
    const recent = new Map<string, { name: string; sats: number }>()
    const since = Date.now() - 30 * DAY_MS
    for (const p of pays) {
      if (self.has(p.payer_key)) continue
      if (!order.has(p.payer_key)) order.set(p.payer_key, order.size + 1)
      if (Date.parse(p.paid_at) < since) continue
      const r = recent.get(p.payer_key) ?? { name: p.payer_name || `${p.payer_key.slice(0, 8)}…`, sats: 0 }
      r.sats += Number(p.sats)
      recent.set(p.payer_key, r)
    }
    const backers = [...recent.entries()].sort((x, y) => y[1].sats - x[1].sats).slice(0, 50)
    return NextResponse.json({
      sponsoredBy: sponsoredPlaysLeft(played) > 0 ? 'bwalletx' : null,
      sponsoredPlaysLeft: sponsoredPlaysLeft(played),
      founding: isFoundingArtist(artist.joined_order),
      backers: backers.map(([key, r]) => ({ name: r.name, earlyBacker: isEarlyBacker(order.get(key) ?? 0) })),
    })
  }
  if (action === 'dashboard') {
    return NextResponse.json({
      slug, name: artist.name, joinedOrder: artist.joined_order, founding: isFoundingArtist(artist.joined_order),
      plays30d: Number(stat?.plays_30d ?? 0), newListeners30d: Number(stat?.new_listeners_30d ?? 0),
      salesSats: Number(stat?.sales_sats ?? 0), potSats: Number(stat?.pot_sats ?? 0), potSharePct: artist.pot_share_pct,
      sponsoredPlaysLeft: sponsoredPlaysLeft(played), rank: (await ranked()).get(slug) ?? null,
      referralOwedSats: Number(stat?.referral_owed_sats ?? 0),
    })
  }
  return bad('unknown action', 404)
}

export async function POST(request: Request, { params }: { params: Promise<{ action: string }> }) {
  if (!on()) return closed()
  const { action } = await params
  let b: Record<string, unknown>
  try {
    b = await request.json()
  } catch {
    return bad('bad request')
  }
  const slug = String(b.slug ?? '')
  const identityKey = String(b.identityKey ?? '').toLowerCase()
  const timestamp = Number(b.timestamp)
  if (!SLUG.test(slug) || !KEY.test(identityKey) || !Number.isFinite(timestamp) || Math.abs(Date.now() - timestamp) > SKEW_MS)
    return bad('slug, identityKey and a fresh timestamp are required')
  if (!(await verify(action, slug, identityKey, timestamp, String(b.sig ?? '')))) return bad('bad signature', 401)

  if (action === 'claim') {
    const name = String(b.name ?? '').trim().slice(0, 80)
    if (artistSlug(name) !== slug) return bad('slug must match the name')
    const taken = await getOne<Artist>('bmusic_artists', 'slug', slug)
    if (taken) return taken.identity_key === identityKey ? NextResponse.json({ slug, joinedOrder: taken.joined_order }) : bad('that name is taken', 409)
    // joined_order comes from a sequence in the table default (first 100 = Founding artist).
    await insert('bmusic_artists', { slug, name, identity_key: identityKey, pot_share_pct: potSharePct(undefined) })
    const row = await getOne<Artist>('bmusic_artists', 'slug', slug)
    return NextResponse.json({ slug, joinedOrder: row?.joined_order ?? 0 })
  }

  const artist = await getOne<Artist>('bmusic_artists', 'slug', slug)
  if (!artist) return bad('no such artist', 404)

  if (action === 'tracks') {
    if (artist.identity_key !== identityKey) return bad('not your page', 403)
    const tracks = Array.isArray(b.tracks) ? b.tracks.slice(0, 200) : []
    for (const t of tracks as { trackId?: unknown; priceSats?: unknown; sponsored?: unknown }[]) {
      if (typeof t.trackId !== 'string' || !/^[0-9a-f]{64}_\d+$/i.test(t.trackId)) continue
      await upsert('bmusic_artist_tracks', {
        slug, track_id: t.trackId,
        price_sats: Math.max(0, Math.floor(Number(t.priceSats) || 0)),
        sponsored: t.sponsored !== false,
      }, 'track_id')
    }
    await upsert('bmusic_artists', { slug, pot_share_pct: potSharePct(b.potSharePct) }, 'slug')
    return NextResponse.json({ saved: tracks.length })
  }

  if (action === 'back') {
    const txids = Array.isArray(b.txids) ? b.txids.filter((t): t is string => typeof t === 'string' && /^[0-9a-f]{64}$/i.test(t)) : []
    const sats = Math.floor(Number(b.sats))
    const unlockHeight = Math.floor(Number(b.unlockHeight))
    if (!txids.length || !(sats > 0) || !(unlockHeight > 0)) return bad('txids, sats and unlockHeight required')
    // Recorded for the Locks screen only: locks are refundable, so they are never listed as backers or ranked.
    await insert('bmusic_artist_backings', {
      slug, backer_key: identityKey, txids, sats, unlock_height: unlockHeight,
      is_artist: artist.identity_key === identityKey, verified: false,
    })
    return NextResponse.json({ listed: false })
  }
  return bad('unknown action', 404)
}
