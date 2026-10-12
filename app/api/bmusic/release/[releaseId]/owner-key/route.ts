import { NextResponse } from 'next/server'
import { Utils } from '@bsv/sdk'
import { getOne } from '@/lib/bmusic/db'
import { ARTIST_AUTH_PROTOCOL, verifyWalletSig } from '@/lib/bmusic/listeners'
import { OWNER_KEY_PROTOCOL, type Release } from '@/lib/bmusic/release'
import { openAtRest, serverIdentity, serverWallet, type StreamRow } from '@/lib/bmusic/server'

export const dynamic = 'force-dynamic'

/**
 * Re-fetch the owner key (e.g. a new device). GET ?identityKey&ts&sig, sig = createSignature({ protocolID:
 * [2,'bmusic artist auth'], keyID: String(ts), counterparty: 'anyone', data: utf8("owner:<releaseId>:<ts>") }).
 * v1: the buyer recorded at mint. Transfer (rewrap to the current holder on proof of ownership) is spec v2.
 */
export async function GET(request: Request, { params }: { params: Promise<{ releaseId: string }> }) {
  const { releaseId } = await params
  const q = new URL(request.url).searchParams
  const identityKey = q.get('identityKey') ?? ''
  const ts = Number(q.get('ts'))
  if (!(await verifyWalletSig(identityKey, ARTIST_AUTH_PROTOCOL, String(ts), `owner:${releaseId}:${ts}`, q.get('sig') ?? '', ts)))
    return NextResponse.json({ error: 'bad signature' }, { status: 401 })
  const r = await getOne<Release>('bmusic_releases', 'release_id', releaseId)
  if (!r?.minted_by || r.minted_by !== identityKey) return NextResponse.json({ error: 'not the owner of this release' }, { status: 403 })
  const s = (await getOne<StreamRow>('bmusic_streams', 'track_id', releaseId))!
  const secret = openAtRest(s.secret_enc)
  const { ciphertext } = await serverWallet().encrypt({ plaintext: Array.from(secret), protocolID: OWNER_KEY_PROTOCOL, keyID: releaseId, counterparty: identityKey })
  secret.fill(0)
  return NextResponse.json({ origin: r.minted_origin, ownerKey: Utils.toBase64(ciphertext), protocolID: OWNER_KEY_PROTOCOL, keyID: releaseId, serverIdentityKey: await serverIdentity() })
}

export function OPTIONS() {
  return new Response(null, { status: 204 })
}
