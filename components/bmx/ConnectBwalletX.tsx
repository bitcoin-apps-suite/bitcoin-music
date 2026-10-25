'use client'
import { useEffect } from 'react'

const CONNECT = 'https://unpkg.com/@bwalletx/connect@0.5.0/dist/bwalletx-connect.global.js'
const SRI = 'sha384-1XiN/accJppMI7qXUHzNrUAdUWIotONkjNy7rZBrwcvPxDCFk1yC83JY2c4LZ8gg'

/** Header Connect bWalletX: a BRC-100 identity-key connection (no sign-in) so bWalletX wears bMusicX's
 *  /.well-known/bwalletx-theme.json while connected. The button itself is drawn by /bwx-connect.js. */
export default function ConnectBwalletX() {
  useEffect(() => {
    if (document.querySelector('script[data-bwx-loader]')) return
    const add = (src: string, extra?: (s: HTMLScriptElement) => void) =>
      new Promise<void>((ok, fail) => {
        const s = document.createElement('script')
        s.src = src
        s.dataset.bwxLoader = ''
        extra?.(s)
        s.onload = () => ok()
        s.onerror = () => fail(new Error(src))
        document.body.appendChild(s)
      })
    add(CONNECT, (s) => { s.integrity = SRI; s.crossOrigin = 'anonymous' })
      .then(() => add('/bwx-connect.js'))
      .catch(() => {})
  }, [])
  return <span data-bwx-connect="" data-fg="#3b82f6" data-on="#ffffff" suppressHydrationWarning />
}
