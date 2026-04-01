
-- Remove the public SELECT policy that re-exposes max_auto_bid
DROP POLICY IF EXISTS "Public can view bid amounts" ON public.bids;

-- Recreate public_bids as security definer to bypass RLS but strip max_auto_bid
DROP VIEW IF EXISTS public.public_bids;
CREATE VIEW public.public_bids
WITH (security_invoker = false)
AS
SELECT
  id,
  auction_id,
  user_id,
  amount,
  created_at,
  is_winning,
  is_auto_bid,
  status
FROM public.bids;

GRANT SELECT ON public.public_bids TO anon, authenticated;

-- Fix public_listings view to use security_invoker
DROP VIEW IF EXISTS public.public_listings;
CREATE VIEW public.public_listings
WITH (security_invoker = true)
AS
SELECT
  id, user_id, category, subcategory, title, description, listing_type, city,
  price, contact_for_price, views, created_at, updated_at,
  show_phone, show_email, call_clicks, whatsapp_clicks, email_inquiries, chat_starts,
  images, status, features,
  -- Property fields
  bedrooms, bathrooms, area_sqm, floor_number, furnished, fitout_status,
  land_type, district, street, poster_type, agency_name, rega_license,
  developer_name, project_name, reference_number, tour_360_url,
  latitude, longitude, price_per_sqm, capacity,
  handover_date, payment_plan, down_payment_pct, installment_period,
  -- Motors fields
  make, model, year, kilometers, body_type, fuel_type, seller_type,
  price_negotiable, rental_rate, rental_rate_tbd, rental_duration_type,
  rental_period, price_period, payment_terms,
  -- Jobs fields
  employment_type, contract_duration, required_skills, required_documents,
  company_logo_url, salary_min, salary_max, salary_negotiable,
  hourly_rate, application_deadline,
  -- Contact (conditionally exposed)
  CASE WHEN show_phone = true THEN phone_country_code ELSE NULL END AS phone_country_code,
  CASE WHEN show_phone = true THEN phone_number ELSE NULL END AS phone_number,
  CASE WHEN show_phone = true THEN phone ELSE NULL END AS phone,
  CASE WHEN show_phone = true THEN COALESCE(phone_country_code, '+966') || phone_number ELSE NULL END AS phone_full,
  CASE WHEN show_email = true THEN contact_email ELSE NULL END AS contact_email
FROM public.listings
WHERE status = 'active';

GRANT SELECT ON public.public_listings TO anon, authenticated;

-- Fix listing_inquiries overly permissive INSERT policy
DROP POLICY IF EXISTS "Anyone can send inquiries" ON public.listing_inquiries;
CREATE POLICY "Authenticated users can send inquiries"
  ON public.listing_inquiries FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);
