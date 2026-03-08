-- Emma's 2026 constructor predictions
INSERT INTO public.season_predictions (user_id, season, championship_type, predictions)
VALUES (
  '3b286215-10de-4f7f-9b08-358458a098f0',
  2026,
  'constructors',
  '["Mercedes", "McLaren", "Ferrari", "Red Bull Racing", "Audi", "Racing Bulls", "Williams", "Aston Martin", "Haas", "Alpine", "Cadillac"]'
)
ON CONFLICT (user_id, season, championship_type)
DO UPDATE SET predictions = EXCLUDED.predictions, updated_at = now();

-- Emma's 2026 driver predictions
INSERT INTO public.season_predictions (user_id, season, championship_type, predictions)
VALUES (
  '3b286215-10de-4f7f-9b08-358458a098f0',
  2026,
  'drivers',
  '["Russell", "Piastri", "Verstappen", "Leclerc", "Norris", "Antonelli", "Hamilton", "Hadjar", "Lindblad", "Sainz", "Hulkenberg", "Lawson", "Bortoleto", "Albon", "Gasly", "Alonso", "Ocon", "Bearman", "Stroll", "Colapinto", "Bottas", "Perez"]'
)
ON CONFLICT (user_id, season, championship_type)
DO UPDATE SET predictions = EXCLUDED.predictions, updated_at = now();

-- Jeremy's 2026 constructor predictions
INSERT INTO public.season_predictions (user_id, season, championship_type, predictions)
VALUES (
  'a575851e-aaae-4870-9a7d-bb2baec234ae',
  2026,
  'constructors',
  '["Mercedes", "Ferrari", "McLaren", "Red Bull Racing", "Audi", "Racing Bulls", "Williams", "Haas", "Alpine", "Aston Martin", "Cadillac"]'
)
ON CONFLICT (user_id, season, championship_type)
DO UPDATE SET predictions = EXCLUDED.predictions, updated_at = now();

-- Jeremy's 2026 driver predictions
INSERT INTO public.season_predictions (user_id, season, championship_type, predictions)
VALUES (
  'a575851e-aaae-4870-9a7d-bb2baec234ae',
  2026,
  'drivers',
  '["Russell", "Leclerc", "Verstappen", "Piastri", "Antonelli", "Hamilton", "Norris", "Hadjar", "Bortoleto", "Sainz", "Hulkenberg", "Lawson", "Lindblad", "Albon", "Bearman", "Gasly", "Alonso", "Ocon", "Colapinto", "Stroll", "Bottas", "Perez"]'
)
ON CONFLICT (user_id, season, championship_type)
DO UPDATE SET predictions = EXCLUDED.predictions, updated_at = now();
