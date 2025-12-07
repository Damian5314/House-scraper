-- WoningScout Database Schema
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/xewkipdebrhvwhaqxxyf/sql

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Profiles table (extends auth.users)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  full_name text,
  subscription_tier text default 'free' check (subscription_tier in ('free', 'pro', 'ultra')),
  mollie_customer_id text,
  searches_today integer default 0,
  last_search_date date,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Subscriptions table (Mollie subscriptions)
create table if not exists public.subscriptions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  mollie_subscription_id text unique,
  mollie_customer_id text not null,
  plan text not null check (plan in ('pro', 'ultra')),
  status text default 'pending' check (status in ('pending', 'active', 'canceled', 'suspended', 'completed')),
  amount decimal(10,2) not null,
  interval text default '1 month',
  current_period_start timestamp with time zone,
  current_period_end timestamp with time zone,
  canceled_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Payments table (track individual payments)
create table if not exists public.payments (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  subscription_id uuid references public.subscriptions on delete set null,
  mollie_payment_id text unique not null,
  amount decimal(10,2) not null,
  status text not null check (status in ('open', 'pending', 'paid', 'failed', 'canceled', 'expired')),
  description text,
  paid_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Favorites table (saved properties)
create table if not exists public.favorites (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  property_url text not null,
  property_data jsonb not null, -- Store the full property data (address, price, image, etc.)
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, property_url)
);

-- Search history (optional, for analytics)
create table if not exists public.search_history (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade,
  search_query jsonb not null, -- Store search params (location, price range, etc.)
  results_count integer,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.favorites enable row level security;
alter table public.search_history enable row level security;
alter table public.subscriptions enable row level security;
alter table public.payments enable row level security;

-- Profiles policies
create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);

create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

-- Favorites policies
create policy "Users can view own favorites" on public.favorites
  for select using (auth.uid() = user_id);

create policy "Users can insert own favorites" on public.favorites
  for insert with check (auth.uid() = user_id);

create policy "Users can delete own favorites" on public.favorites
  for delete using (auth.uid() = user_id);

-- Search history policies
create policy "Users can view own search history" on public.search_history
  for select using (auth.uid() = user_id);

create policy "Users can insert own search history" on public.search_history
  for insert with check (auth.uid() = user_id);

-- Subscriptions policies
create policy "Users can view own subscriptions" on public.subscriptions
  for select using (auth.uid() = user_id);

create policy "Service role can manage subscriptions" on public.subscriptions
  for all using (true);

-- Payments policies
create policy "Users can view own payments" on public.payments
  for select using (auth.uid() = user_id);

create policy "Service role can manage payments" on public.payments
  for all using (true);

-- Function to create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to auto-create profile on signup
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Indexes for better performance
create index if not exists favorites_user_id_idx on public.favorites(user_id);
create index if not exists search_history_user_id_idx on public.search_history(user_id);
create index if not exists search_history_created_at_idx on public.search_history(created_at desc);
create index if not exists subscriptions_user_id_idx on public.subscriptions(user_id);
create index if not exists subscriptions_mollie_id_idx on public.subscriptions(mollie_subscription_id);
create index if not exists payments_user_id_idx on public.payments(user_id);
create index if not exists payments_mollie_id_idx on public.payments(mollie_payment_id);
