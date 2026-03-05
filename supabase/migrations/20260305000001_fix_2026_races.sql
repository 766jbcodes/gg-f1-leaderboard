-- Replace placeholder 2026 races with the full correct 24-race calendar.
-- Original seed had Bahrain/Saudi as rounds 1/2 with wrong March dates.
-- Season actually starts in Australia, March 8 2026.
-- qualifying_end_utc = qualifying session start time (prediction deadline).
-- Sprint weekends: China, Miami, Canada, Great Britain, Netherlands, Singapore.

delete from public.races where season = 2026;

insert into public.races (season, round, name, race_start_utc, qualifying_end_utc)
values
  (2026,  1, 'Australian Grand Prix',    '2026-03-08 04:00:00+00', '2026-03-07 05:00:00+00'),
  (2026,  2, 'Chinese Grand Prix',       '2026-03-15 07:00:00+00', '2026-03-14 07:00:00+00'),
  (2026,  3, 'Japanese Grand Prix',      '2026-03-29 05:00:00+00', '2026-03-28 06:00:00+00'),
  (2026,  4, 'Bahrain Grand Prix',       '2026-04-12 15:00:00+00', '2026-04-11 16:00:00+00'),
  (2026,  5, 'Saudi Arabian Grand Prix', '2026-04-19 17:00:00+00', '2026-04-18 17:00:00+00'),
  (2026,  6, 'Miami Grand Prix',         '2026-05-03 20:00:00+00', '2026-05-02 20:00:00+00'),
  (2026,  7, 'Canadian Grand Prix',      '2026-05-24 20:00:00+00', '2026-05-23 20:00:00+00'),
  (2026,  8, 'Monaco Grand Prix',        '2026-06-07 13:00:00+00', '2026-06-06 14:00:00+00'),
  (2026,  9, 'Spanish Grand Prix',       '2026-06-14 13:00:00+00', '2026-06-13 14:00:00+00'),
  (2026, 10, 'Austrian Grand Prix',      '2026-06-28 13:00:00+00', '2026-06-27 14:00:00+00'),
  (2026, 11, 'British Grand Prix',       '2026-07-05 14:00:00+00', '2026-07-04 15:00:00+00'),
  (2026, 12, 'Belgian Grand Prix',       '2026-07-19 13:00:00+00', '2026-07-18 14:00:00+00'),
  (2026, 13, 'Hungarian Grand Prix',     '2026-07-26 13:00:00+00', '2026-07-25 14:00:00+00'),
  (2026, 14, 'Dutch Grand Prix',         '2026-08-23 13:00:00+00', '2026-08-22 14:00:00+00'),
  (2026, 15, 'Italian Grand Prix',       '2026-09-06 13:00:00+00', '2026-09-05 14:00:00+00'),
  (2026, 16, 'Madrid Grand Prix',        '2026-09-13 13:00:00+00', '2026-09-12 14:00:00+00'),
  (2026, 17, 'Azerbaijan Grand Prix',    '2026-09-27 11:00:00+00', '2026-09-26 12:00:00+00'),
  (2026, 18, 'Singapore Grand Prix',     '2026-10-11 12:00:00+00', '2026-10-10 13:00:00+00'),
  (2026, 19, 'United States Grand Prix', '2026-10-25 20:00:00+00', '2026-10-24 21:00:00+00'),
  (2026, 20, 'Mexico City Grand Prix',   '2026-11-01 20:00:00+00', '2026-10-31 21:00:00+00'),
  (2026, 21, 'São Paulo Grand Prix',     '2026-11-08 17:00:00+00', '2026-11-07 18:00:00+00'),
  (2026, 22, 'Las Vegas Grand Prix',     '2026-11-22 04:00:00+00', '2026-11-21 04:00:00+00'),
  (2026, 23, 'Qatar Grand Prix',         '2026-11-29 16:00:00+00', '2026-11-28 18:00:00+00'),
  (2026, 24, 'Abu Dhabi Grand Prix',     '2026-12-06 13:00:00+00', '2026-12-05 14:00:00+00');
