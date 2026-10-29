# Mint your Suno songs on bMusicX — build plan (draft, 29 Oct 2026)

Plan only. Nothing here is built, merged, deployed or posted.

## 1. Goal

Anyone who made a song on Suno can, in a few taps, put it on bMusicX as an owned copy on BSV and get paid
when people buy it. Buyers own a copy in their own wallet, play it forever, and can resell it. Artists get
paid straight to their wallet in the same transaction. First title: our own WELCOME TO TERRORNODE (NPGX).

Words: buyers "own a copy"; artists "get paid". Never earn / invest / yield / returns / profit.

## 2. Suno terms — what they allow (checked 29 Oct 2026)

Source: https://suno.com/terms (Date of Last Revision 10 Aug 2026; effective 3 Sep 2026).

- **Free / Basic:** outputs are for "lawful, personal and non-commercial purposes" only. Selling a copy is
  commercial, so free-plan songs cannot be sold on bMusicX.
- **Pro / Premier:** Suno assigns its rights in eligible outputs to the user, still subject to the terms,
  and does not guarantee copyright exists in any output.
- **Download rule (new, Sep 2026):** commercial use needs a permitted download through an approved channel
  within the tier's monthly allotment. Ripped or recorded streams are out. Rights from a permitted download
  survive cancellation or downgrade.
- **Free song, later upgrade:** the terms are silent. Suno's help centre (article edited 17 Dec 2025, as
  reported by third parties, e.g. https://dynamoi.com/learn/guides/suno-commercial-rights-explained) says an
  upgrade does **not** retroactively license free-plan songs, except where Suno grants it for a specific song.
- **Remixes** of other users' songs are joint works and personal-use only on any tier — never sellable.
- **Provenance:** Suno may add a fingerprint/watermark/metadata showing tier and download status; users must
  not strip it to hide provenance. Suno may say publicly that a song was made with Suno.
- **NFTs:** not mentioned. No separate attribution duty for users.

Product rule that follows: **only songs made while on Pro/Premier, downloaded through Suno, not remixes of
someone else's song, can be listed for sale.** Free-plan songs may be uploaded for private play only (or not
at all in MVP). Re-check the terms page before launch and each quarter; store the terms date we checked
against on every listing.

## 3. What bMusicX already has (reuse, do not rebuild)

From `bitcoin-music` (main) and this worktree (`preview/terrornode-store`):

| Piece | Where | State |
|---|---|---|
| Encrypted per-second streaming, track keys, quotes, plays paid to the artist (BRC-29) | `lib/bmusic/server.ts`, `app/api/bmusic/{quote,play,keys,stream}` | Live for VexVoid |
| Mint-on-demand 1/1 "original": buyer's wallet inscribes a small release record (1 sat, `application/vnd.bmusic.release+json`) and pays the artist in the same tx; first buyer wins via a 2-min reserve; owner key (BRC-2 wrapped) = free play forever | `lib/bmusic/release.ts`, `app/api/bmusic/release/[releaseId]/mint` | Built, 1/1 only |
| Wallet auth: `createSignature` (counterparty `anyone`) checked server-side, works from any BRC-100 wallet | `lib/bmusic/listeners.ts`, `app/api/bmusic/artists/[action]` | Live |
| Artist programme, sponsored plays, fee pot, leaderboard, income | `lib/bmusic/{programme,sponsor,points}.ts`, `lib/feepot`, `app/api/bmusic/{leaderboard,income}` | Live |
| Ordinals discovery/player (GorillaPool) | `lib/ordinals/indexer.ts`, `components/ordinals/*` | Older demo |
| Store shelf + album pages, TERRORNODE data | `lib/bmx/albums.ts`, `components/bmx/Store.tsx`, `app/album` | Preview, not merged |
| DB: self-hosted Supabase on Hetzner, migrations in `supabase/migrations/2026101*` | | Live |

Libraries present: `@bsv/sdk`, `js-1sat-ord`, `@bsv/paymail`. Not present: an artist-facing upload flow for
outsiders, edition counts, a resale market, rights checks.

The server wallet (`BMUSIC_SERVER_WIF`, env only) is bMusicX's own identity for key wrapping. It never holds
user funds or keys — keep it that way.

## 4. User flows

### 4.1 Artist: upload → rights → mint → list
1. **Connect bWalletX** (BRC-100; any BRC-100 wallet works). Identity key = artist account.
2. **Upload** the Suno download (mp3/m4a/wav, max ~15 MB) plus optional cover, title, lyrics.
   Optional: paste the Suno song link (used for the plan/date check and provenance, never scraped).
3. **Rights check** (one screen, plain words, three ticks the artist must make — not untick):
   - "I made this on Suno while on Pro or Premier." (plan + date of making)
   - "I downloaded it from Suno myself." (no rips, no remix of someone else's song)
   - "It doesn't copy anyone else's song, voice or lyrics."
   We store: attestation text version, Suno terms date, timestamp, artist signature over all of it.
4. **Automatic checks** (seconds): fingerprint vs our catalogue (duplicate), vs a commercial fingerprint
   service (known recordings), lyric/profanity + adult scan, Suno watermark/metadata read where present.
   Pass → continue. Flag → held for review, artist told why.
5. **Choose format:** Single (1/1), Edition (e.g. 100 copies), or Album (bundle of tracks, sold as one).
6. **Price:** suggested defaults (single 1/1 $5; edition copy $0.50; album $3), in $ with sats shown small.
7. **Mint in bWalletX:** one permission sheet, inside the wallet. The artist signs a small "release"
   inscription (record + audio hash + cover + rights attestation hash). The artist pays only the mining fee
   (well under 1¢). No sale yet.
8. **Listed.** Page goes live with the live/coming checklist and a share image.

### 4.2 Buyer: find → buy → own → play
1. Browse store/feed; preview 30 s free (or sponsored full play on first listen, as today).
2. **Buy:** one permission sheet in bWalletX shows song art, price, "you own a copy of #37/100", artist gets
   paid. One transaction: inscribes the buyer's copy (1 sat) + pays the artist + bMusicX fee.
3. Server checks the tx (as the current mint route does), broadcasts, returns the owner key wrapped to the
   buyer. Buyer plays free forever, offline-capable, without our server for key derivation.
4. Copy shows in bWalletX (collectibles / bMusic shelf) with a receipt card.

### 4.3 Resale (v2)
Owner lists their copy at a price via a 1Sat ordinal-lock listing (non-custodial; the copy stays locked to
their key until bought). Buyer pays seller + artist resale cut (default 10%) + bMusicX fee in one tx. New
owner key wrapped to the buyer; old owner's key revoked for new segments.

### 4.4 Tips
Tip button on every track, album and artist page and in the player (shared component). Tips count toward
the artist's rank.

## 5. Rights and safety

- **Plan check:** attestation is the gate (we cannot see a user's Suno plan). Store proof prompts: ask for
  the Suno song link; optional upload of the Suno receipt/screenshot for high-volume sellers. Read Suno's
  embedded metadata/watermark when present and refuse sale if it shows free-tier or non-download status.
- **Attestation record** signed by the artist's identity key, hash inscribed in the release record, so the
  claim is on chain under their name.
- **Duplicates:** chromaprint/AcoustID-style fingerprint against our own catalogue — the same audio can only
  be listed once (first lister wins; disputes go to review). Plus a commercial recognition API
  (ACRCloud or Audible Magic) to catch uploads of label recordings.
- **Takedown / DMCA:** published notice form + designated agent; on a valid notice we delist, stop serving
  audio and stop issuing keys. We cannot erase the inscription, which is why audio is not on chain (§6).
  Counter-notice flow; repeat-infringer policy (3 strikes → artist account off).
- **Moderation:** auto scan (lyrics transcript + profanity + hate/violence classifier), human queue for flags.
  Adult/explicit-sexual content is refused on bMusicX (an X-family site). Strong language allowed with an
  "explicit" label (TERRORNODE ear-check tracks follow this).
- **Voice/likeness:** refuse songs that name or imitate a real artist ("in the voice of…"); report button.
- **Sanctions/age:** sellers 18+ attestation; no KYC in MVP (amounts small); revisit if volumes grow.

## 6. Technical design

**Audio off chain, hash on chain.** Full audio inscriptions cost real money (~3–4 MB per song) and can never
be removed after a takedown. Instead:
- Audio is encrypted with the existing per-second segment scheme and stored on our storage (Hetzner object
  storage or the current stream store; Vercel only serves the page). Later: optional paid storage on bDriveX.
- The **release inscription** (artist-signed, 1Sat ordinal, small JSON) holds: title, artist identity key,
  SHA-256 of the master file, cover (small webp, inline or ORDFS ref), edition size, price, artist pay-to,
  royalty %, rights attestation hash, Suno terms date, key-service URL.
- Each **copy** is a 1Sat ordinal inscribed by the buyer's own wallet, referencing the release origin and
  its copy number (extends the existing `releaseRecord` format; keep the content type).

**1Sat ordinals, not BSV-21, for copies.** Each copy is a distinct item (number, owner, resale history) and
1Sat ordinals already carry the market listing (ordinal lock) and show in BRC-100 wallets. BSV-21 fungible
tokens are kept for the artist's own handle token / room, not for the songs.

**Edition model.** Release declares `edition: N` (1 = original). Server enforces numbering with the existing
reserve-then-broadcast pattern (first valid tx wins copy #k; others refused before broadcast). The release
inscription fixes N, so the artist cannot quietly print more; an indexer counts copies by origin reference.
Album = one release record listing track hashes; one copy unlocks all tracks.

**Payments.** All in one buyer transaction built by the wallet (`createAction`): artist output (BRC-29 to
their identity key, as plays do today), bMusicX fee output, optional co-writer split outputs declared in the
release. No escrow, no server-held money. Self-pay (buyer identity = artist, or same funding source pattern)
is allowed as a purchase but excluded from ranking.

**Ranking.** Rank = total paid to the artist from others (sales + plays + tips), linear, no self-pay, no
lock-based or volume-faked signals. Reuse `app/api/bmusic/leaderboard`.

**Code to add (rough):** `app/upload` (artist flow), `app/api/bmusic/release` create + rights + checks,
edition counter + copy route (generalise `mint/route.ts`), fingerprint worker on Hetzner, moderation queue
page, takedown form, resale listing (v2) via `js-1sat-ord` ordinal lock, migrations for
`bmusic_releases.edition_size / sold / rights_*` and `bmusic_copies`. pnpm only; secrets env-only, never in git.

## 7. Fees

- Minting a release: free to the artist (they pay the mining fee only, under 1¢).
- Primary sale: artist gets 90%, bMusicX 10%.
- Resale (v2): seller 85%, artist 10%, bMusicX 5%.
- Tips and plays: unchanged from today's programme.
- Show every split on the purchase sheet in plain money.

## 8. Milestones

| Phase | Scope | Effort |
|---|---|---|
| **0. TERRORNODE launch** | Our album as a 100-copy edition + 1/1 originals per track, using today's mint route extended for editions. Our own rights (owner made them on a paid plan — confirm). Store page + checklist + share image | ~1 week |
| **1. MVP: open upload** | Upload, rights ticks + signed attestation, own-catalogue fingerprint dupes, lyric/adult scan, single + edition mint, buy sheet, owner key, tips, ranking, takedown form, moderation queue | ~3–4 weeks |
| **2. v2** | Commercial fingerprint API, albums by outsiders, resale via ordinal lock with artist cut, co-writer splits, copies shown in bWalletX shelf, repeat-infringer automation | ~3–4 weeks |
| **3. Later** | bDriveX paid storage, Suno link verification if Suno ever offers an API, other AI tools (Udio etc.) with their own rules table, bChatX room per album | open |

## 9. Risks

- **False attestations** (free-plan songs sold). Mitigate: signed on-chain claim, metadata read, takedown,
  strikes. Residual risk stays with the seller under our terms; ours if we ignore notices.
- **Suno changes terms** again (it did in Sep 2026). Store terms date per listing; rules table not hard code.
- **No copyright in AI output** in some countries — buyers own a copy and its provenance, not a copyright.
  Say so in plain words on the page; never promise exclusivity beyond the edition count.
- **Label recordings uploaded** as "Suno". Commercial fingerprint API in v2; phase 1 relies on review.
- **Inscriptions can't be deleted.** Keep audio and anything personal off chain.
- **Spam floods** of cheap AI songs. Small listing fee option, rate limits per identity, ranking by real pay.
- **Key server is a dependency** for new buyers (owners derive keys themselves). Keep it up; document recovery.

## 10. Open questions for the owner (with recommendations)

1. **Allow free-plan songs at all?** Recommend: upload for private play only, never for sale; MVP hides them.
2. **Fees: 10% primary / 5% + 10% artist on resale?** Recommend: yes, as in §7.
3. **Default edition and prices?** Recommend: 1/1 original $5, edition of 100 at $0.50, album $3; artist can change.
4. **Audio fully on chain as an option?** Recommend: no in MVP (cost, takedowns); hash + cover only.
5. **TERRORNODE first, then open upload?** Recommend: yes — confirm every TERRORNODE track was made and
   downloaded on a paid Suno plan, ear-check the flagged tracks, label any explicit ones.
6. **Commercial fingerprint API spend (ACRCloud/Audible Magic, roughly tens of $/month at our volume)?**
   Recommend: approve for v2; own-catalogue dupes are enough for phase 0–1.

## Live / coming checklist (copy onto the feature page)

- [x] Per-second paid streaming (VexVoid)
- [x] 1/1 original mint, artist paid in the same transaction
- [ ] TERRORNODE edition on sale
- [ ] Upload your Suno song
- [ ] Rights check + duplicate check
- [ ] Editions and albums
- [ ] Tips on every track
- [ ] Resale with artist cut
