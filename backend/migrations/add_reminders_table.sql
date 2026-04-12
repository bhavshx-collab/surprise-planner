-- Run this in your Supabase SQL Editor to add the reminders table

create table if not exists reminders (
  id uuid default gen_random_uuid() primary key,
  plan_id uuid references plans(id),
  user_id uuid,
  user_email text not null,
  whatsapp_number text,
  event_date date not null,
  occasion text,
  plan_idea text,
  status text default 'scheduled',  -- scheduled | sent | cancelled
  created_at timestamp with time zone default now()
);

-- Index for fast lookup of due reminders
create index if not exists reminders_event_date_idx on reminders(event_date, status);
