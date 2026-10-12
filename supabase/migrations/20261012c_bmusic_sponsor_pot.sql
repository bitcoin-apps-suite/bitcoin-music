-- Artist sponsor pot (owner decision 12 Oct 2026: option 1, held by the bMusic server, capped at $5).
-- The pot is a key the server derives for itself per artist; the artist funds it, listeners' seconds are paid
-- from it (1 sat to the artist via BRC-29 + the network fee), and the rest can be swept back to the artist.
create table if not exists bmusic_sponsor_pots (
  pot text primary key,                -- e.g. 'vexvoid'
  album_id text not null,
  address text not null,               -- funding address (server-derived key)
  cap_sats bigint not null,            -- hard cap on total sponsored spend (sats paid + fees)
  spent_sats bigint not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);
-- UTXOs of the pot, split into chunks; each listening session holds one and chains its change.
create table if not exists bmusic_sponsor_utxos (
  outpoint text primary key,           -- txid.vout
  pot text not null references bmusic_sponsor_pots(pot),
  sats bigint not null,
  status text not null default 'free', -- free | held | spent
  holder text,                         -- listener session key
  held_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists bmusic_sponsor_utxos_free on bmusic_sponsor_utxos(pot, status);
alter table bmusic_stream_payments add column if not exists sponsored_by text;
alter table bmusic_stream_payments add column if not exists fee int;
alter table bmusic_sponsor_pots enable row level security;
alter table bmusic_sponsor_utxos enable row level security;
