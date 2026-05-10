-- ============================================================
--  ADVENTURES — Full Schema (Run this in Supabase SQL Editor)
-- ============================================================

-- Enable UUID extension (usually already on)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─────────────────────────────────────
--  Table: mystery_events (Adventures)
-- ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.mystery_events (
    id                  UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title               TEXT NOT NULL,
    description         TEXT,
    city                TEXT NOT NULL DEFAULT 'Bangalore',
    area                TEXT,
    activity_type       TEXT NOT NULL DEFAULT 'custom',
    date_time           TIMESTAMP WITH TIME ZONE NOT NULL,
    max_members         INTEGER DEFAULT 4,
    deposit_amount      INTEGER DEFAULT 49,          -- in INR
    status              TEXT DEFAULT 'open'          -- draft | open | full | completed | cancelled
                        CHECK (status IN ('draft','open','full','completed','cancelled')),
    ai_plan             JSONB,
    -- Host info
    host_user_id        UUID,
    host_name           TEXT,
    host_email          TEXT,
    host_deposit_paid   BOOLEAN DEFAULT FALSE,
    host_payment_id     TEXT,                        -- Razorpay payment_id for refund
    host_refunded       BOOLEAN DEFAULT FALSE,
    -- Custom fields set by host/admin
    what_to_bring       TEXT,
    what_to_expect      TEXT,
    emoji               TEXT DEFAULT '🌿',
    energy              TEXT DEFAULT 'medium'
                        CHECK (energy IN ('low','medium','high')),
    tags                JSONB DEFAULT '[]',
    created_at          TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    updated_at          TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- ─────────────────────────────────────
--  Table: event_members
-- ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.event_members (
    id              UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    event_id        UUID REFERENCES public.mystery_events(id) ON DELETE CASCADE,
    user_id         UUID NOT NULL,
    email           TEXT,
    name            TEXT,
    deposit_paid    BOOLEAN DEFAULT FALSE,
    payment_id      TEXT,                            -- Razorpay payment_id for refund
    attended        BOOLEAN DEFAULT NULL,            -- null = unknown, true = attended, false = no-show
    refunded        BOOLEAN DEFAULT FALSE,
    joined_at       TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    UNIQUE(event_id, user_id)
);

-- ─────────────────────────────────────
--  Table: social_profiles
-- ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.social_profiles (
    id              UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id         UUID UNIQUE NOT NULL,
    email           TEXT,
    name            TEXT,
    city            TEXT DEFAULT 'Bangalore',
    energy_level    TEXT DEFAULT 'medium',
    intro_style     TEXT DEFAULT 'small_group',
    interests       JSONB DEFAULT '[]',
    vibe_tags       JSONB DEFAULT '[]',
    about           TEXT,
    phone           TEXT,
    events_hosted   INTEGER DEFAULT 0,
    events_attended INTEGER DEFAULT 0,
    rating          NUMERIC(3,2) DEFAULT 0,
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- ─────────────────────────────────────
--  Indexes
-- ─────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_mystery_events_city    ON public.mystery_events(city);
CREATE INDEX IF NOT EXISTS idx_mystery_events_status  ON public.mystery_events(status);
CREATE INDEX IF NOT EXISTS idx_event_members_event_id ON public.event_members(event_id);

-- ─────────────────────────────────────
--  RLS Policies
-- ─────────────────────────────────────
ALTER TABLE public.mystery_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_members  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_profiles ENABLE ROW LEVEL SECURITY;

-- Allow read access to everyone
CREATE POLICY "Allow public read mystery_events" ON public.mystery_events FOR SELECT USING (true);
CREATE POLICY "Allow public read event_members" ON public.event_members FOR SELECT USING (true);
CREATE POLICY "Allow public read social_profiles" ON public.social_profiles FOR SELECT USING (true);

-- Allow insert access to authenticated or anon users (since we use anon key)
CREATE POLICY "Allow public insert mystery_events" ON public.mystery_events FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert event_members" ON public.event_members FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert social_profiles" ON public.social_profiles FOR INSERT WITH CHECK (true);

-- Allow update access
CREATE POLICY "Allow public update mystery_events" ON public.mystery_events FOR UPDATE USING (true);
CREATE POLICY "Allow public update event_members" ON public.event_members FOR UPDATE USING (true);
CREATE POLICY "Allow public update social_profiles" ON public.social_profiles FOR UPDATE USING (true);
