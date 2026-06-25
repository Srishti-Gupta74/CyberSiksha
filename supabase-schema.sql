-- ============================================================
-- CyberSiksha — Supabase Database Schema
-- Run this in your Supabase SQL Editor (supabase.com/dashboard)
-- ============================================================

-- 1. PROFILES — extends auth.users with app-specific data
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  display_name text,
  avatar_initial text default 'U',
  xp integer default 0,
  streak integer default 0,
  last_active_date date,
  created_at timestamp with time zone default now()
);

-- Enable Row Level Security
alter table public.profiles enable row level security;

-- Users can read any profile (for family dashboard)
create policy "Profiles are viewable by everyone" on public.profiles
  for select using (true);

-- Users can update their own profile
create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

-- Users can insert their own profile
create policy "Users can insert own profile" on public.profiles
  for insert with check (auth.uid() = id);

-- 2. COMPLETED LESSONS — tracks which lessons a user has finished
create table if not exists public.completed_lessons (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  lesson_id integer not null,
  completed_at timestamp with time zone default now(),
  unique(user_id, lesson_id)
);

alter table public.completed_lessons enable row level security;

create policy "Users can view own completed lessons" on public.completed_lessons
  for select using (auth.uid() = user_id);

create policy "Users can insert own completed lessons" on public.completed_lessons
  for insert with check (auth.uid() = user_id);



-- 3. QUIZ RESULTS — stores quiz session results
create table if not exists public.quiz_results (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  total_questions integer not null,
  correct_answers integer not null,
  xp_earned integer default 0,
  completed_at timestamp with time zone default now()
);

alter table public.quiz_results enable row level security;

create policy "Users can view own quiz results" on public.quiz_results
  for select using (auth.uid() = user_id);

create policy "Users can insert own quiz results" on public.quiz_results
  for insert with check (auth.uid() = user_id);

-- 4. FAMILY GROUPS — a family unit that members belong to
create table if not exists public.family_groups (
  id uuid default gen_random_uuid() primary key,
  name text not null default 'My Family',
  invite_code text unique not null default substr(md5(random()::text), 1, 6),
  created_by uuid references public.profiles(id),
  created_at timestamp with time zone default now()
);

alter table public.family_groups enable row level security;



-- 5. FAMILY MEMBERS — links users to family groups
create table if not exists public.family_members (
  id uuid default gen_random_uuid() primary key,
  family_group_id uuid references public.family_groups(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  role text default 'member' check (role in ('admin', 'member')),
  joined_at timestamp with time zone default now(),
  unique(family_group_id, user_id)
);

alter table public.family_members enable row level security;

create policy "Members can view family members" on public.family_members
  for select using ( true );

create policy "Users can insert themselves as family members" on public.family_members
  for insert with check (auth.uid() = user_id);

-- Family Group Policies (added here because they reference family_members)
create policy "Family group visible to members" on public.family_groups
  for select using (
    id in (select family_group_id from public.family_members where user_id = auth.uid())
    or created_by = auth.uid()
  );

create policy "Authenticated users can create family groups" on public.family_groups
  for insert with check (auth.uid() = created_by);

-- Completed Lessons Policy (added here because it references family_members)
create policy "Family members can view completed lessons" on public.completed_lessons
  for select using (
    user_id in (
      select fm2.user_id from public.family_members fm1
      join public.family_members fm2 on fm1.family_group_id = fm2.family_group_id
      where fm1.user_id = auth.uid()
    )
  );

-- 6. FAMILY INVITES — email invitations to join a family group
create table if not exists public.family_invites (
  id uuid default gen_random_uuid() primary key,
  family_group_id uuid references public.family_groups(id) on delete cascade not null,
  invited_by uuid references public.profiles(id) not null,
  invited_email text not null,
  status text default 'pending' check (status in ('pending', 'accepted', 'expired')),
  created_at timestamp with time zone default now()
);

alter table public.family_invites enable row level security;

create policy "Inviters can view their invites" on public.family_invites
  for select using (invited_by = auth.uid());

create policy "Users can create invites" on public.family_invites
  for insert with check (auth.uid() = invited_by);

create policy "Invited users can view invites for their email" on public.family_invites
  for select using (
    invited_email = (select email from auth.users where id = auth.uid())
  );

create policy "Invited users can update invite status" on public.family_invites
  for update using (
    invited_email = (select email from auth.users where id = auth.uid())
  );

-- 7. FUNCTION: Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, display_name, avatar_initial)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)),
    upper(left(coalesce(new.raw_user_meta_data->>'display_name', new.email), 1))
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to auto-create profile
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
  -- Find the family group
  select * into group_record from public.family_groups where invite_code = code;
  
  if not found then
    return json_build_object('error', 'Invalid invite code');
  end if;
  
  -- Add the user as a member
  insert into public.family_members (family_group_id, user_id, role)
  values (group_record.id, auth.uid(), 'member')
  on conflict (family_group_id, user_id) do nothing;
  
  return json_build_object('success', true, 'family_name', group_record.name);
end;
$$ language plpgsql security definer;
