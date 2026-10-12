-- bMusic artist programme (bwalletX docs/ARTIST-PROGRAMME.md). NOT RUN: owner approves after the server is clean.
-- Service-role only (RLS on, no policies), like the other bmusic_* tables.

create sequence if not exists bmusic_artist_join_seq;

create table if not exists bmusic_artists (
  slug text primary key check (slug ~ '^[a-z0-9-]{2,40}$'),
  name text not null,
  identity_key text not null,
  joined_order int not null default nextval('bmusic_artist_join_seq'),
  joined_at timestamptz not null default now(),
  pot_share_pct int not null default 10 check (pot_share_pct between 0 and 50)
);
create index if not exists bmusic_artists_key on bmusic_artists (identity_key);

create table if not exists bmusic_artist_tracks (
  track_id text primary key,
  slug text not null references bmusic_artists (slug) on delete cascade,
  price_sats bigint not null default 0 check (price_sats >= 0),
  sponsored boolean not null default true
);

-- Money paid to an artist (paid stream time, tips, originals, tickets): the rank input (owner, 12 Oct 2026).
-- Filled by the stats job from bmusic_stream_payments / sales. usd_cents = value at time of payment when known.
create table if not exists bmusic_artist_payments (
  id bigserial primary key,
  slug text not null references bmusic_artists (slug) on delete cascade,
  payer_key text not null,
  payer_name text,
  kind text not null check (kind in ('stream', 'tip', 'original', 'ticket')),
  sats bigint not null check (sats > 0),
  usd_cents bigint,
  txid text,
  paid_at timestamptz not null default now()
);
create index if not exists bmusic_artist_payments_slug on bmusic_artist_payments (slug, paid_at);

-- The artist's linked wallets (besides bmusic_artists.identity_key): their payments never count toward rank.
create table if not exists bmusic_artist_linked_keys (
  slug text not null references bmusic_artists (slug) on delete cascade,
  key text not null,
  primary key (slug, key)
);

-- Fans' (and the artist's own) locks in an artist's pot. Kept for the Locks screen; NOT listed as backers and
-- NOT in rank (locks are refundable). verified=false until the on-chain check.
create sequence if not exists bmusic_backer_seq;
create table if not exists bmusic_artist_backings (
  id bigserial primary key,
  slug text not null references bmusic_artists (slug) on delete cascade,
  backer_key text not null,
  backer_name text,
  txids text[] not null,
  sats bigint not null check (sats > 0),
  unlock_height int not null,
  unlock_at timestamptz,
  backer_order int not null default nextval('bmusic_backer_seq'),
  is_artist boolean not null default false,
  verified boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists bmusic_artist_backings_slug on bmusic_artist_backings (slug, verified);

-- Rolling numbers per artist, refreshed by a job from bmusic_stream_payments / sales.
create table if not exists bmusic_artist_stats (
  slug text primary key references bmusic_artists (slug) on delete cascade,
  plays_30d int not null default 0,
  new_listeners_30d int not null default 0,
  sales_sats bigint not null default 0,
  pot_sats bigint not null default 0,
  sponsored_plays int not null default 0,
  sponsored_sats bigint not null default 0,
  referral_owed_sats bigint not null default 0,
  updated_at timestamptz not null default now()
);

-- Referral attribution (one artist per fan, from the funnel share link) and fee accrual; payouts later.
create table if not exists bmusic_referrals (
  fan_key text primary key,
  slug text not null references bmusic_artists (slug) on delete cascade,
  signed_up_at timestamptz not null default now()
);
create table if not exists bmusic_referral_accruals (
  id bigserial primary key,
  slug text not null,
  fan_key text not null,
  fee_txid text not null,
  fee_sats bigint not null,
  share_sats bigint not null,
  fee_at timestamptz not null,
  paid_txid text,
  unique (fee_txid, fan_key)
);

alter table bmusic_artists enable row level security;
alter table bmusic_artist_tracks enable row level security;
alter table bmusic_artist_backings enable row level security;
alter table bmusic_artist_stats enable row level security;
alter table bmusic_referrals enable row level security;
alter table bmusic_referral_accruals enable row level security;
