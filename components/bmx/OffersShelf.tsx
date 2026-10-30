'use client'

// Offers shelf: open offers for music from the bChatX feed. Renders nothing while loading,
// when the feed is empty, or when it fails, so there is never an empty box.

import { useEffect, useState } from 'react'

type Offer = { id: string; title: string; image: string | null; amount_cents: number | null; pct: string | null; status: string; url: string; offer_url: string }

const FEED = 'https://www.bchatx.com/api/offers?market=music&status=open&source=bmusicx'

const https = (u: unknown) => {
  try { const x = new URL(String(u)); return x.protocol === 'https:' ? x.href : '' } catch { return '' }
}

function price(o: Offer) {
  const p: string[] = []
  if (typeof o.amount_cents === 'number' && Number.isFinite(o.amount_cents) && o.amount_cents >= 0) {
    p.push('$' + (o.amount_cents / 100).toLocaleString('en-US', { minimumFractionDigits: o.amount_cents % 100 ? 2 : 0, maximumFractionDigits: 2 }))
  }
  if (o.pct != null && o.pct !== '' && Number.isFinite(Number(o.pct))) p.push(Number(o.pct) + '%')
  return p.join(' + ')
}

export default function OffersShelf() {
  const [offers, setOffers] = useState<Offer[]>([])
  useEffect(() => {
    const ctl = new AbortController()
    const t = setTimeout(() => ctl.abort(), 6000)
    fetch(FEED, { credentials: 'omit', signal: ctl.signal })
      .then((r) => { if (!r.ok) throw new Error('feed'); return r.json() })
      .then((list) => {
        if (Array.isArray(list)) setOffers(list.filter((o) => o && o.status === 'open' && https(o.offer_url)).slice(0, 24))
      })
      .catch(() => {})
      .finally(() => clearTimeout(t))
    return () => { clearTimeout(t); ctl.abort() }
  }, [])
  if (!offers.length) return null
  return (
    <section id="offers" aria-labelledby="ofr-h" className="lx-sec ofr">
      <div className="sx-shelf-h xs-cat"><div><p className="xs-eye">Offers</p><h2 id="ofr-h">Open offers on <i>bMusicX.</i></h2><p className="xs-sub">Tap a card to see it, or make an offer of your own.</p></div></div>
      <ul className="ofr-rail" role="list" aria-label="Open offers, scrolls sideways">
        {offers.map((o) => {
          const img = https(o.image), title = String(o.title || 'Untitled'), pr = price(o)
          return (
            <li key={o.id}>
              <div className="ofr-card">
                <a href={https(o.url) || https(o.offer_url)}>
                  {img ? <img className="ofr-img" src={img} alt="" loading="lazy" decoding="async" referrerPolicy="no-referrer" /> : <span className="ofr-ph" aria-hidden="true">b</span>}
                  <span className="ofr-m"><b>{title}</b>{pr && <span className="ofr-p">{pr}</span>}</span>
                </a>
                <a className="ofr-go" href={https(o.offer_url)} aria-label={`Make an offer on ${title}`}>Make an offer</a>
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
