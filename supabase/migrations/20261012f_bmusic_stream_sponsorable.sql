-- Per-track switch: may the album's sponsor pot pay for this track? (owner: tracks 7–12 of first-12 are pay to play)
alter table bmusic_streams add column if not exists sponsorable boolean not null default true;
update bmusic_streams set sponsorable = false where album_id = 'first-12' and track_id >= 'first-12-07';
