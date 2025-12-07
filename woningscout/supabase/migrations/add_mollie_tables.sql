-- Migration: Add Mollie subscription tables
-- Run this in Supabase SQL Editor to add payment functionality

-- Add mollie_customer_id to profiles if not exists
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS mollie_customer_id text;

-- Update subscription_tier check constraint to include 'ultra'
ALTER TABLE public.profiles
DROP CONSTRAINT IF EXISTS profiles_subscription_tier_check;

ALTER TABLE public.profiles
ADD CONSTRAINT profiles_subscription_tier_check
CHECK (subscription_tier IN ('free', 'pro', 'ultra'));

-- Subscriptions table (Mollie subscriptions)
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  mollie_subscription_id text UNIQUE,
  mollie_customer_id text NOT NULL,
  plan text NOT NULL CHECK (plan IN ('pro', 'ultra')),
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'canceled', 'suspended', 'completed')),
  amount decimal(10,2) NOT NULL,
  interval text DEFAULT '1 month',
  current_period_start timestamp with time zone,
  current_period_end timestamp with time zone,
  canceled_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Payments table (track individual payments)
CREATE TABLE IF NOT EXISTS public.payments (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  subscription_id uuid REFERENCES public.subscriptions ON DELETE SET NULL,
  mollie_payment_id text UNIQUE NOT NULL,
  amount decimal(10,2) NOT NULL,
  status text NOT NULL CHECK (status IN ('open', 'pending', 'paid', 'failed', 'canceled', 'expired')),
  description text,
  paid_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Subscriptions policies
DROP POLICY IF EXISTS "Users can view own subscriptions" ON public.subscriptions;
CREATE POLICY "Users can view own subscriptions" ON public.subscriptions
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Service role can manage subscriptions" ON public.subscriptions;
CREATE POLICY "Service role can manage subscriptions" ON public.subscriptions
  FOR ALL USING (true);

-- Payments policies
DROP POLICY IF EXISTS "Users can view own payments" ON public.payments;
CREATE POLICY "Users can view own payments" ON public.payments
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Service role can manage payments" ON public.payments;
CREATE POLICY "Service role can manage payments" ON public.payments
  FOR ALL USING (true);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS subscriptions_user_id_idx ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS subscriptions_mollie_id_idx ON public.subscriptions(mollie_subscription_id);
CREATE INDEX IF NOT EXISTS payments_user_id_idx ON public.payments(user_id);
CREATE INDEX IF NOT EXISTS payments_mollie_id_idx ON public.payments(mollie_payment_id);
