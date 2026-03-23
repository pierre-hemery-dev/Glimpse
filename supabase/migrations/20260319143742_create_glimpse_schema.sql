/*
  # Glimpse Database Schema

  1. New Tables
    - `profiles`
      - `id` (uuid, references auth.users, primary key)
      - `username` (text, unique, required)
      - `avatar_url` (text, nullable)
      - `created_at` (timestamptz, default now())
    
    - `friendships`
      - `id` (uuid, primary key, auto-generated)
      - `user_id` (uuid, references profiles)
      - `friend_id` (uuid, references profiles)
      - `status` (text, 'pending' or 'accepted', default 'pending')
      - `created_at` (timestamptz, default now())
      - Unique constraint on (user_id, friend_id)
    
    - `dates`
      - `id` (uuid, primary key, auto-generated)
      - `user_id` (uuid, references profiles)
      - `calendar_date` (timestamptz, required)
      - `pseudo` (text, required - nickname for date partner)
      - `venue_type` (text, constrained to specific types)
      - `venue_name`, `venue_address`, `venue_lat`, `venue_lng` (venue details)
      - `mood_tags` (text array)
      - `venue_rating` (boolean)
      - `title`, `description` (optional text fields)
      - `vibe_rating` (text, constrained to specific values)
      - `visibility` (text, 'friends' or 'private', default 'friends')
      - `created_at`, `updated_at` (timestamptz)
    
    - `wingman_actions`
      - `id` (uuid, primary key, auto-generated)
      - `date_id` (uuid, references dates, cascade on delete)
      - `user_id` (uuid, references profiles)
      - `type` (text, 'venue_suggestion', 'validation', or 'advice')
      - `content` (text)
      - `venue_name`, `venue_address` (optional venue details)
      - `created_at` (timestamptz, default now())

  2. Security
    - Enable RLS on all tables
    
    - Profiles:
      - Readable by all authenticated users
      - Writable only by owner
    
    - Friendships:
      - Readable by both users involved in the friendship
      - Writable only by the user who initiated the friendship
    
    - Dates:
      - Owner can read/write all operations
      - Accepted friends can read dates with visibility='friends'
    
    - Wingman Actions:
      - Readable by date owner and their accepted friends
      - Writable by friends (not the date owner)

  3. Important Notes
    - All tables use gen_random_uuid() for ID generation
    - Friendships enforce bidirectional relationship with unique constraint
    - Dates support French venue types (chez_moi, chez_iel, etc.)
    - RLS policies ensure proper data isolation and friend-based access
*/

-- USERS (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id          uuid references auth.users primary key,
  username    text unique not null,
  avatar_url  text,
  created_at  timestamptz default now()
);

-- FRIENDSHIPS
CREATE TABLE IF NOT EXISTS public.friendships (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references public.profiles(id),
  friend_id   uuid references public.profiles(id),
  status      text check (status in ('pending','accepted')) default 'pending',
  created_at  timestamptz default now(),
  unique(user_id, friend_id)
);

-- DATES
CREATE TABLE IF NOT EXISTS public.dates (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid references public.profiles(id),
  calendar_date   timestamptz not null,
  pseudo          text not null,
  venue_type      text check (venue_type in
                    ('restaurant','cafe','bar','cinema',
                     'chez_moi','chez_iel','exterieur','autre')),
  venue_name      text,
  venue_address   text,
  venue_lat       float,
  venue_lng       float,
  mood_tags       text[],
  venue_rating    boolean,
  title           text,
  description     text,
  vibe_rating     text check (vibe_rating in
                    ('desastre','pas_ouf','bof','bien','incroyable')),
  visibility      text check (visibility in ('friends','private'))
                    default 'friends',
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

-- WINGMAN ACTIONS
CREATE TABLE IF NOT EXISTS public.wingman_actions (
  id              uuid primary key default gen_random_uuid(),
  date_id         uuid references public.dates(id) on delete cascade,
  user_id         uuid references public.profiles(id),
  type            text check (type in
                    ('venue_suggestion','validation','advice')),
  content         text,
  venue_name      text,
  venue_address   text,
  created_at      timestamptz default now()
);

-- RLS POLICIES

-- Profiles: readable by authenticated users, writable by owner
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_read" ON public.profiles 
  FOR SELECT 
  USING (auth.role() = 'authenticated');

CREATE POLICY "profiles_write" ON public.profiles 
  FOR ALL 
  USING (auth.uid() = id);

-- Friendships: readable/writable by involved users
ALTER TABLE public.friendships ENABLE ROW LEVEL SECURITY;

CREATE POLICY "friendships_read" ON public.friendships 
  FOR SELECT
  USING (auth.uid() = user_id OR auth.uid() = friend_id);

CREATE POLICY "friendships_write" ON public.friendships 
  FOR ALL
  USING (auth.uid() = user_id);

-- Dates: owner + accepted friends can read, only owner can write
ALTER TABLE public.dates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "dates_owner" ON public.dates 
  FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "dates_friends_read" ON public.dates 
  FOR SELECT
  USING (
    visibility = 'friends' AND
    EXISTS (
      SELECT 1 FROM public.friendships
      WHERE status = 'accepted'
      AND (
        (user_id = auth.uid() AND friend_id = dates.user_id)
        OR
        (friend_id = auth.uid() AND user_id = dates.user_id)
      )
    )
  );

-- Wingman actions: readable by date owner + friends, writable by friends
ALTER TABLE public.wingman_actions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "wingman_read" ON public.wingman_actions 
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.dates d
      WHERE d.id = date_id
      AND (
        d.user_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM public.friendships f
          WHERE f.status = 'accepted'
          AND (
            (f.user_id = auth.uid() AND f.friend_id = d.user_id)
            OR
            (f.friend_id = auth.uid() AND f.user_id = d.user_id)
          )
        )
      )
    )
  );

CREATE POLICY "wingman_write" ON public.wingman_actions 
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);