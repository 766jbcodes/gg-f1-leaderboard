-- One-off: seed 2023, 2024, 2025 season_predictions from static data.
-- Only inserts for profiles that have participant_id in ('emma','jeremy','laura','jacob').
-- Run in Supabase SQL Editor if you prefer over npm run migrate:predictions.

-- 2023 constructors only
insert into public.season_predictions (user_id, season, championship_type, predictions)
select id, 2023, 'constructors', '["Red Bull Racing","Ferrari","Mercedes","Aston Martin","Alpine F1 Team","McLaren","Haas F1 Team","Alfa Romeo","AlphaTauri","Williams"]'::jsonb
from public.profiles where participant_id = 'emma'
on conflict (user_id, season, championship_type) do update set predictions = excluded.predictions, updated_at = now();

insert into public.season_predictions (user_id, season, championship_type, predictions)
select id, 2023, 'constructors', '["Red Bull Racing","Mercedes","Ferrari","Aston Martin","Alpine F1 Team","Alfa Romeo","McLaren","Haas F1 Team","AlphaTauri","Williams"]'::jsonb
from public.profiles where participant_id = 'jeremy'
on conflict (user_id, season, championship_type) do update set predictions = excluded.predictions, updated_at = now();

insert into public.season_predictions (user_id, season, championship_type, predictions)
select id, 2023, 'constructors', '["Red Bull Racing","Mercedes","Ferrari","Alpine F1 Team","McLaren","Aston Martin","Alfa Romeo","Haas F1 Team","AlphaTauri","Williams"]'::jsonb
from public.profiles where participant_id = 'laura'
on conflict (user_id, season, championship_type) do update set predictions = excluded.predictions, updated_at = now();

insert into public.season_predictions (user_id, season, championship_type, predictions)
select id, 2023, 'constructors', '["Red Bull Racing","Mercedes","Ferrari","McLaren","Alpine F1 Team","Aston Martin","Alfa Romeo","Haas F1 Team","AlphaTauri","Williams"]'::jsonb
from public.profiles where participant_id = 'jacob'
on conflict (user_id, season, championship_type) do update set predictions = excluded.predictions, updated_at = now();

-- 2024 drivers only
insert into public.season_predictions (user_id, season, championship_type, predictions)
select id, 2024, 'drivers', '["Verstappen","Leclerc","Hamilton","Norris","Perez","Russell","Sainz","Piastri","Alonso","Albon","Stroll","Tsunoda","Ricciardo","Gasly","Ocon","Magnussen","Bottas","Hulkenberg","Zhou","Sargeant"]'::jsonb
from public.profiles where participant_id = 'emma'
on conflict (user_id, season, championship_type) do update set predictions = excluded.predictions, updated_at = now();

insert into public.season_predictions (user_id, season, championship_type, predictions)
select id, 2024, 'drivers', '["Verstappen","Hamilton","Perez","Leclerc","Norris","Russell","Sainz","Alonso","Piastri","Ricciardo","Tsunoda","Stroll","Gasly","Albon","Ocon","Bottas","Sargeant","Hulkenberg","Zhou","Magnussen"]'::jsonb
from public.profiles where participant_id = 'jeremy'
on conflict (user_id, season, championship_type) do update set predictions = excluded.predictions, updated_at = now();

insert into public.season_predictions (user_id, season, championship_type, predictions)
select id, 2024, 'drivers', '["Verstappen","Leclerc","Perez","Norris","Alonso","Piastri","Russell","Hamilton","Sainz","Stroll","Tsunoda","Gasly","Ocon","Albon","Ricciardo","Zhou","Magnussen","Hulkenberg","Sargeant","Magnussen"]'::jsonb
from public.profiles where participant_id = 'laura'
on conflict (user_id, season, championship_type) do update set predictions = excluded.predictions, updated_at = now();

insert into public.season_predictions (user_id, season, championship_type, predictions)
select id, 2024, 'drivers', '["Verstappen","Perez","Leclerc","Norris","Hamilton","Sainz","Piastri","Alonso","Russell","Ricciardo","Stroll","Tsunoda","Gasly","Ocon","Albon","Bottas","Hulkenberg","Zhou","Sargeant","Magnussen"]'::jsonb
from public.profiles where participant_id = 'jacob'
on conflict (user_id, season, championship_type) do update set predictions = excluded.predictions, updated_at = now();

-- 2025 drivers
insert into public.season_predictions (user_id, season, championship_type, predictions)
select id, 2025, 'drivers', '["Verstappen","Hamilton","Norris","Piastri","Leclerc","Russell","Sainz","Lawson","Antonelli","Albon","Gasly","Ocon","Alonso","Doohan","Tsunoda","Hadjar","Bearman","Stroll","Hulkenberg","Bortoleto"]'::jsonb
from public.profiles where participant_id = 'emma'
on conflict (user_id, season, championship_type) do update set predictions = excluded.predictions, updated_at = now();

insert into public.season_predictions (user_id, season, championship_type, predictions)
select id, 2025, 'drivers', '["Piastri","Verstappen","Norris","Leclerc","Hamilton","Russell","Lawson","Antonelli","Gasly","Albon","Sainz","Tsunoda","Ocon","Alonso","Doohan","Hadjar","Bearman","Stroll","Hulkenberg","Bortoleto"]'::jsonb
from public.profiles where participant_id = 'jeremy'
on conflict (user_id, season, championship_type) do update set predictions = excluded.predictions, updated_at = now();

insert into public.season_predictions (user_id, season, championship_type, predictions)
select id, 2025, 'drivers', '["Verstappen","Norris","Piastri","Leclerc","Hamilton","Russell","Lawson","Antonelli","Alonso","Sainz","Albon","Gasly","Stroll","Hulkenberg","Bearman","Tsunoda","Ocon","Bortoleto","Hadjar","Doohan"]'::jsonb
from public.profiles where participant_id = 'laura'
on conflict (user_id, season, championship_type) do update set predictions = excluded.predictions, updated_at = now();

insert into public.season_predictions (user_id, season, championship_type, predictions)
select id, 2025, 'drivers', '["Norris","Verstappen","Piastri","Leclerc","Hamilton","Russell","Lawson","Antonelli","Alonso","Sainz","Albon","Gasly","Stroll","Hulkenberg","Bearman","Tsunoda","Ocon","Bortoleto","Hadjar","Doohan"]'::jsonb
from public.profiles where participant_id = 'jacob'
on conflict (user_id, season, championship_type) do update set predictions = excluded.predictions, updated_at = now();

-- 2025 constructors
insert into public.season_predictions (user_id, season, championship_type, predictions)
select id, 2025, 'constructors', '["McLaren","Ferrari","Red Bull Racing","Mercedes","Williams","Alpine F1 Team","Haas F1 Team","RB F1 Team","Aston Martin","Sauber"]'::jsonb
from public.profiles where participant_id = 'emma'
on conflict (user_id, season, championship_type) do update set predictions = excluded.predictions, updated_at = now();

insert into public.season_predictions (user_id, season, championship_type, predictions)
select id, 2025, 'constructors', '["McLaren","Ferrari","Red Bull Racing","Mercedes","Alpine F1 Team","Williams","RB F1 Team","Haas F1 Team","Aston Martin","Sauber"]'::jsonb
from public.profiles where participant_id = 'jeremy'
on conflict (user_id, season, championship_type) do update set predictions = excluded.predictions, updated_at = now();

insert into public.season_predictions (user_id, season, championship_type, predictions)
select id, 2025, 'constructors', '["McLaren","Ferrari","Red Bull Racing","Mercedes","Aston Martin","Williams","Haas F1 Team","Alpine F1 Team","RB F1 Team","Sauber"]'::jsonb
from public.profiles where participant_id = 'laura'
on conflict (user_id, season, championship_type) do update set predictions = excluded.predictions, updated_at = now();

insert into public.season_predictions (user_id, season, championship_type, predictions)
select id, 2025, 'constructors', '["McLaren","Ferrari","Mercedes","Red Bull Racing","Aston Martin","Williams","Haas F1 Team","RB F1 Team","Alpine F1 Team","Sauber"]'::jsonb
from public.profiles where participant_id = 'jacob'
on conflict (user_id, season, championship_type) do update set predictions = excluded.predictions, updated_at = now();
