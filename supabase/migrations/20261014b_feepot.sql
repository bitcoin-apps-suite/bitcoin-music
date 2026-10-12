-- Fee pot: network fees on us (bwalletX docs/FEE-POT.md). NOT RUN: owner approves after the server is clean.

create table if not exists feepot_utxos (
  outpoint text primary key,
  sats bigint not null check (sats > 0),
  beef text not null,
  status text not null default 'free' check (status in ('free', 'reserved', 'spent')),
  reserved_until timestamptz
);

create table if not exists feepot_reservations (
  id uuid primary key,
  identity_key text not null,
  kind text not null,
  outpoint text not null references feepot_utxos (outpoint),
  satoshis bigint not null,
  change_sats bigint not null,
  fee_sats bigint not null check (fee_sats between 1 and 500),
  expires_at timestamptz not null,
  used boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists feepot_reservations_key_day on feepot_reservations (identity_key, created_at);

-- First time a key was seen by any bWalletX service (for the 30-day new-user window).
create table if not exists feepot_accounts (
  identity_key text primary key,
  first_seen timestamptz not null default now()
);

create or replace function feepot_usage_for(p_key text)
returns table (user_today int, month_sats bigint, first_seen timestamptz)
language sql security definer set search_path = public as $$
  with acct as (
    insert into feepot_accounts (identity_key) values (p_key)
    on conflict (identity_key) do update set identity_key = excluded.identity_key
    returning first_seen
  )
  select
    (select count(*)::int from feepot_reservations where identity_key = p_key and used and created_at >= date_trunc('day', now() at time zone 'utc')),
    (select coalesce(sum(fee_sats), 0)::bigint from feepot_reservations where used and created_at >= date_trunc('month', now() at time zone 'utc')),
    (select first_seen from acct);
$$;

create or replace function feepot_claim_utxo(p_min_sats bigint, p_ttl_ms int)
returns table (outpoint text, sats bigint, beef text)
language sql security definer set search_path = public as $$
  update feepot_utxos u set status = 'reserved', reserved_until = now() + make_interval(secs => p_ttl_ms / 1000.0)
  where u.outpoint = (
    select outpoint from feepot_utxos
    where sats >= p_min_sats and (status = 'free' or (status = 'reserved' and reserved_until < now()))
    order by sats limit 1 for update skip locked
  )
  returning u.outpoint, u.sats, u.beef;
$$;

alter table feepot_utxos enable row level security;
alter table feepot_reservations enable row level security;
alter table feepot_accounts enable row level security;
revoke all on function feepot_usage_for(text) from public, anon, authenticated;
revoke all on function feepot_claim_utxo(bigint, int) from public, anon, authenticated;
