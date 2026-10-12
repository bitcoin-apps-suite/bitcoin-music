-- bMusic per-second streaming demo: one row per track (secret encrypted at rest), one row per paid second.
create table if not exists bmusic_streams (
  track_id text primary key,
  album_id text not null,
  title text not null,
  artist_address text not null,
  segments int not null,
  sats_per_segment int not null default 1,
  secret_enc text not null,
  created_at timestamptz not null default now()
);
create table if not exists bmusic_stream_payments (
  txid text primary key,
  track_id text not null references bmusic_streams(track_id),
  segment int not null,
  listener text not null,
  created_at timestamptz not null default now()
);
create index if not exists bmusic_stream_payments_track on bmusic_stream_payments(track_id, created_at);
alter table bmusic_streams enable row level security;
alter table bmusic_stream_payments enable row level security;
