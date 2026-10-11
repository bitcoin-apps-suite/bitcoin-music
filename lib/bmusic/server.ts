/**
 * bMusic key server v1, server side only (docs/STREAMING-SPEC.md §5–6).
 *
 * The server is bMusic's wallet: BMUSIC_SERVER_WIF is its identity key. It
 *  - receives track keys from artists (wrapped to it with BRC-2) and stores them encrypted at rest,
 *  - quotes plays: the outputs a play transaction must contain (artist P2PKH + bMusic's own BRC-29 output),
 *  - checks a play transaction against its quote, broadcasts it, and returns the track key wrapped to the listener.
 * It never holds anyone else's money or keys. Env: BMUSIC_SERVER_WIF, BMUSIC_KEYSTORE_SECRET (64 hex).
 */
import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'node:crypto'
import { P2PKH, PrivateKey, ProtoWallet, PublicKey, Script, Transaction, Utils } from '@bsv/sdk'
import { checkPoints, OPNS, splitSats, type PlayRule, type PointsEntry } from './points'

export const PLAY_KEY_PROTOCOL: [2, string] = [2, 'bmusic play key']
/** BRC-29 payment protocol id. */
export const BRC29: [2, string] = [2, '3241645161d8']
export const QUOTE_TTL_MS = 10 * 60_000
const MAP_PREFIX = '1PuQa7K62MiKCtssSLKy1kh56WWU7MtUR5'

let wallet: ProtoWallet | null = null
export function serverWallet(): ProtoWallet {
  if (wallet) return wallet
  const wif = process.env.BMUSIC_SERVER_WIF
  if (!wif) throw new Error('BMUSIC_SERVER_WIF is not set')
  wallet = new ProtoWallet(PrivateKey.fromWif(wif))
  return wallet
}
export async function serverIdentity(): Promise<string> {
  return (await serverWallet().getPublicKey({ identityKey: true })).publicKey
}

// ── keystore: track keys at rest ──────────────────────────────────────────────
function storeKey(): Buffer {
  const hex = process.env.BMUSIC_KEYSTORE_SECRET ?? ''
  if (!/^[0-9a-f]{64}$/i.test(hex)) throw new Error('BMUSIC_KEYSTORE_SECRET must be 64 hex characters')
  return Buffer.from(hex, 'hex')
}
export function sealAtRest(key: Uint8Array): string {
  const iv = randomBytes(12)
  const c = createCipheriv('aes-256-gcm', storeKey(), iv)
  const ct = Buffer.concat([c.update(key), c.final()])
  return Buffer.concat([iv, c.getAuthTag(), ct]).toString('base64')
}
export function openAtRest(b64: string): Buffer {
  const b = Buffer.from(b64, 'base64')
  const d = createDecipheriv('aes-256-gcm', storeKey(), b.subarray(0, 12))
  d.setAuthTag(b.subarray(12, 28))
  return Buffer.concat([d.update(b.subarray(28)), d.final()])
}
/** True if `key` opens a sealed body (iv12|tag16|ct): proves the key before it's accepted (idea from Tempo). */
export function opens(key: Uint8Array, sealed: Uint8Array): boolean {
  try {
    const d = createDecipheriv('aes-256-gcm', key, sealed.subarray(0, 12))
    d.setAuthTag(sealed.subarray(12, 28))
    d.update(sealed.subarray(28))
    d.final()
    return true
  } catch {
    return false
  }
}
export const sha256hex = (b: Uint8Array) => createHash('sha256').update(b).digest('hex')

// ── reading a sealed inscription ──────────────────────────────────────────────
export type Inscription = { contentType: string; content: number[]; map: Record<string, string> }

/** Parse a 1Sat inscription (ord envelope) and its MAP SET fields from one output's locking script. */
export function parseInscription(script: Script): Inscription | null {
  const chunks = script.chunks
  const text = (i: number) => (chunks[i]?.data ? Utils.toUTF8(chunks[i].data!) : '')
  let contentType = ''
  let content: number[] = []
  let found = false
  for (let i = 0; i + 2 < chunks.length; i++) {
    if (chunks[i].op === 0 && chunks[i + 1].op === 0x63 && text(i + 2) === 'ord') {
      found = true
      for (let j = i + 3; j + 1 < chunks.length && chunks[j].op !== 0x68; j += 2) {
        if (chunks[j].op === 0x51) contentType = text(j + 1)
        if (chunks[j].op === 0) {
          content = chunks[j + 1].data ?? []
          break
        }
      }
      break
    }
  }
  if (!found) return null
  // the SDK keeps everything after OP_RETURN as one data chunk; re-read it as pushes
  const ret = chunks.find((c) => c.op === 0x6a && c.data)
  const tail = ret ? Script.fromBinary(ret.data!).chunks : []
  const t = (i: number) => (tail[i]?.data ? Utils.toUTF8(tail[i].data!) : '')
  const map: Record<string, string> = {}
  const at = tail.findIndex((_, i) => t(i) === MAP_PREFIX)
  if (at >= 0 && t(at + 1) === 'SET') {
    for (let j = at + 2; j + 1 < tail.length; j += 2) {
      const k = t(j)
      if (!k || k === '|') break
      map[k] = t(j + 1)
    }
  }
  return { contentType, content, map }
}

export async function fetchRawTx(txid: string): Promise<string> {
  const r = await fetch(`https://api.whatsonchain.com/v1/bsv/main/tx/${txid}/hex`, { cache: 'no-store' })
  if (!r.ok) throw new Error(`transaction ${txid.slice(0, 8)}… not found (${r.status})`)
  return (await r.text()).trim()
}

/** Read and validate the play rule of a sealed track at `origin` (txid_vout). */
export async function readSealedTrack(origin: string): Promise<{ rule: PlayRule; contentType: string; sealed: Uint8Array }> {
  const m = /^([0-9a-f]{64})_(\d+)$/.exec(origin)
  if (!m) throw new Error('origin must be <txid>_<vout>')
  const tx = Transaction.fromHex(await fetchRawTx(m[1]))
  const out = tx.outputs[Number(m[2])]
  if (!out) throw new Error('no such output')
  const ins = parseInscription(out.lockingScript)
  if (!ins?.map.play) throw new Error('not a bMusic sealed track')
  const rule = JSON.parse(ins.map.play) as PlayRule
  const problem = rule.v === 1 ? checkPoints(rule.points) : 'unknown play rule version'
  if (problem) throw new Error(problem)
  if (!/^[0-9a-f]{64}$/.test(rule.keyHash)) throw new Error('bad keyHash')
  return { rule, contentType: ins.map.origType || ins.contentType, sealed: Uint8Array.from(ins.content) }
}

// ── pricing ───────────────────────────────────────────────────────────────────
let rate: { usd: number; at: number } | null = null
export async function usdPerBsv(): Promise<number> {
  if (rate && Date.now() - rate.at < 10 * 60_000) return rate.usd
  const r = await fetch('https://api.whatsonchain.com/v1/bsv/main/exchangerate', { cache: 'no-store' })
  const j = (await r.json()) as { rate?: number }
  if (!j.rate || !(j.rate > 0)) throw new Error('no BSV price available')
  rate = { usd: j.rate, at: Date.now() }
  return rate.usd
}
export const centsToSats = (cents: number, usd: number) => Math.max(1, Math.ceil(((cents / 100) / usd) * 1e8))

// ── quoting ───────────────────────────────────────────────────────────────────
export type QuoteOutput = { role: PointsEntry['role']; lockingScript: string; satoshis: number }

/**
 * The outputs a play must pay. Artist: plain P2PKH. bMusic: if the rule names a P2PKH address, that;
 * if `opns:<name>`, a fresh BRC-29 output to this server's own key (the server is the bMusic wallet),
 * derived against the listener so the listener's wallet pays it like any BRC-29 payment.
 * Every payee gets at least 1 sat.
 */
export async function quoteOutputs(rule: PlayRule, listener: string, totalSats: number) {
  const split = splitSats(totalSats, rule.points)
  const outputs: QuoteOutput[] = []
  let derivation: { prefix: string; suffix: string; senderIdentityKey: string } | null = null
  for (const [i, p] of rule.points.entries()) {
    const sats = Math.max(1, split[i].sats)
    if (OPNS.test(p.to)) {
      const prefix = Utils.toBase64(Array.from(randomBytes(8)))
      const suffix = Utils.toBase64(Array.from(randomBytes(8)))
      const { publicKey } = await serverWallet().getPublicKey({ protocolID: BRC29, keyID: `${prefix} ${suffix}`, counterparty: listener, forSelf: true })
      outputs.push({ role: p.role, lockingScript: new P2PKH().lock(PublicKey.fromString(publicKey).toAddress()).toHex(), satoshis: sats })
      derivation = { prefix, suffix, senderIdentityKey: listener }
    } else {
      outputs.push({ role: p.role, lockingScript: new P2PKH().lock(p.to).toHex(), satoshis: sats })
    }
  }
  return { outputs, derivation, total: outputs.reduce((n, o) => n + o.satoshis, 0) }
}

/** Every quoted output must appear in the transaction with at least the quoted amount. */
export function paysQuote(tx: Transaction, outputs: QuoteOutput[]): string | null {
  const pool = tx.outputs.map((o) => ({ script: o.lockingScript.toHex(), sats: o.satoshis ?? 0, used: false }))
  for (const q of outputs) {
    const hit = pool.find((o) => !o.used && o.script === q.lockingScript && o.sats >= q.satoshis)
    if (!hit) return `the payment to the ${q.role} is missing or short`
    hit.used = true
  }
  return null
}

/** Broadcast via WhatsOnChain; an already-known transaction counts as success. */
export async function broadcast(rawHex: string): Promise<string> {
  const r = await fetch('https://api.whatsonchain.com/v1/bsv/main/tx/raw', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ txhex: rawHex }),
  })
  const body = (await r.text()).replace(/"/g, '').trim()
  if (r.ok) return body
  if (/already|known|txn-already|257/i.test(body)) return Transaction.fromHex(rawHex).id('hex')
  throw new Error(`broadcast failed: ${body.slice(0, 200)}`)
}
