import type { Metadata } from 'next'
import Landing from '@/components/bmx/Landing'
import { SHELF } from '@/lib/bmx/albums'
import './store.css'

export const metadata: Metadata = { alternates: { canonical: 'https://bmusicx.com' } }

export default function HomePage() {
  return <Landing albums={SHELF} />
}
