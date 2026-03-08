
-- Add new columns to listings table
ALTER TABLE public.listings
  ADD COLUMN IF NOT EXISTS phone_country_code text DEFAULT '+966',
  ADD COLUMN IF NOT EXISTS phone_number text,
  ADD COLUMN IF NOT EXISTS show_phone boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS show_email boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS call_clicks integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS whatsapp_clicks integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS email_inquiries integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS chat_starts integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS year integer,
  ADD COLUMN IF NOT EXISTS kilometers integer,
  ADD COLUMN IF NOT EXISTS fuel_type text,
  ADD COLUMN IF NOT EXISTS seller_type text,
  ADD COLUMN IF NOT EXISTS make text,
  ADD COLUMN IF NOT EXISTS model text,
  ADD COLUMN IF NOT EXISTS body_type text,
  ADD COLUMN IF NOT EXISTS rental_rate numeric,
  ADD COLUMN IF NOT EXISTS rental_period text,
  ADD COLUMN IF NOT EXISTS application_deadline date;

-- Create listing_inquiries table
CREATE TABLE IF NOT EXISTS public.listing_inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id uuid NOT NULL,
  sender_name text,
  sender_email text,
  message text,
  sent_at timestamptz DEFAULT now()
);

ALTER TABLE public.listing_inquiries ENABLE ROW LEVEL SECURITY;

-- Anyone can insert inquiries (even non-logged-in users)
CREATE POLICY "Anyone can send inquiries" ON public.listing_inquiries
  FOR INSERT WITH CHECK (true);

-- Listing owners can view inquiries for their listings
CREATE POLICY "Listing owners can view inquiries" ON public.listing_inquiries
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.listings
      WHERE listings.id = listing_inquiries.listing_id
        AND listings.user_id = auth.uid()
    )
  );
