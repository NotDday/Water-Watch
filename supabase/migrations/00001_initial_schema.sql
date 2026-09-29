-- Cherthala Water Watch — Supabase / PostgreSQL schema
-- Run this migration in the Supabase SQL editor or via `supabase db push`.

-- ─── Enums ──────────────────────────────────────────────────────────────────

create type public.complaint_status as enum (
  'Submitted',
  'Under Investigation',
  'Action Taken',
  'Resolved'
);

create type public.risk_level as enum (
  'Low',
  'Moderate',
  'High',
  'Critical'
);

-- ─── Profiles (extends auth.users) ─────────────────────────────────────────

create table public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  full_name   text,
  phone       text,
  avatar_url  text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Auto-create a profile row when a new user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ─── Stations ───────────────────────────────────────────────────────────────

create table public.stations (
  id          uuid primary key default gen_random_uuid(),
  name        text    not null,
  location    text    not null,
  lat         float8  not null,
  lng         float8  not null,
  created_at  timestamptz not null default now()
);

-- ─── Sensor Readings ────────────────────────────────────────────────────────

create table public.sensor_readings (
  id          uuid primary key default gen_random_uuid(),
  station_id  uuid    not null references public.stations (id) on delete cascade,
  ec          float8  not null,
  tds         float8  not null,
  ph          float8  not null,
  temperature float8  not null,
  water_level float8  not null,
  recorded_at timestamptz not null default now()
);

create index idx_readings_station_time
  on public.sensor_readings (station_id, recorded_at desc);

-- ─── Predictions ────────────────────────────────────────────────────────────

create table public.predictions (
  id                  uuid primary key default gen_random_uuid(),
  station_id          uuid       not null references public.stations (id) on delete cascade,
  risk_probability    float8     not null check (risk_probability between 0 and 1),
  risk_level          public.risk_level not null,
  prediction_horizon  text       not null,
  created_at          timestamptz not null default now()
);

create index idx_predictions_station
  on public.predictions (station_id, created_at desc);

-- ─── Complaints ─────────────────────────────────────────────────────────────

create table public.complaints (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid    not null references auth.users (id) on delete cascade,
  category    text    not null,
  description text    not null,
  photo_url   text,
  location    text    not null,
  status      public.complaint_status not null default 'Submitted',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index idx_complaints_user on public.complaints (user_id);

-- ─── Row-Level Security ────────────────────────────────────────────────────

alter table public.profiles       enable row level security;
alter table public.stations       enable row level security;
alter table public.sensor_readings enable row level security;
alter table public.predictions    enable row level security;
alter table public.complaints     enable row level security;

-- Profiles: users can read/update their own row
create policy "Users can view own profile"
  on public.profiles for select using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

-- Stations: authenticated users can read
create policy "Authenticated users can read stations"
  on public.stations for select to authenticated using (true);

-- Sensor readings: authenticated users can read
create policy "Authenticated users can read readings"
  on public.sensor_readings for select to authenticated using (true);

-- Predictions: authenticated users can read
create policy "Authenticated users can read predictions"
  on public.predictions for select to authenticated using (true);

-- Complaints: users can read own, insert own, update own
create policy "Users can view own complaints"
  on public.complaints for select using (auth.uid() = user_id);

create policy "Users can submit complaints"
  on public.complaints for insert with check (auth.uid() = user_id);

create policy "Users can update own complaints"
  on public.complaints for update using (auth.uid() = user_id);

-- ─── Seed Data (monitoring stations) ────────────────────────────────────────

insert into public.stations (name, location, lat, lng) values
  ('Vembanad Lake Inlet (North)', 'North Cherthala',  9.6833, 76.3333),
  ('Kuttanad Boundary Canal',     'South Cherthala',  9.6100, 76.3500),
  ('Arookutty Coastal Point',     'Arookutty',        9.8167, 76.3167);
