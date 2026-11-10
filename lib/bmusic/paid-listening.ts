import { NextResponse } from 'next/server'

/**
 * Kill switch for PAID listening (owner approval, 2 Nov 2026; per-play routes added under the CEO ruling
 * of the same day). While true, the paid paths answer 503 before they read, verify, broadcast or record
 * any payment: per-second (POST /api/bmusic/stream, GET /api/bmusic/stream/payto) and per-play
 * (POST /api/bmusic/quote, POST /api/bmusic/play). The sponsored path (/api/bmusic/stream/sponsored, paid from the
 * artist's sponsor pot) is not affected. A code constant, not an env var, so the change is reviewable.
 */
export const PAID_LISTENING_PAUSED = true

export const PAID_LISTENING_PAUSED_BODY = {
  error: 'paused',
  message: 'Paid listening is paused while we move to the new pay-as-you-listen model.',
} as const

/** The 503 the paid routes return while paused, or null when paid listening is open. */
export function paidListeningPaused(): NextResponse | null {
  return PAID_LISTENING_PAUSED ? NextResponse.json(PAID_LISTENING_PAUSED_BODY, { status: 503 }) : null
}

/**
 * Sponsored listening (POST /api/bmusic/stream/sponsored) is paused too (owner, 10 Nov 2026: "I don't think users should
 * be able to listen to full albums and tracks for free"). It handed out the key to every second of a full track, paid
 * from the artist's pot, to anyone who asked: free full audio for the listener. While true the route answers 503 before
 * it reads the body, spends from a pot or returns a key, and GET reports sponsored: false. Full tracks now come with a
 * right to listen (lib/listen/*). A code constant, not an env var, so the change is reviewable.
 */
export const SPONSORED_LISTENING_PAUSED = true

export const SPONSORED_LISTENING_PAUSED_BODY = {
  error: 'paused',
  message: 'Free full-track listening has ended. Previews stay free; buy the album or a track to hear it in full.',
} as const

/** The 503 the sponsored route returns while paused, or null when it is open. */
export function sponsoredListeningPaused(): NextResponse | null {
  return SPONSORED_LISTENING_PAUSED ? NextResponse.json(SPONSORED_LISTENING_PAUSED_BODY, { status: 503 }) : null
}
