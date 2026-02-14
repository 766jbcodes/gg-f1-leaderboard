-- Store final driver/constructor standings per season for past seasons (2023, 2024, 2025).
-- Used so dashboards can read from Supabase instead of static files.
create table if not exists public.season_standings (
  season int not null,
  championship_type text not null check (championship_type in ('drivers', 'constructors')),
  standings jsonb not null default '[]',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (season, championship_type)
);

alter table public.season_standings enable row level security;

drop policy if exists "Authenticated can read season_standings" on public.season_standings;
create policy "Authenticated can read season_standings"
  on public.season_standings for select to authenticated using (true);

-- Seed 2023
insert into public.season_standings (season, championship_type, standings) values
  (2023, 'drivers', '[
    {"position":1,"driver":"Verstappen","constructor":"Red Bull Racing","points":575},
    {"position":2,"driver":"Pérez","constructor":"Red Bull Racing","points":285},
    {"position":3,"driver":"Hamilton","constructor":"Mercedes","points":234},
    {"position":4,"driver":"Alonso","constructor":"Aston Martin","points":206},
    {"position":5,"driver":"Leclerc","constructor":"Ferrari","points":206},
    {"position":6,"driver":"Norris","constructor":"McLaren","points":205},
    {"position":7,"driver":"Sainz","constructor":"Ferrari","points":200},
    {"position":8,"driver":"Russell","constructor":"Mercedes","points":175},
    {"position":9,"driver":"Piastri","constructor":"McLaren","points":97},
    {"position":10,"driver":"Stroll","constructor":"Aston Martin","points":74},
    {"position":11,"driver":"Gasly","constructor":"Alpine","points":62},
    {"position":12,"driver":"Ocon","constructor":"Alpine","points":58},
    {"position":13,"driver":"Albon","constructor":"Williams","points":27},
    {"position":14,"driver":"Tsunoda","constructor":"AlphaTauri","points":17},
    {"position":15,"driver":"Bottas","constructor":"Alfa Romeo","points":10},
    {"position":16,"driver":"Hülkenberg","constructor":"Haas F1 Team","points":9},
    {"position":17,"driver":"Ricciardo","constructor":"AlphaTauri","points":6},
    {"position":18,"driver":"Zhou","constructor":"Alfa Romeo","points":6},
    {"position":19,"driver":"Magnussen","constructor":"Haas F1 Team","points":3},
    {"position":20,"driver":"Lawson","constructor":"AlphaTauri","points":2},
    {"position":21,"driver":"Sargeant","constructor":"Williams","points":1},
    {"position":22,"driver":"de Vries","constructor":"AlphaTauri","points":0}
  ]'::jsonb),
  (2023, 'constructors', '[
    {"position":1,"constructor":"Red Bull Racing","points":860},
    {"position":2,"constructor":"Mercedes","points":409},
    {"position":3,"constructor":"Ferrari","points":406},
    {"position":4,"constructor":"McLaren","points":302},
    {"position":5,"constructor":"Aston Martin","points":280},
    {"position":6,"constructor":"Alpine","points":120},
    {"position":7,"constructor":"Williams","points":28},
    {"position":8,"constructor":"AlphaTauri","points":25},
    {"position":9,"constructor":"Alfa Romeo","points":16},
    {"position":10,"constructor":"Haas F1 Team","points":12}
  ]'::jsonb)
on conflict (season, championship_type) do nothing;

-- Seed 2024
insert into public.season_standings (season, championship_type, standings) values
  (2024, 'drivers', '[
    {"position":1,"driver":"Verstappen","constructor":"Red Bull Racing","points":437},
    {"position":2,"driver":"Perez","constructor":"Red Bull Racing","points":285},
    {"position":3,"driver":"Leclerc","constructor":"Ferrari","points":308},
    {"position":4,"driver":"Russell","constructor":"Mercedes","points":274},
    {"position":5,"driver":"Norris","constructor":"McLaren","points":287},
    {"position":6,"driver":"Hamilton","constructor":"Mercedes","points":234},
    {"position":7,"driver":"Piastri","constructor":"McLaren","points":205},
    {"position":8,"driver":"Sainz","constructor":"Ferrari","points":200},
    {"position":9,"driver":"Alonso","constructor":"Aston Martin","points":206},
    {"position":10,"driver":"Stroll","constructor":"Aston Martin","points":74},
    {"position":11,"driver":"Gasly","constructor":"Alpine","points":62},
    {"position":12,"driver":"Ocon","constructor":"Alpine","points":58},
    {"position":13,"driver":"Albon","constructor":"Williams","points":27},
    {"position":14,"driver":"Tsunoda","constructor":"RB","points":17},
    {"position":15,"driver":"Bottas","constructor":"Stake F1 Team","points":10},
    {"position":16,"driver":"Hulkenberg","constructor":"Haas F1 Team","points":9},
    {"position":17,"driver":"Ricciardo","constructor":"RB","points":6},
    {"position":18,"driver":"Zhou","constructor":"Stake F1 Team","points":6},
    {"position":19,"driver":"Magnussen","constructor":"Haas F1 Team","points":3},
    {"position":20,"driver":"Lawson","constructor":"RB","points":2},
    {"position":21,"driver":"Sargeant","constructor":"Williams","points":1},
    {"position":22,"driver":"de Vries","constructor":"RB","points":0}
  ]'::jsonb),
  (2024, 'constructors', '[
    {"position":1,"constructor":"Red Bull Racing","points":860},
    {"position":2,"constructor":"Ferrari","points":508},
    {"position":3,"constructor":"McLaren","points":492},
    {"position":4,"constructor":"Mercedes","points":508},
    {"position":5,"constructor":"Aston Martin","points":280},
    {"position":6,"constructor":"Alpine","points":120},
    {"position":7,"constructor":"Williams","points":28},
    {"position":8,"constructor":"RB","points":25},
    {"position":9,"constructor":"Stake F1 Team","points":16},
    {"position":10,"constructor":"Haas F1 Team","points":12}
  ]'::jsonb)
on conflict (season, championship_type) do nothing;

-- Seed 2025
insert into public.season_standings (season, championship_type, standings) values
  (2025, 'drivers', '[
    {"position":1,"driver":"Norris","constructor":"McLaren","points":44},
    {"position":2,"driver":"Verstappen","constructor":"Red Bull Racing","points":36},
    {"position":3,"driver":"Russell","constructor":"Mercedes","points":35},
    {"position":4,"driver":"Piastri","constructor":"McLaren","points":34},
    {"position":5,"driver":"Antonelli","constructor":"Mercedes","points":22},
    {"position":6,"driver":"Albon","constructor":"Williams","points":16},
    {"position":7,"driver":"Ocon","constructor":"Alpine F1 Team","points":10},
    {"position":8,"driver":"Stroll","constructor":"Aston Martin","points":10},
    {"position":9,"driver":"Hamilton","constructor":"Mercedes","points":9},
    {"position":10,"driver":"Leclerc","constructor":"Ferrari","points":8},
    {"position":11,"driver":"Hulkenberg","constructor":"Haas F1 Team","points":6},
    {"position":12,"driver":"Bearman","constructor":"Ferrari","points":4},
    {"position":13,"driver":"Tsunoda","constructor":"RB F1 Team","points":3},
    {"position":14,"driver":"Sainz","constructor":"Ferrari","points":1},
    {"position":15,"driver":"Hadjar","constructor":"Alpine F1 Team","points":0},
    {"position":16,"driver":"Gasly","constructor":"Alpine F1 Team","points":0},
    {"position":17,"driver":"Lawson","constructor":"RB F1 Team","points":0},
    {"position":18,"driver":"Doohan","constructor":"Alpine F1 Team","points":0},
    {"position":19,"driver":"Bortoleto","constructor":"Williams","points":0},
    {"position":20,"driver":"Alonso","constructor":"Aston Martin","points":0}
  ]'::jsonb),
  (2025, 'constructors', '[
    {"position":1,"constructor":"McLaren","points":78},
    {"position":2,"constructor":"Mercedes","points":57},
    {"position":3,"constructor":"Red Bull Racing","points":36},
    {"position":4,"constructor":"Ferrari","points":17},
    {"position":5,"constructor":"Williams","points":17},
    {"position":6,"constructor":"Haas F1 Team","points":14},
    {"position":7,"constructor":"Aston Martin","points":10},
    {"position":8,"constructor":"Sauber","points":6},
    {"position":9,"constructor":"RB F1 Team","points":3},
    {"position":10,"constructor":"Alpine F1 Team","points":0}
  ]'::jsonb)
on conflict (season, championship_type) do nothing;
