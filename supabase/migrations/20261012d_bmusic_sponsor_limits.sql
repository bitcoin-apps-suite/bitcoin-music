-- Per-IP daily limit on sponsored seconds (identity keys are free to mint, so the network address is the
-- meaningful limit). One row per IP per UTC day.
create table if not exists bmusic_sponsor_ip_days (
  ip text not null,
  day date not null,
  seconds int not null default 0,
  primary key (ip, day)
);
alter table bmusic_sponsor_ip_days enable row level security;
