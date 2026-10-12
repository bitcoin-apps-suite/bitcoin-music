-- BRC-29 payouts for streams: artist identity per track (sender = bMusic server), payment details per paid second.
alter table bmusic_streams add column if not exists artist_identity text;
alter table bmusic_stream_payments add column if not exists album_id text;
alter table bmusic_stream_payments add column if not exists output_index int;
alter table bmusic_stream_payments add column if not exists sats int;
alter table bmusic_stream_payments add column if not exists derivation_prefix text;
alter table bmusic_stream_payments add column if not exists derivation_suffix text;
create index if not exists bmusic_stream_payments_album on bmusic_stream_payments(album_id, created_at);
