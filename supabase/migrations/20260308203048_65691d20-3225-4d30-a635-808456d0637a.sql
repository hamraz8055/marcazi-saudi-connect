
-- Add job-specific columns to listings table
ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS employment_type text;
ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS salary_min numeric;
ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS salary_max numeric;
ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS hourly_rate numeric;
ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS salary_negotiable boolean DEFAULT false;
ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS contract_duration text;
ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS required_skills text[] DEFAULT '{}';
ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS company_logo_url text;

-- Create applications table
CREATE TABLE public.applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id uuid NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  applicant_id uuid NOT NULL,
  applicant_name text,
  applicant_email text,
  applicant_phone text,
  applicant_city text,
  cover_letter text,
  resume_url text,
  matched_skills text[] DEFAULT '{}',
  status text DEFAULT 'new',
  applied_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- Applicants can read their own applications
CREATE POLICY "Applicants can view their own applications"
ON public.applications FOR SELECT
USING (auth.uid() = applicant_id);

-- Employers can view applications for their own listings
CREATE POLICY "Employers can view applications for their listings"
ON public.applications FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.listings
    WHERE listings.id = applications.listing_id
    AND listings.user_id = auth.uid()
  )
);

-- Authenticated users can submit applications
CREATE POLICY "Users can submit applications"
ON public.applications FOR INSERT
WITH CHECK (auth.uid() = applicant_id);

-- Employers can update application status
CREATE POLICY "Employers can update application status"
ON public.applications FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.listings
    WHERE listings.id = applications.listing_id
    AND listings.user_id = auth.uid()
  )
);

-- Applicants can withdraw (update) their own applications
CREATE POLICY "Applicants can update their own applications"
ON public.applications FOR UPDATE
USING (auth.uid() = applicant_id);

-- Enable realtime for applications
ALTER PUBLICATION supabase_realtime ADD TABLE public.applications;
