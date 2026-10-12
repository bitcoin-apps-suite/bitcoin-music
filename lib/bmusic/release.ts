/**
 * Mint-on-demand releases ("defensible, but extensible").
 * Anyone can mint a published stream as a 1/1 original by paying the artist's mint price. The buyer's own
 * wallet makes the inscription (a small release record, not the media: the media is the stream); the same
 * transaction pays the artist. v1: the buyer gets the ORIGINAL (owner key = free play forever, provenance,
 * resale); streaming income stays with the artist. `payee: 'holder'` is part of the record format but refused
 * until it is switched on deliberately (STREAMING-SPEC v2, phase 4).
 */
import { P2PKH, PublicKey, Utils } from '@bsv/sdk'
import { BRC29, serverIdentity, serverWallet, type StreamRow } from './server'

export const RELEASE_CONTENT_TYPE = 'application/vnd.bmusic.release+json'
export const OWNER_KEY_PROTOCOL: [2, string] = [2, 'bmusic owner key']
export const KEY_SERVICE = 'https://bitcoin-music.vercel.app/api/bmusic'
export const RESERVE_MS = 2 * 60_000

export type Release = {
  release_id: string; mint_price_sats: number | null; payee_mode: 'artist' | 'holder'
  reserved_by: string | null; reserved_until: string | null; minted_origin: string | null; minted_by: string | null; minted_at: string | null
}

/** The exact record the buyer inscribes. Stable for a release, so the server can check it byte for byte. */
export function releaseRecord(s: StreamRow & { title: string }, r: Release, kind: 'audio' | 'video') {
  return {
    bmusic: 'release',
    v: 2,
    releaseId: s.track_id,
    albumId: s.album_id,
    title: s.title,
    kind,
    edition: '1/1',
    artist: { identityKey: s.artist_identity, address: s.artist_address },
    play: {
      meter: { unit: 'second', sats: s.sats_per_segment },
      payee: r.payee_mode, // 'artist' in v1: streaming income goes to the artist, not the holder
      holderPlaysFree: true,
      stream: { manifest: `https://bitcoin-music.vercel.app/bmusic/streams/${s.album_id}/manifest.json`, trackId: s.track_id },
      keyService: KEY_SERVICE,
    },
  }
}

/** Where the mint price is paid: BRC-29 to the artist, sender = bMusic, prefix "bmusic-mint:<id>", suffix "1". */
export async function mintPayTo(s: StreamRow, price: number) {
  if (!s.artist_identity) {
    return { address: s.artist_address, lockingScript: new P2PKH().lock(s.artist_address).toHex(), sats: price }
  }
  const derivationPrefix = Utils.toBase64(Utils.toArray(`bmusic-mint:${s.track_id}`, 'utf8'))
  const derivationSuffix = Utils.toBase64(Utils.toArray('1', 'utf8'))
  const { publicKey } = await serverWallet().getPublicKey({ protocolID: BRC29, keyID: `${derivationPrefix} ${derivationSuffix}`, counterparty: s.artist_identity })
  const address = PublicKey.fromString(publicKey).toAddress()
  return { address, lockingScript: new P2PKH().lock(address).toHex(), sats: price, derivationPrefix, derivationSuffix, senderIdentityKey: await serverIdentity() }
}
