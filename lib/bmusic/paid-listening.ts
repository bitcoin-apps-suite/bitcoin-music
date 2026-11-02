import { NextResponse } from 'next/server'

/**
 * Kill switch for PAID per-second listening (owner approval, 2 Nov 2026). While true, the paid path
 * (POST /api/bmusic/stream and GET /api/bmusic/stream/payto) answers 503 before it reads, verifies,
 * broadcasts or records any payment. The sponsored path (/api/bmusic/stream/sponsored, paid from the
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
