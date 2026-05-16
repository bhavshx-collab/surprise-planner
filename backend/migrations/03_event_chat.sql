-- ============================================================
--  EVENT CHAT - Realtime group chat for adventures
-- ============================================================

CREATE TABLE IF NOT EXISTS public.event_messages (
    id              UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    event_id        UUID NOT NULL REFERENCES public.mystery_events(id) ON DELETE CASCADE,
    user_id         UUID NOT NULL, -- references auth.users(id), but we leave it unconstrained for ease if using anon users
    user_name       TEXT NOT NULL,
    message         TEXT NOT NULL,
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

CREATE INDEX IF NOT EXISTS idx_event_messages_event_id ON public.event_messages(event_id);
CREATE INDEX IF NOT EXISTS idx_event_messages_created_at ON public.event_messages(created_at);

-- Enable RLS
ALTER TABLE public.event_messages ENABLE ROW LEVEL SECURITY;

-- Allow public read access (or we could restrict to event members)
-- Since this is an MVP and users might want to see chat before joining (or we can restrict it)
-- Let's restrict read to everyone for now, to keep it simple with existing anonymous workflows.
CREATE POLICY "Allow public read event_messages" ON public.event_messages FOR SELECT USING (true);

-- Allow public insert (we will rely on frontend to only show chat if joined, 
-- or we can let anyone message. Since users might be anonymous, we just allow insert)
CREATE POLICY "Allow public insert event_messages" ON public.event_messages FOR INSERT WITH CHECK (true);

-- Enable Realtime for this table
-- This is critical for the frontend to subscribe to new messages
BEGIN;
  DROP PUBLICATION IF EXISTS supabase_realtime;
  CREATE PUBLICATION supabase_realtime FOR TABLE public.event_messages;
COMMIT;
-- Note: If you already have a supabase_realtime publication, you should alter it instead:
-- ALTER PUBLICATION supabase_realtime ADD TABLE public.event_messages;
