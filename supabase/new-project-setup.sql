create extension if not exists pgcrypto;

create table if not exists public.cards (
  id uuid not null default gen_random_uuid() primary key,
  theme text not null default 'classic',
  question text not null default 'Will you be my Valentine?',
  yes_message text not null default 'You just made my day!',
  no_button_trick text not null default 'runaway',
  stickers jsonb not null default '[]'::jsonb,
  recipient_name text,
  sender_name text,
  paid boolean not null default false,
  created_at timestamp with time zone not null default now(),
  user_id uuid references auth.users(id) on delete cascade,
  plan text not null default 'basic',
  product_type text not null default 'askout',
  bouquet_data jsonb default null,
  voice_note_url text default null,
  voice_duration integer default null,
  voice_background_image text default null
);

alter table public.cards enable row level security;

drop policy if exists "Anyone can insert cards" on public.cards;
drop policy if exists "Update cards to mark as paid" on public.cards;
drop policy if exists "Allow marking cards as paid" on public.cards;
drop policy if exists "Users can insert their own cards" on public.cards;
drop policy if exists "Users can view their own cards" on public.cards;
drop policy if exists "Anyone can view paid cards" on public.cards;

create policy "Users can insert their own cards"
on public.cards for insert
with check (auth.uid() = user_id);

create policy "Users can view their own cards"
on public.cards for select
using (auth.uid() = user_id);

create policy "Anyone can view paid cards"
on public.cards for select
using (paid = true);

create table if not exists public.profiles (
  id uuid not null default gen_random_uuid() primary key,
  user_id uuid not null unique,
  email text,
  plan text not null default 'free',
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "Users can view own profile" on public.profiles;
drop policy if exists "Users can insert own profile" on public.profiles;
drop policy if exists "Users can update own profile" on public.profiles;

create policy "Users can view own profile"
on public.profiles for select
using (auth.uid() = user_id);

create policy "Users can insert own profile"
on public.profiles for insert
with check (auth.uid() = user_id);

create policy "Users can update own profile"
on public.profiles for update
using (auth.uid() = user_id);

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (user_id, email, plan)
  values (new.id, new.email, 'free')
  on conflict (user_id) do nothing;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql set search_path = public;

drop trigger if exists update_profiles_updated_at on public.profiles;
create trigger update_profiles_updated_at
  before update on public.profiles
  for each row
  execute function public.update_updated_at_column();

insert into storage.buckets (id, name, public)
values
  ('voice-notes', 'voice-notes', true),
  ('voice-backgrounds', 'voice-backgrounds', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "Anyone can view voice notes" on storage.objects;
drop policy if exists "Authenticated users can upload voice notes" on storage.objects;
drop policy if exists "Users can delete own voice notes" on storage.objects;
drop policy if exists "Anyone can view voice backgrounds" on storage.objects;
drop policy if exists "Authenticated users can upload voice backgrounds" on storage.objects;
drop policy if exists "Users can delete own voice backgrounds" on storage.objects;

create policy "Anyone can view voice notes"
on storage.objects for select
using (bucket_id = 'voice-notes');

create policy "Authenticated users can upload voice notes"
on storage.objects for insert
with check (bucket_id = 'voice-notes' and auth.uid() is not null);

create policy "Users can delete own voice notes"
on storage.objects for delete
using (bucket_id = 'voice-notes' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Anyone can view voice backgrounds"
on storage.objects for select
using (bucket_id = 'voice-backgrounds');

create policy "Authenticated users can upload voice backgrounds"
on storage.objects for insert
with check (bucket_id = 'voice-backgrounds' and auth.uid() is not null);

create policy "Users can delete own voice backgrounds"
on storage.objects for delete
using (bucket_id = 'voice-backgrounds' and auth.uid()::text = (storage.foldername(name))[1]);
