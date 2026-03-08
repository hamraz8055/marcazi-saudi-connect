-- Add contact_email column to listings
ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS contact_email text;

-- Create public_listings view that masks private contact info
CREATE OR REPLACE VIEW public.public_listings
WITH (security_invoker=on) AS
  SELECT
    id, user_id, category, subcategory, title, description, listing_type,
    city, price, contact_for_price, images, views, status, created_at, updated_at,
    employment_type, salary_min, salary_max, hourly_rate, salary_negotiable,
    contract_duration, required_skills, company_logo_url, application_deadline,
    phone_country_code,
    show_phone, show_email,
    CASE WHEN show_phone = true THEN phone ELSE null END as phone,
    CASE WHEN show_phone = true THEN phone_number ELSE null END as phone_number,
    CASE WHEN show_phone = true THEN (phone_country_code || phone_number) ELSE null END as phone_full,
    CASE WHEN show_email = true THEN contact_email ELSE null END as contact_email,
    call_clicks, whatsapp_clicks, email_inquiries, chat_starts,
    year, kilometers, fuel_type, seller_type, make, model, body_type,
    rental_rate, rental_period
  FROM public.listings;