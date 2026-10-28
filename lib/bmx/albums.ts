import first12 from '@/public/bmusic/streams/first-12/manifest.json'

// PREVIEW (28 Oct 2026): store shelf data. NPGX audio is served from a local, untracked
// public/_preview folder; per-second streaming for NPGX albums is not live yet.

export type ShelfTrack = { n: number; title: string; seconds: number; src?: string; note?: string; clean?: 'clean' | 'ear-check' }
export type ShelfAlbum = {
  slug: string
  title: string
  artist: string
  cover: string
  line: string
  genre: string
  featured?: boolean
  titleStyle?: 'drip' | 'gold'
  /** Live = streams today in bWalletX, paid by the second. */
  live: boolean
  satsPerSecond?: number
  listenUrl?: string
  tracks: ShelfTrack[]
}

const NPGX = '/_preview/npgx'
const TB = '/_preview/tb'

export const TERRORNODE: ShelfAlbum = {
  slug: 'welcome-to-terrornode',
  title: 'WELCOME TO TERRORNODE',
  artist: 'NPGX',
  cover: '/bmx/covers/terrornode-cover.webp',
  line: 'Hard rock, industrial and hardcore from the streets of Neo-Tokyo 2048. The soundtrack to the TERRORNODE game.',
  genre: 'Industrial punk · hardcore · heavy',
  featured: true,
  titleStyle: 'drip',
  live: false,
  tracks: [
    { n: 1, title: 'Chrome Fist', seconds: 177, src: `${NPGX}/neon-blood-riot/02-a.mp3`, note: 'Industrial punk, mechanical beat', clean: 'clean' },
    { n: 2, title: 'Shibuya Mosh Pit', seconds: 135, src: `${NPGX}/tokyo-gutter-punk/03-a.mp3`, note: 'Thrash crossover, double kick', clean: 'clean' },
    { n: 3, title: 'Tokaido Reload', seconds: 210, src: `${NPGX}/tokyo-gutter-punk/11-a.mp3`, note: 'Driving hard rock', clean: 'clean' },
    { n: 4, title: 'Molotov Kiss', seconds: 110, src: `${NPGX}/neon-blood-riot/06-a.mp3`, note: 'Hardcore punk, 190 BPM', clean: 'ear-check' },
    { n: 5, title: 'Neon Blood Riot', seconds: 137, src: `${NPGX}/neon-blood-riot/01-a.mp3`, note: 'Riot grrrl hardcore', clean: 'clean' },
    { n: 6, title: 'Kabukicho Wolf', seconds: 143, src: `${NPGX}/tokyo-gutter-punk/05-a.mp3`, note: 'Street punk, gang chants', clean: 'clean' },
    { n: 7, title: 'Akihabara Fury', seconds: 144, src: `${NPGX}/neon-blood-riot/08-a.mp3`, note: 'Noise punk, glitch electronics', clean: 'ear-check' },
    { n: 8, title: 'Blade Girl', seconds: 205, src: `${NPGX}/tokyo-gutter-punk/02-a.mp3`, note: 'Crust punk, d-beat', clean: 'clean' },
    { n: 9, title: 'Shinobi Girls', seconds: 200, src: `${NPGX}/neon-blood-riot/07-a.mp3`, note: 'Speed punk, 200 BPM', clean: 'ear-check' },
    { n: 10, title: 'Razor Kisses', seconds: 188, src: `${NPGX}/tokyo-gutter-punk/06-a.mp3`, note: 'Noise hardcore, breakneck', clean: 'clean' },
    { n: 11, title: 'Black Rose', seconds: 281, src: `${NPGX}/tokyo-gutter-punk/04-a.mp3`, note: 'Hardcore anthem, guitar solo', clean: 'clean' },
    { n: 12, title: 'Underground Empress', seconds: 165, src: `${NPGX}/tokyo-gutter-punk/09-a.mp3`, note: 'Anarcho-punk, driving bass', clean: 'clean' },
    { n: 13, title: 'Midnight Graffiti Symphony', seconds: 183, src: `${TB}/midnight-graffiti-symphony.m4a`, note: 'Heavy bass and scratch (bonus)', clean: 'ear-check' },
  ],
}

const tgp: ShelfTrack[] = [
  [1, 'Tokyo Gutter Queen', 192], [2, 'Blade Girl', 205], [3, 'Shibuya Mosh Pit', 135], [4, 'Black Rose', 281],
  [5, 'Kabukicho Wolf', 143], [6, 'Razor Kisses', 188], [8, 'Harajuku Chainsaw', 121], [9, 'Underground Empress', 165], [11, 'Tokaido Reload', 210],
].map(([n, title, seconds], i) => ({ n: i + 1, title: title as string, seconds: seconds as number, src: `${NPGX}/tokyo-gutter-punk/${String(n).padStart(2, '0')}-a.mp3` }))

const nbr: ShelfTrack[] = [
  'Neon Blood Riot', 'Chrome Fist', 'Roppongi Warzone', 'Electric Geisha', 'Concrete Sakura', 'Molotov Kiss',
  'Shinobi Girls', 'Akihabara Fury', 'Dead Idols', 'Gasoline Heart', 'Last Train to Nowhere',
].map((title, i) => ({ n: i + 1, title, seconds: [137, 177, 31, 29, 55, 110, 200, 144, 65, 154, 59][i], src: `${NPGX}/neon-blood-riot/${String(i + 1).padStart(2, '0')}-a.mp3` }))

export const TOKYO: ShelfAlbum = {
  slug: 'tokyo-gutter-punk', title: 'Tokyo Gutter Punk', artist: 'NPGX', cover: '/bmx/covers/tokyo-gutter-punk.webp',
  line: 'Japanese hardcore punk. Blast beats, gang chants and screaming guitars.', genre: 'J-punk · hardcore', titleStyle: 'gold', live: false, tracks: tgp,
}

export const NEON: ShelfAlbum = {
  slug: 'neon-blood-riot', title: 'Neon Blood Riot', artist: 'NPGX', cover: '/bmx/covers/neon-blood-riot.webp',
  line: 'Riot grrrl, post-punk and street punk from neon Tokyo.', genre: 'Punk · post-punk · riot grrrl', titleStyle: 'gold', live: false, tracks: nbr,
}

type Manifest = { albumId: string; title: string; artist: string; cover?: string; satsPerSegment: number; tracks: { n: number; title: string; segments: number; durations?: number[] }[] }
const m = first12 as Manifest
export const VEXVOID: ShelfAlbum = {
  slug: 'echoes-in-the-abyss', title: m.title, artist: m.artist, cover: `/bmusic/streams/${m.albumId}/${m.cover ?? 'cover.jpg'}`,
  line: 'Twelve dark electronic tracks. Streams live in bWalletX.', genre: 'Dark electronic', titleStyle: 'gold', live: true,
  satsPerSecond: m.satsPerSegment, listenUrl: 'https://desktop.bwalletx.com/bmusic/artist/vexvoid/album/echoes-in-the-abyss',
  tracks: m.tracks.map((t) => ({ n: t.n, title: t.title, seconds: Math.round(t.durations ? t.durations.reduce((a, b) => a + b, 0) : t.segments) })),
}

export const SHELF: ShelfAlbum[] = [TERRORNODE, TOKYO, NEON, VEXVOID]
export const albumBySlug = (s: string) => SHELF.find((a) => a.slug === s)
export const mmss = (s: number) => `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, '0')}`
