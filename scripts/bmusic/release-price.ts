/**
 * Set a release's mint price (the artist decides; null = not for sale).
 *   pnpm exec tsx --env-file=.env.local scripts/bmusic/release-price.ts <releaseId|albumId> <usd|none>
 * An album id sets every track in it. The price is fixed in sats at today's rate.
 */
import { query, updateWhere } from '../../lib/bmusic/db'
import { usdPerBsv } from '../../lib/bmusic/server'

async function main() {
  const [id, price] = process.argv.slice(2)
  const tracks = await query<{ track_id: string }>(`bmusic_streams?or=(track_id.eq.${id},album_id.eq.${id})&select=track_id`)
  if (!tracks.length) throw new Error(`no release or album ${id}`)
  const usd = price === 'none' ? 0 : await usdPerBsv()
  const sats = price === 'none' ? null : Math.round((Number(price) / usd) * 1e8)
  for (const t of tracks) await updateWhere('bmusic_releases', { release_id: t.track_id }, { mint_price_sats: sats })
  console.log(`${tracks.length} release(s) → ${sats === null ? 'not for sale' : `$${price} = ${sats} sats at $${usd}/BSV`}`)
}
main().catch((e) => {
  console.error(e instanceof Error ? e.message : e)
  process.exit(1)
})
