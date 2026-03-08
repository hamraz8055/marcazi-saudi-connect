
ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS required_documents text[] DEFAULT '{}'::text[];
ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS rental_rate_tbd boolean DEFAULT false;
ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS rental_duration_type text;

ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS confirmed_documents text[] DEFAULT '{}'::text[];

-- Recreate the public_listings view to include new columns
DROP VIEW IF EXISTS public.public_listings;
CREATE VIEW public.public_listings AS
SELECT
  id, user_id, category, subcategory, title, description, listing_type, city, price, contact_for_price,
  phone_country_code,
  CASE WHEN show_phone = true THEN phone_number ELSE null END as phone_number,
  CASE WHEN show_phone = true THEN phone ELSE null END as phone,
  CASE WHEN show_phone = true THEN (phone_country_code || phone_number) ELSE null END as phone_full,
  show_phone, show_email,
  CASE WHEN show_email = true THEN contact_email ELSE null END as contact_email,
  images, views, status, created_at, updated_at,
  year, kilometers, fuel_type, seller_type, make, model, body_type,
  rental_rate, rental_period, rental_rate_tbd, rental_duration_type,
  employment_type, salary_min, salary_max, hourly_rate, salary_negotiable, contract_duration,
  required_skills, required_documents, company_logo_url, application_deadline,
  call_clicks, whatsapp_clicks, email_inquiries, chat_starts
FROM public.listings;
