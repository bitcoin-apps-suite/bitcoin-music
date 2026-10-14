'use client'

import { useEffect, useState } from 'react'

type Sponsored = { sponsored?: boolean; sponsoredTracks?: string[] }
type ReleaseInfo = { forSale?: boolean; minted?: { origin: string } | null; mintPriceSats?: number | null }

/** Live status from the bMusic APIs: who's paying for listening right now, and which originals are for sale. */
export function useAlbumLive(albumId: string, trackIds: string[]) {
  const [sponsored, setSponsored] = useState<Sponsored | null>(null)
  const [releases, setReleases] = useState<Record<string, ReleaseInfo>>({})
  const [listened, setListened] = useState<number | null>(null)
  const key = trackIds.join(',')

  useEffect(() => {
    let live = true
    const get = (u: string) => fetch(u).then((r) => (r.ok ? r.json() : null)).catch(() => null)
    get(`/api/bmusic/stream/sponsored?albumId=${encodeURIComponent(albumId)}`).then((j) => live && j && setSponsored(j))
    get(`/api/bmusic/leaderboard?albumId=${encodeURIComponent(albumId)}`).then((j) => {
      if (!live || !j) return
      const claimed = Array.isArray(j.listeners) ? j.listeners.reduce((n: number, l: { secondsTotal?: number }) => n + (Number(l.secondsTotal) || 0), 0) : 0
      setListened(claimed + (Number(j.anonSeconds) || 0))
    })
    Promise.all(key.split(',').map((id) => get(`/api/bmusic/release/${encodeURIComponent(id)}`).then((j) => [id, j] as const))).then((rows) => {
      if (!live) return
      const out: Record<string, ReleaseInfo> = {}
      for (const [id, j] of rows) if (j) out[id] = j
      setReleases(out)
    })
    return () => {
      live = false
    }
  }, [albumId, key])

  return { sponsored, releases, listened }
}

export default function AlbumBadges({ albumId, trackIds }: { albumId: string; trackIds: string[] }) {
  const { sponsored, listened } = useAlbumLive(albumId, trackIds)
  return (
    <div className="bmx-badges">
      {sponsored?.sponsored && <span className="bmx-chip bmx-chip-on">Free to listen — the artist is paying</span>}
      {listened !== null && listened > 0 && <span className="bmx-chip">{Math.round(listened / 60).toLocaleString()} minutes played</span>}
    </div>
  )
}
