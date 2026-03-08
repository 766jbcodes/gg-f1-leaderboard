-- Emma's weekly prediction for Australian GP (Melbourne)
INSERT INTO public.weekly_predictions (user_id, race_id, top10_driver_names)
VALUES (
  '3b286215-10de-4f7f-9b08-358458a098f0',
  (SELECT id FROM public.races WHERE season = 2026 AND round = 1),
  '["Russell", "Leclerc", "Piastri", "Antonelli", "Norris", "Hadjar", "Hamilton", "Hulkenberg", "Verstappen", "Ocon"]'
)
ON CONFLICT (user_id, race_id)
DO UPDATE SET
  top10_driver_names = EXCLUDED.top10_driver_names,
  updated_at = now();

-- Jeremy's weekly prediction for Australian GP (Melbourne)
INSERT INTO public.weekly_predictions (user_id, race_id, top10_driver_names)
VALUES (
  'a575851e-aaae-4870-9a7d-bb2baec234ae',
  (SELECT id FROM public.races WHERE season = 2026 AND round = 1),
  '["Russell", "Leclerc", "Piastri", "Antonelli", "Hadjar", "Norris", "Hamilton", "Verstappen", "Lawson", "Lindblad"]'
)
ON CONFLICT (user_id, race_id)
DO UPDATE SET
  top10_driver_names = EXCLUDED.top10_driver_names,
  updated_at = now();
