/**
 * Pack an album (or a single video) for per-second paid streaming.
 *
 *   pnpm exec tsx --env-file=.env.local scripts/bmusic/stream-pack.ts <album-id> "<Album title>" <artist P2PKH address> [--identity=<artist pubkey>] [--artist=Name] <file>...
 *
 * Audio files become 1-second AAC segments; video files 1-second H.264 (keyframe every second) + AAC segments,
 * kept at the source size. Each track becomes an fMP4 init segment (no media, served plain) plus segments, each
 * sealed with its own key (AES-256-GCM, iv12|tag16|ct). Segment keys are HMAC-SHA256(trackSecret, "<trackId>:<n>"),
 * so the server stores one secret per track (encrypted at rest) and hands out one segment key per paid second.
 * Output: public/bmusic/streams/<album-id>/ (manifest.json, <trackId>/init.mp4, <trackId>/<n>.seg).
 */
import { createCipheriv, randomBytes } from 'node:crypto'
import { execFileSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { basename, join } from 'node:path'
import { upsert } from '../../lib/bmusic/db'
import { sealAtRest, segmentKey } from '../../lib/bmusic/server'

const argv = process.argv.slice(2)
const flag = (k: string) => argv.find((a) => a.startsWith(`--${k}=`))?.slice(k.length + 3)
const [albumId, albumTitle, artist, ...files] = argv.filter((a) => !a.startsWith('--'))
const identity = flag('identity')
const artistName = flag('artist') ?? 'VexVoid'
if (!albumId || !albumTitle || !/^1[1-9A-HJ-NP-Za-km-z]{25,34}$/.test(artist ?? '') || !files.length) {
  console.error('usage: stream-pack.ts <album-id> "<Album title>" <artist address> <track.mp3>...')
  process.exit(1)
}

const seal = (key: Uint8Array, plain: Buffer) => {
  const iv = randomBytes(12)
  const c = createCipheriv('aes-256-gcm', key, iv)
  const ct = Buffer.concat([c.update(plain), c.final()])
  return Buffer.concat([iv, c.getAuthTag(), ct])
}

async function main() {
const outDir = join('public', 'bmusic', 'streams', albumId)
mkdirSync(outDir, { recursive: true })
const tracks = []

for (const [i, file] of files.entries()) {
  const tags = JSON.parse(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration:format_tags=title', '-of', 'json', file]).toString())
  const title: string = tags.format.tags?.title ?? basename(file).replace(/\.[^.]+$/, '')
  const trackId = `${albumId}-${String(i + 1).padStart(2, '0')}`
  const tmp = mkdtempSync(join(tmpdir(), 'bmusic-'))
  const isVideo = execFileSync('ffprobe', ['-v', 'error', '-select_streams', 'v', '-show_entries', 'stream=codec_type', '-of', 'csv=p=0', file]).toString().includes('video')
  // video: H.264 Main 3.0 at the source size, a keyframe every second so every segment starts clean
  const codec = isVideo
    ? ['-map', '0:v:0', '-map', '0:a:0?', '-c:v', 'libx264', '-profile:v', 'main', '-level', '3.0', '-pix_fmt', 'yuv420p', '-crf', '21', '-maxrate', '1500k', '-bufsize', '3000k',
       '-force_key_frames', 'expr:gte(t,n_forced*1)', '-sc_threshold', '0', '-c:a', 'aac', '-b:a', '128k', '-ar', '44100']
    : ['-map', '0:a', '-c:a', 'aac', '-b:a', '128k', '-ar', '44100']
  // 1-second fMP4 segments; the hls muxer gives us init.mp4 + numbered .m4s
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', file, ...codec,
    '-f', 'hls', '-hls_time', '1', '-hls_segment_type', 'fmp4', '-hls_playlist_type', 'vod',
    '-hls_fmp4_init_filename', 'init.mp4', '-hls_segment_filename', join(tmp, '%d.m4s'), join(tmp, 'index.m3u8')])
  const segs = readdirSync(tmp).filter((f) => f.endsWith('.m4s')).sort((a, b) => parseInt(a) - parseInt(b))
  const durations = [...readFileSync(join(tmp, 'index.m3u8'), 'utf8').matchAll(/#EXTINF:([\d.]+)/g)].map((m) => Number(m[1]))

  const secret = randomBytes(32)
  const dir = join(outDir, trackId)
  mkdirSync(dir, { recursive: true })
  writeFileSync(join(dir, 'init.mp4'), readFileSync(join(tmp, 'init.mp4')))
  segs.forEach((s, n) => writeFileSync(join(dir, `${n}.seg`), seal(segmentKey(secret, trackId, n), readFileSync(join(tmp, s)))))
  rmSync(tmp, { recursive: true, force: true })

  await upsert('bmusic_streams', {
    track_id: trackId, album_id: albumId, title, artist_address: artist, segments: segs.length,
    secret_enc: sealAtRest(secret), sats_per_segment: 1, kind: isVideo ? 'video' : 'audio', ...(identity ? { artist_identity: identity } : {}),
  }, 'track_id')
  secret.fill(0)
  const mime = isVideo ? 'video/mp4; codecs="avc1.4d401e, mp4a.40.2"' : 'audio/mp4; codecs="mp4a.40.2"'
  tracks.push({ n: i + 1, trackId, title, kind: isVideo ? 'video' : 'audio', mime, segments: segs.length, durations, seconds: Math.round(durations.reduce((a, b) => a + b, 0)) })
  console.log(`${trackId}  ${title}  ${segs.length} segments`)
}

writeFileSync(join(outDir, 'manifest.json'), JSON.stringify({
  v: 1,
  albumId,
  title: albumTitle,
  artist: artistName,
  satsPerSegment: 1,
  segmentSeconds: 1,
  mime: tracks[0].mime,
  keyProtocol: [2, 'bmusic stream key'],
  endpoint: '/api/bmusic/stream',
  payto: '/api/bmusic/stream/payto',
  paths: { init: '<trackId>/init.mp4', segment: '<trackId>/<n>.seg' },
  tracks,
}, null, 1))
console.log(`wrote ${outDir}/manifest.json`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
