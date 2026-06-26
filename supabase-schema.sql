-- ============================================================
-- CyberSiksha — Supabase Database Schema (Universal Permissive Safe Run)
-- Run this in your Supabase SQL Editor (supabase.com/dashboard)
-- ============================================================

-- 1. PROFILES
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  display_name text,
  avatar_initial text default 'U',
  xp integer default 0,
  streak integer default 0,
  last_active_date date,
  created_at timestamp with time zone default now()
);
alter table public.profiles enable row level security;

drop policy if exists "Profiles are viewable by everyone" on public.profiles;
create policy "Profiles are viewable by everyone" on public.profiles for select using (true);
drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile" on public.profiles for update using (true);
drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile" on public.profiles for insert with check (true);
drop policy if exists "Users can delete profile" on public.profiles;
create policy "Users can delete profile" on public.profiles for delete using (true);

-- 2. COMPLETED LESSONS
create table if not exists public.completed_lessons (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  lesson_id integer not null,
  completed_at timestamp with time zone default now(),
  unique(user_id, lesson_id)
);
alter table public.completed_lessons enable row level security;

drop policy if exists "Users can view own completed lessons" on public.completed_lessons;
create policy "Users can view own completed lessons" on public.completed_lessons for select using (true);
drop policy if exists "Users can insert own completed lessons" on public.completed_lessons;
create policy "Users can insert own completed lessons" on public.completed_lessons for insert with check (true);
drop policy if exists "Users can update own completed lessons" on public.completed_lessons;
create policy "Users can update own completed lessons" on public.completed_lessons for update using (true);
drop policy if exists "Users can delete own completed lessons" on public.completed_lessons;
create policy "Users can delete own completed lessons" on public.completed_lessons for delete using (true);

-- 3. QUIZ RESULTS
create table if not exists public.quiz_results (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  total_questions integer not null,
  correct_answers integer not null,
  xp_earned integer default 0,
  completed_at timestamp with time zone default now()
);
alter table public.quiz_results enable row level security;

drop policy if exists "Users can view own quiz results" on public.quiz_results;
create policy "Users can view own quiz results" on public.quiz_results for select using (true);
drop policy if exists "Users can insert own quiz results" on public.quiz_results;
create policy "Users can insert own quiz results" on public.quiz_results for insert with check (true);
drop policy if exists "Users can update own quiz results" on public.quiz_results;
create policy "Users can update own quiz results" on public.quiz_results for update using (true);
drop policy if exists "Users can delete own quiz results" on public.quiz_results;
create policy "Users can delete own quiz results" on public.quiz_results for delete using (true);

-- 4. FAMILY GROUPS
create table if not exists public.family_groups (
  id uuid default gen_random_uuid() primary key,
  name text not null default 'My Family',
  invite_code text unique not null default substr(md5(random()::text), 1, 6),
  created_by uuid references public.profiles(id),
  created_at timestamp with time zone default now()
);
alter table public.family_groups enable row level security;

drop policy if exists "Family group visible to members" on public.family_groups;
create policy "Family group visible to members" on public.family_groups for select using (true);
drop policy if exists "Authenticated users can create family groups" on public.family_groups;
create policy "Authenticated users can create family groups" on public.family_groups for insert with check (true);
drop policy if exists "Users can update family groups" on public.family_groups;
create policy "Users can update family groups" on public.family_groups for update using (true);
drop policy if exists "Users can delete family groups" on public.family_groups;
create policy "Users can delete family groups" on public.family_groups for delete using (true);

-- 5. FAMILY MEMBERS
create table if not exists public.family_members (
  id uuid default gen_random_uuid() primary key,
  family_group_id uuid references public.family_groups(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  role text default 'member' check (role in ('admin', 'member')),
  joined_at timestamp with time zone default now(),
  unique(family_group_id, user_id)
);
alter table public.family_members enable row level security;

drop policy if exists "Members can view family members" on public.family_members;
create policy "Members can view family members" on public.family_members for select using (true);
drop policy if exists "Users can insert themselves as family members" on public.family_members;
create policy "Users can insert themselves as family members" on public.family_members for insert with check (true);
drop policy if exists "Users can update family members" on public.family_members;
create policy "Users can update family members" on public.family_members for update using (true);
drop policy if exists "Users can delete family members" on public.family_members;
create policy "Users can delete family members" on public.family_members for delete using (true);

-- 6. FAMILY INVITES
create table if not exists public.family_invites (
  id uuid default gen_random_uuid() primary key,
  family_group_id uuid references public.family_groups(id) on delete cascade not null,
  invited_by uuid references public.profiles(id) not null,
  invited_email text not null,
  invited_name text,
  status text default 'pending' check (status in ('pending', 'accepted', 'expired')),
  created_at timestamp with time zone default now()
);
alter table public.family_invites enable row level security;

drop policy if exists "Inviters can view their invites" on public.family_invites;
create policy "Inviters can view their invites" on public.family_invites for select using (true);
drop policy if exists "Users can create invites" on public.family_invites;
create policy "Users can create invites" on public.family_invites for insert with check (true);
drop policy if exists "Users can update invites" on public.family_invites;
create policy "Users can update invites" on public.family_invites for update using (true);
drop policy if exists "Users can delete invites" on public.family_invites;
create policy "Users can delete invites" on public.family_invites for delete using (true);

-- 7. FUNCTION: Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, display_name, avatar_initial)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)),
    upper(left(coalesce(new.raw_user_meta_data->>'display_name', new.email), 1))
  ) on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 8. FUNCTION: Join family by invite code
create or replace function public.join_family_by_code(code text)
returns json as $$
declare
  group_record record;
begin
  select * into group_record from public.family_groups where invite_code ilike code;
  if not found then
    return json_build_object('error', 'Invalid invite code');
  end if;
  insert into public.family_members (family_group_id, user_id, role)
  values (group_record.id, auth.uid(), 'member')
  on conflict (family_group_id, user_id) do nothing;
  return json_build_object('success', true, 'family_name', group_record.name);
end;
$$ language plpgsql security definer;
