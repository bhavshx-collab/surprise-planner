-- ============================================================
--  FIX: Enable anon access on plans table (RLS policy fix)
--  Run this in Supabase SQL Editor → SQL Editor → New Query
-- ============================================================

-- Enable RLS on plans if not already enabled
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;

-- Allow anyone (anon/authenticated) to insert new plans
CREATE POLICY IF NOT EXISTS "Allow public insert plans"
  ON public.plans FOR INSERT WITH CHECK (true);

-- Allow anyone to read plans by ID (for share links)
CREATE POLICY IF NOT EXISTS "Allow public read plans"
  ON public.plans FOR SELECT USING (true);

-- Allow update (for checklist, etc.)
CREATE POLICY IF NOT EXISTS "Allow public update plans"
  ON public.plans FOR UPDATE USING (true);
