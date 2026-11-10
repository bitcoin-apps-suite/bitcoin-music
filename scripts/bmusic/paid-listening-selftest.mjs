// Selftest for the paid-listening kill switch (no DB, no env, no network beyond the URL given).
// Usage: node scripts/bmusic/paid-listening-selftest.mjs http://127.0.0.1:3917
// Checks that every PAID route (per-second: stream, stream/payto; per-play: quote, play) answers
// 503 {error:'paused'}, and that the sponsored (free full-track) route is paused as well.
const base = process.argv[2] || 'http://127.0.0.1:3917'
const want = { error: 'paused', message: 'Paid listening is paused while we move to the new pay-as-you-listen model.' }
let fail = 0
async function check(name, res, expectPaused) {
  const body = await res.json().catch(() => null)
  const paused = res.status === 503 && body?.error === want.error && body?.message === want.message
  const ok = expectPaused ? paused : !paused
  console.log(`${ok ? 'PASS' : 'FAIL'} ${name}: ${res.status} ${JSON.stringify(body)}`)
  if (!ok) fail++
}
await check('GET /api/bmusic/stream/payto', await fetch(`${base}/api/bmusic/stream/payto?trackId=first-12-07&segment=0`), true)
await check('POST /api/bmusic/stream', await fetch(`${base}/api/bmusic/stream`, {
  method: 'POST', headers: { 'content-type': 'application/json' },
  body: JSON.stringify({ trackId: 'first-12-07', segment: 0, rawTx: '00', listener: '02' + '11'.repeat(32), sig: '00' }),
}), true)
// Per-play paid path (CEO ruling, 2 Nov 2026): no quote is issued and no play payment is verified or broadcast.
await check('POST /api/bmusic/quote', await fetch(`${base}/api/bmusic/quote`, {
  method: 'POST', headers: { 'content-type': 'application/json' },
  body: JSON.stringify({ origin: '00'.repeat(32) + '_0', identityKey: '02' + '11'.repeat(32) }),
}), true)
await check('POST /api/bmusic/play', await fetch(`${base}/api/bmusic/play`, {
  method: 'POST', headers: { 'content-type': 'application/json' },
  body: JSON.stringify({ reference: '00'.repeat(16), rawTx: '00' }),
}), true)
// Sponsored (free full-track) path is paused too (owner, 10 Nov 2026): 503 before any signature, DB or pot access.
{
  const res = await fetch(`${base}/api/bmusic/stream/sponsored`, {
    method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ trackId: 'first-12-01', segment: 0, listener: '02' + '11'.repeat(32), sig: '00' }),
  })
  const body = await res.json().catch(() => null)
  const ok = res.status === 503 && body?.error === 'paused'
  console.log(`${ok ? 'PASS' : 'FAIL'} POST /api/bmusic/stream/sponsored: ${res.status} ${JSON.stringify(body)}`)
  if (!ok) fail++
}
process.exit(fail ? 1 : 0)
