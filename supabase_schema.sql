-- ============================================================
-- FRAME — Database Schema Setup
-- Run this in your Supabase SQL Editor to initialize tables
-- ============================================================

-- 1. Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to profiles" 
  ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Allow users to update their own profile" 
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 2. Create cinema_logs table
CREATE TABLE public.cinema_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  movie_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  poster_path TEXT,
  backdrop_path TEXT,
  release_year INTEGER NOT NULL,
  director TEXT NOT NULL,
  genres TEXT[] NOT NULL DEFAULT '{}',
  production_countries TEXT[] NOT NULL DEFAULT '{}',
  watched_at DATE NOT NULL DEFAULT CURRENT_DATE,
  rating NUMERIC(2,1) NOT NULL CHECK (rating >= 0.0 AND rating <= 5.0),
  mood TEXT NOT NULL,
  favorite_scene TEXT,
  notes TEXT,
  rewatched BOOLEAN NOT NULL DEFAULT false,
  media_type TEXT NOT NULL DEFAULT 'movie',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for cinema_logs
ALTER TABLE public.cinema_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow users to view their own cinema logs" 
  ON public.cinema_logs FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Allow users to insert their own cinema logs" 
  ON public.cinema_logs FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow users to update their own cinema logs" 
  ON public.cinema_logs FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Allow users to delete their own cinema logs" 
  ON public.cinema_logs FOR DELETE USING (auth.uid() = user_id);

-- 3. Automatic Profile Creation Trigger
-- Automatically create a profile when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, username, full_name, avatar_url)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
