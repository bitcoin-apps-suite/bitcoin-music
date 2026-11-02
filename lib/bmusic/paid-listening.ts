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
