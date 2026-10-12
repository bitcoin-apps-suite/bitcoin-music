-- Mint-on-demand releases (owner, 12 Oct 2026: "defensible, but extensible").
-- A published stream can be minted as a 1/1 original by anyone who pays the artist's mint price.
-- v1: the buyer gets the original (owner key = free play forever, provenance, resale); streaming income stays
-- with the artist. payee_mode 'holder' exists in the format but is refused until it's switched on deliberately.
create table if not exists bmusic_releases (
  release_id text primary key references bmusic_streams(track_id),
  mint_price_sats bigint,                    -- null = not for sale
  payee_mode text not null default 'artist' check (payee_mode in ('artist', 'holder')),
  reserved_by text,                          -- identity holding the 2-minute mint reservation
  reserved_until timestamptz,
  minted_origin text unique,
  minted_by text,                            -- buyer identity key (owner key is wrapped to it)
  minted_at timestamptz,
  created_at timestamptz not null default now()
);
alter table bmusic_releases enable row level security;
insert into bmusic_releases (release_id) select track_id from bmusic_streams on conflict do nothing;
alter table bmusic_streams add column if not exists kind text not null default 'audio';
