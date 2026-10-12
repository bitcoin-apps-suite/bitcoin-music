-- Listener attribution (opt-in) + leaderboard aggregation over the per-second payment rows.
create table if not exists bmusic_listen_claims (
  session text primary key,          -- listener session public key
  identity text not null,            -- wallet identity key that signed the claim
  handle text,
  created_at timestamptz not null default now()
);
create index if not exists bmusic_listen_claims_identity on bmusic_listen_claims(identity);
alter table bmusic_listen_claims enable row level security;

-- Per listener (claimed identity, else the anonymous session) for one album since a time.
create or replace function bmusic_listener_stats(p_album text, p_since timestamptz)
returns table (
  listener text, claimed boolean, handle text, seconds_total bigint, seconds_self_paid bigint, seconds_sponsored bigint,
  sats_self_paid bigint, completed_tracks bigint, distinct_tracks bigint, first_at timestamptz, last_at timestamptz,
  first_claim_rank bigint
) language sql stable as $$
  with p as (
    select coalesce(c.identity, pay.listener) as who, c.identity is not null as claimed,
           pay.track_id, pay.segment, pay.sponsored_by, pay.sats, pay.created_at
    from bmusic_stream_payments pay
    left join bmusic_listen_claims c on c.session = pay.listener
    where pay.album_id = p_album and pay.created_at >= p_since
  ),
  per_track as (
    select p.who, p.track_id, count(distinct p.segment) as segs from p group by 1, 2
  ),
  claim_order as (
    select identity, min(created_at) as first, rank() over (order by min(created_at)) as rnk
    from bmusic_listen_claims group by identity
  )
  select p.who, bool_or(p.claimed),
         (select c.handle from bmusic_listen_claims c where c.identity = p.who and c.handle is not null order by c.created_at desc limit 1),
         count(*), count(*) filter (where p.sponsored_by is null), count(*) filter (where p.sponsored_by is not null),
         coalesce(sum(p.sats) filter (where p.sponsored_by is null), 0),
         (select count(*) from per_track t join bmusic_streams s on s.track_id = t.track_id
            where t.who = p.who and t.segs >= 0.9 * s.segments),
         count(distinct p.track_id), min(p.created_at), max(p.created_at),
         (select o.rnk from claim_order o where o.identity = p.who)
  from p group by p.who
$$;
grant execute on function bmusic_listener_stats(text, timestamptz) to service_role;
