/**
 * Fee pot service (bwalletX docs/FEE-POT.md). Server-side only. OFF unless FEE_POT_ENABLED=1.
 *
 * The pot key is read ONLY at runtime from FEE_POT_WIF (never in code, never committed; the owner generates and
 * funds it). It signs only the pot's own input, SIGHASH_ALL|FORKID, after checking the input pays the fee only.
 */
import { P2PKH, PrivateKey, ProtoWallet, Transaction, Utils } from '@bsv/sdk'

export const feePotOn = () => process.env.FEE_POT_ENABLED === '1'
export const monthlyBudgetSats = () => {
  const n = Number(process.env.FEE_POT_MONTHLY_SATS)
  return Number.isInteger(n) && n > 0 ? n : 50_000
}
export const RESERVE_TTL_MS = 60_000

/** The pot key, or null when unset (the routes then answer 503). */
export function potKey(): PrivateKey | null {
  const wif = process.env.FEE_POT_WIF
  if (!wif) return null
  try {
    return PrivateKey.fromWif(wif)
  } catch {
    return null
  }
}

export const proofMessage = (kind: string, identityKey: string, txBytes: number, timestamp: number) =>
  ['bwx-feepot', 'v1', 'reserve', `kind=${kind}`, `identityKey=${identityKey}`, `bytes=${txBytes}`, `timestamp=${timestamp}`].join('|')

export async function verifyProof(kind: string, identityKey: string, txBytes: number, timestamp: number, sig: string) {
  try {
    const { valid } = await new ProtoWallet('anyone').verifySignature({
      data: Utils.toArray(proofMessage(kind, identityKey, txBytes, timestamp), 'utf8'),
      signature: Utils.toArray(sig, 'hex'), protocolID: [2, 'bwx feepot'], keyID: '1', counterparty: identityKey,
    })
    return valid
  } catch {
    return false
  }
}

/**
 * Find the pot's input and change in the wallet's signable tx and sign only that input.
 * Returns null unless the input is there, the change output pays back exactly `changeSats` to the pot, and
 * the pot's contribution (in − change) is no more than the agreed fee.
 */
export async function signPotInput(
  txHex: string,
  key: PrivateKey,
  r: { outpoint: string; satoshis: number; changeSatoshis: number; feeSats: number },
  contributionOk: (i: number, c: number, f: number) => boolean,
): Promise<{ vin: number; unlockingScript: string } | null> {
  const tx = Transaction.fromHex(txHex)
  const [txid, vout] = r.outpoint.split('.')
  const vin = tx.inputs.findIndex((i) => i.sourceTXID === txid && i.sourceOutputIndex === Number(vout))
  if (vin < 0) return null
  const lock = new P2PKH().lock(key.toPublicKey().toAddress())
  const change = tx.outputs.filter((o) => o.lockingScript.toHex() === lock.toHex())
  if (change.length !== 1 || change[0].satoshis !== r.changeSatoshis) return null
  if (!contributionOk(r.satoshis, r.changeSatoshis, r.feeSats)) return null
  const unlocker = new P2PKH().unlock(key, 'all', false, r.satoshis, lock)
  const script = await unlocker.sign(tx, vin)
  return { vin, unlockingScript: script.toHex() }
}
