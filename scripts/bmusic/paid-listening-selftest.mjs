// Selftest for the paid-listening kill switch (no DB, no env, no network beyond the URL given).
// Usage: node scripts/bmusic/paid-listening-selftest.mjs http://127.0.0.1:3917
// Checks that both PAID routes answer 503 {error:'paused'} and the sponsored route is not paused.
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
// Sponsored path must not be paused (a bad signature gets 401 before any DB or pot access).
await check('POST /api/bmusic/stream/sponsored (bad sig)', await fetch(`${base}/api/bmusic/stream/sponsored`, {
  method: 'POST', headers: { 'content-type': 'application/json' },
  body: JSON.stringify({ trackId: 'first-12-01', segment: 0, listener: '02' + '11'.repeat(32), sig: '00' }),
}), false)
process.exit(fail ? 1 : 0)
