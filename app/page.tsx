import type { Metadata } from 'next'
import Store from '@/components/bmx/Store'
import { SHELF } from '@/lib/bmx/albums'
import './store.css'

export const metadata: Metadata = { alternates: { canonical: 'https://bmusicx.com' } }

export default function HomePage() {
  return <Store albums={SHELF} />
}
