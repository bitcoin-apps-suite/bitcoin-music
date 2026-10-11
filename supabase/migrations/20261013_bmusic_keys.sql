-- bMusic key server v1 (docs/STREAMING-SPEC.md §5–6).
-- Track keys are stored encrypted at rest (AES-256-GCM under BMUSIC_KEYSTORE_SECRET, which never enters the DB).
-- Only the service role touches these tables; no RLS policies are granted to anon/authenticated.

create table if not exists bmusic_tracks (
  origin text primary key,                 -- <txid>_<vout> of the sealed inscription
  key_hash text not null,                  -- sha256(track key), as inscribed
  key_enc text not null,                   -- base64 iv|tag|ct of the track key under the keystore secret
  artist_identity text not null,           -- identity key that registered it (its address = the artist payee)
  play_rule jsonb not null,                -- the inscribed play rule (Points, price)
  content_type text not null,              -- original media type (MAP origType)
  created_at timestamptz not null default now()
);

create table if not exists bmusic_plays (
  reference text primary key,              -- random id handed out with a quote
  origin text not null references bmusic_tracks(origin),
  listener_identity text not null,
  outputs jsonb not null,                  -- [{ role, lockingScript, satoshis }] the play tx must contain
  derivation jsonb,                        -- BRC-29 prefix/suffix for bMusic's own output (to internalize later)
  sats_total bigint not null,
  status text not null default 'quoted' check (status in ('quoted', 'paid')),
  txid text unique,                        -- one play per transaction
  expires_at timestamptz not null,
  created_at timestamptz not null default now(),
  paid_at timestamptz
);

create index if not exists bmusic_plays_origin_idx on bmusic_plays (origin, status);

alter table bmusic_tracks enable row level security;
alter table bmusic_plays enable row level security;
