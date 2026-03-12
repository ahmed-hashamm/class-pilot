-- Add deadline and closed_at columns to polls and attendances
ALTER TABLE public.polls ADD COLUMN IF NOT EXISTS deadline TIMESTAMPTZ DEFAULT NULL;
ALTER TABLE public.polls ADD COLUMN IF NOT EXISTS closed_at TIMESTAMPTZ DEFAULT NULL;

ALTER TABLE public.attendances ADD COLUMN IF NOT EXISTS deadline TIMESTAMPTZ DEFAULT NULL;
ALTER TABLE public.attendances ADD COLUMN IF NOT EXISTS closed_at TIMESTAMPTZ DEFAULT NULL;
