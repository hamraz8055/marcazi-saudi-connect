ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS verification_status text DEFAULT 'unverified',
ADD COLUMN IF NOT EXISTS verification_docs jsonb DEFAULT '[]'::jsonb;