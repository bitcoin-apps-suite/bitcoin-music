import first12 from '@/public/bmusic/streams/first-12/manifest.json'

// Store shelf data. The store plays SAMPLES only: 45s clips (20s for tracks under 50s) in
// public/bmx/samples. Full tracks are not published until numbered-edition sales launch.
// `seconds` is the full track length (for display); `sampleSeconds` is the clip length.

export type ShelfTrack = { n: number; title: string; seconds: number; src?: string; sampleSeconds?: number; note?: string; artist?: string; clean?: 'clean' | 'ear-check' }
export type ShelfAlbum = {
  slug: string
  title: string
  artist: string
  cover: string
  line: string
  genre: string
  featured?: boolean
  titleStyle?: 'drip' | 'gold'
  titleImg?: string
  titleSub?: string
  /** Live = streams today in bWalletX, paid by the second. */
  live: boolean
  satsPerSecond?: number
  listenUrl?: string
  credits?: string[]
  tracks: ShelfTrack[]
}

export type ShelfArtist = { slug: string; name: string; photo: string; bio: string }

const AU = '/bmx/samples'
const NPGX_CREDIT = 'NPGX. Created with Suno; prompts and lyrics by b0ase.'
const DARKTECH = 'Cover title: Darktech LDR font by Michał "Neoqueto" Nowak, CC BY-SA 3.0.'

export const TERRORNODE: ShelfAlbum = {
  slug: 'welcome-to-terrornode',
  title: 'WELCOME TO TERRORNODE',
  artist: 'NPGX',
  cover: '/bmx/covers/terrornode-cover.webp',
  line: 'Hard rock, industrial and hardcore from the streets of Neo-Tokyo 2048. The soundtrack to the TERRORNODE game.',
  genre: 'Industrial punk · hardcore · heavy',
  featured: true,
  titleStyle: 'drip', titleImg: '/bmx/titles/terrornode.svg',
  live: false,
  credits: [
    `Music: ${NPGX_CREDIT}`,
    'Void Mass: Vivienne Void. Paper Reed Circuit: VexVoid.',
    'Electric Geisha (電気芸者) is the TERRORNODE end-credits theme.',
    DARKTECH,
  ],
  tracks: [
    { n: 1, title: 'Welcome to Terrornode', seconds: 164, src: `${AU}/terrornode/welcome-to-terrornode-sample.m4a`, note: 'Title track', clean: 'ear-check' },
    { n: 2, title: 'March of the Erobotz', seconds: 108, src: `${AU}/terrornode/march-of-the-erobotz-sample.m4a`, note: 'Erobotz theme', clean: 'ear-check' },
    { n: 3, title: 'I Am TERRORNODE', seconds: 138, src: `${AU}/terrornode/i-am-terrornode-sample.m4a`, note: 'Rogue AI theme', clean: 'ear-check' },
    { n: 4, title: 'KAIJU-01', seconds: 193, src: `${AU}/terrornode/kaiju-01-sample.m4a`, note: 'The giant robot rises', clean: 'ear-check' },
    { n: 5, title: 'Tokyo Gutter Queen', seconds: 192, src: `${AU}/tokyo-gutter-punk/01-sample.m4a`, note: 'J-punk anthem · from Tokyo Gutter Punk', clean: 'ear-check' },
    { n: 6, title: 'Shibuya Mosh Pit', seconds: 135, src: `${AU}/tokyo-gutter-punk/03-sample.m4a`, note: 'Thrash crossover · from Tokyo Gutter Punk', clean: 'ear-check' },
    { n: 7, title: 'Akihabara Fury', seconds: 144, src: `${AU}/neon-blood-riot/08-sample.m4a`, note: 'Noise punk · from Neon Blood Riot', clean: 'ear-check' },
    { n: 8, title: 'Shinobi Girls', seconds: 200, src: `${AU}/neon-blood-riot/07-sample.m4a`, note: 'Speed punk · from Neon Blood Riot', clean: 'ear-check' },
    { n: 9, title: 'Underground Empress', seconds: 165, src: `${AU}/tokyo-gutter-punk/09-sample.m4a`, note: 'Anarcho-punk · from Tokyo Gutter Punk', clean: 'ear-check' },
    { n: 10, title: 'Molotov Kiss', seconds: 110, src: `${AU}/neon-blood-riot/06-sample.m4a`, note: 'Hardcore punk · from Neon Blood Riot', clean: 'ear-check' },
    { n: 11, title: 'Chrome Fist', seconds: 177, src: `${AU}/neon-blood-riot/02-sample.m4a`, note: 'Industrial punk · from Neon Blood Riot', clean: 'ear-check' },
    { n: 12, title: 'Void Mass (Vivienne Void)', seconds: 56, src: `${AU}/vivienne-void/void-mass-sample.m4a`, artist: 'Vivienne Void', note: 'Interlude', clean: 'ear-check' },
    { n: 13, title: '渋谷ブレイカー (Shibuya Breaker)', seconds: 198, src: `${AU}/terrornode/shibuya-breaker-sample.m4a`, note: 'Speed punk', clean: 'ear-check' },
    { n: 14, title: 'Tokaido Reload', seconds: 210, src: `${AU}/tokyo-gutter-punk/11-sample.m4a`, note: 'Driving hard rock · from Tokyo Gutter Punk', clean: 'ear-check' },
    { n: 15, title: 'Neon Blood Riot', seconds: 137, src: `${AU}/neon-blood-riot/01-sample.m4a`, note: 'Riot grrrl hardcore · from Neon Blood Riot', clean: 'ear-check' },
    { n: 16, title: 'Kabukicho Wolf', seconds: 143, src: `${AU}/tokyo-gutter-punk/05-sample.m4a`, note: 'Street punk · from Tokyo Gutter Punk', clean: 'ear-check' },
    { n: 17, title: 'Blade Girl', seconds: 205, src: `${AU}/tokyo-gutter-punk/02-sample.m4a`, note: 'Crust punk · from Tokyo Gutter Punk', clean: 'ear-check' },
    { n: 18, title: 'Razor Kisses', seconds: 188, src: `${AU}/tokyo-gutter-punk/06-sample.m4a`, note: 'Noise hardcore · from Tokyo Gutter Punk', clean: 'ear-check' },
    { n: 19, title: 'Black Rose', seconds: 281, src: `${AU}/tokyo-gutter-punk/04-sample.m4a`, note: 'Hardcore anthem · from Tokyo Gutter Punk', clean: 'ear-check' },
    { n: 20, title: 'Paper Reed Circuit (VexVoid)', seconds: 179, src: `${AU}/vexvoid/paper-reed-circuit-sample.m4a`, artist: 'VexVoid', clean: 'ear-check' },
    { n: 21, title: 'Electric Geisha (電気芸者)', seconds: 244, src: `${AU}/terrornode/electric-geisha-sample.m4a`, note: 'End credits', clean: 'ear-check' },
  ],
}

const alt = (n: number, title: string, seconds: number, file: string, note?: string): ShelfTrack => ({ n, title, seconds, src: `${AU}/terrornode-alts/${file}-sample.m4a`, note, clean: 'ear-check' })
export const TERRORNODE_ALTS: ShelfAlbum = {
  slug: 'terrornode-alternate-takes',
  title: 'TERRORNODE: Alternate Takes',
  artist: 'NPGX',
  cover: '/bmx/covers/terrornode-alternate-takes.webp',
  line: 'Other takes from the WELCOME TO TERRORNODE sessions, including six more runs at Shibuya Breaker.',
  genre: 'Industrial punk · alternate takes',
  titleStyle: 'drip', titleImg: '/bmx/titles/terrornode.svg', titleSub: 'Alternate Takes',
  live: false,
  credits: [`Music: ${NPGX_CREDIT}`, DARKTECH],
  tracks: [
    alt(1, '渋谷ブレイカー (Take 1)', 104, 'shibuya-breaker-take1'),
    alt(2, '渋谷ブレイカー (Take 2)', 103, 'shibuya-breaker-take2'),
    alt(3, '渋谷ブレイカー (Take 4)', 126, 'shibuya-breaker-take4'),
    alt(4, '渋谷ブレイカー (Take 5)', 227, 'shibuya-breaker-take5'),
    alt(5, '渋谷ブレイカー (Take 5b)', 200, 'shibuya-breaker-take5b'),
    alt(6, '渋谷ブレイカー (Take 6)', 242, 'shibuya-breaker-take6'),
    alt(7, 'Shibuya Breaker (Beautiful Alt)', 194, 'shibuya-breaker-beautiful-alt'),
    alt(8, 'March of the Erobotz (Take 4)', 128, 'march-of-the-erobotz-take4'),
    alt(9, 'I Am TERRORNODE (Take 2)', 132, 'i-am-terrornode-take2'),
    alt(10, 'KAIJU-01 (Take 2)', 194, 'kaiju-01-take2'),
  ],
}

export const VOID_MASS: ShelfAlbum = {
  slug: 'void-mass-ep',
  title: 'Void Mass EP',
  artist: 'Vivienne Void',
  cover: '/bmx/covers/void-mass-ep.webp',
  line: 'Three short, dark pieces from Vivienne Void, the face of MISS VOID and the other half of VexVoid.',
  genre: 'Dark electronic · goth',
  titleStyle: 'gold',
  live: false,
  credits: ['Music: Vivienne Void (NPGX). Created with Suno; prompts by b0ase.', 'Cover: Vivienne Void character art, NPGX.'],
  tracks: [
    { n: 1, title: 'Void Mass', seconds: 56, src: `${AU}/vivienne-void/void-mass-sample.m4a`, clean: 'ear-check' },
    { n: 2, title: 'Body Machine', seconds: 35, src: `${AU}/vivienne-void/body-machine-sample.m4a`, clean: 'ear-check' },
    { n: 3, title: 'Cold Leather', seconds: 86, src: `${AU}/vivienne-void/cold-leather-sample.m4a`, clean: 'ear-check' },
  ],
}

export const PAPER_REED_B: ShelfAlbum = {
  slug: 'paper-reed-circuit-part-b',
  title: 'Paper Reed Circuit (Part B)',
  artist: 'VexVoid',
  cover: '/bmx/covers/paper-reed-circuit-part-b.webp',
  line: 'The second part of Paper Reed Circuit. Part A closes out WELCOME TO TERRORNODE.',
  genre: 'Dark electronic · single',
  titleStyle: 'gold',
  live: false,
  credits: ['Music: VexVoid. Created with Suno; prompts by b0ase.', 'Cover: VexVoid artwork from Echoes in the Abyss.'],
  tracks: [{ n: 1, title: 'Paper Reed Circuit (Part B)', seconds: 155, src: `${AU}/vexvoid/paper-reed-circuit-part-b-sample.m4a`, clean: 'ear-check' }],
}

const tgp: ShelfTrack[] = [
  [1, 'Tokyo Gutter Queen', 192], [2, 'Blade Girl', 205], [3, 'Shibuya Mosh Pit', 135], [4, 'Black Rose', 281],
  [5, 'Kabukicho Wolf', 143], [6, 'Razor Kisses', 188], [9, 'Underground Empress', 165], [11, 'Tokaido Reload', 210],
].map(([n, title, seconds], i) => ({ n: i + 1, title: title as string, seconds: seconds as number, src: `${AU}/tokyo-gutter-punk/${String(n).padStart(2, '0')}-sample.m4a`, clean: 'ear-check' as const }))

const nbr: ShelfTrack[] = [
  'Neon Blood Riot', 'Chrome Fist', 'Roppongi Warzone', 'Electric Geisha', 'Concrete Sakura', 'Molotov Kiss',
  'Shinobi Girls', 'Akihabara Fury', 'Dead Idols', 'Gasoline Heart', 'Last Train to Nowhere',
].map((title, i) => ({ n: i + 1, title, seconds: [137, 177, 31, 29, 55, 110, 200, 144, 65, 154, 59][i], src: `${AU}/neon-blood-riot/${String(i + 1).padStart(2, '0')}-sample.m4a`, clean: 'ear-check' as const }))

export const TOKYO: ShelfAlbum = {
  slug: 'tokyo-gutter-punk', title: 'Tokyo Gutter Punk', artist: 'NPGX', cover: '/bmx/covers/tokyo-gutter-punk.webp',
  line: 'Japanese hardcore punk. Blast beats, gang chants and screaming guitars.', genre: 'J-punk · hardcore', titleStyle: 'gold', live: false, credits: [`Music: ${NPGX_CREDIT}`], tracks: tgp,
}

export const NEON: ShelfAlbum = {
  slug: 'neon-blood-riot', title: 'Neon Blood Riot', artist: 'NPGX', cover: '/bmx/covers/neon-blood-riot.webp',
  line: 'Riot grrrl, post-punk and street punk from neon Tokyo.', genre: 'Punk · post-punk · riot grrrl', titleStyle: 'gold', live: false, credits: [`Music: ${NPGX_CREDIT}`], tracks: nbr,
}

type Manifest = { albumId: string; title: string; artist: string; cover?: string; satsPerSegment: number; tracks: { n: number; title: string; segments: number; durations?: number[] }[] }
const m = first12 as Manifest
export const VEXVOID: ShelfAlbum = {
  slug: 'echoes-in-the-abyss', title: m.title, artist: m.artist, cover: `/bmusic/streams/${m.albumId}/${m.cover ?? 'cover.jpg'}`,
  line: 'Twelve dark electronic tracks. Streams live in bWalletX.', genre: 'Dark electronic', titleStyle: 'gold', live: true,
  satsPerSecond: m.satsPerSegment, listenUrl: 'https://desktop.bwalletx.com/bmusic/artist/vexvoid/album/echoes-in-the-abyss',
  tracks: m.tracks.map((t) => ({ n: t.n, title: t.title, seconds: Math.round(t.durations ? t.durations.reduce((a, b) => a + b, 0) : t.segments) })),
}

export const SHELF: ShelfAlbum[] = [TERRORNODE, VOID_MASS, PAPER_REED_B, TOKYO, NEON, VEXVOID, TERRORNODE_ALTS]

/** Clip length for a track of `seconds` full length (matches how the samples were cut). */
export const sampleLength = (seconds: number) => (seconds < 50 ? 20 : 45)
for (const a of SHELF) for (const t of a.tracks) if (t.src) t.sampleSeconds = sampleLength(t.seconds)

export const ARTISTS: ShelfArtist[] = [
  { slug: 'npgx', name: 'NPGX', photo: '/bmx/covers/terrornode-cover.webp', bio: 'The Ninja Punk Girls band: J-punk, hardcore and industrial from Neo-Tokyo. Made with Suno; prompts and lyrics by b0ase.' },
  { slug: 'vivienne-void', name: 'Vivienne Void', photo: '/bmx/covers/void-mass-ep.webp', bio: 'The face behind MISS VOID magazine. She DJs gothic clubs, photographs every NPGX girl and is the partner of VexVoid: where Vex is invisible, Vivienne is the visible half.' },
  { slug: 'vexvoid', name: 'VexVoid', photo: '/bmx/covers/paper-reed-circuit-part-b.webp', bio: 'Dark electronic producer. Echoes in the Abyss streams live in bWalletX, paid by the second.' },
]
export const artistSlug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
export const artistBySlug = (s: string) => ARTISTS.find((a) => a.slug === s)
/** Albums by the artist, plus their guest tracks on other albums. */
export function artistWork(name: string) {
  const albums = SHELF.filter((a) => a.artist === name)
  const guest = SHELF.flatMap((a) => (a.artist === name ? [] : a.tracks.filter((t) => t.artist === name).map((t) => ({ album: a, track: t }))))
  return { albums, guest }
}
export const albumBySlug = (s: string) => SHELF.find((a) => a.slug === s)
export const mmss = (s: number) => `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, '0')}`
