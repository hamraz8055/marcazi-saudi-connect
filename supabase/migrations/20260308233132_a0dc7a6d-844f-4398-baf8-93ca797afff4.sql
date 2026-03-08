
DROP VIEW IF EXISTS public.public_listings;

CREATE VIEW public.public_listings AS
SELECT
  id, user_id, category, subcategory, title, description, listing_type, city,
  phone_country_code, phone_number, phone,
  CASE WHEN show_phone = true THEN (COALESCE(phone_country_code,'') || COALESCE(phone_number,'')) ELSE null END as phone_full,
  CASE WHEN show_email = true THEN contact_email ELSE null END as contact_email,
  price, contact_for_price, images, views, status, created_at, updated_at,
  show_phone, show_email,
  call_clicks, whatsapp_clicks, email_inquiries, chat_starts,
  employment_type, salary_min, salary_max, hourly_rate, salary_negotiable,
  contract_duration, required_skills, required_documents, company_logo_url,
  application_deadline, rental_rate, rental_rate_tbd, rental_duration_type,
  year, kilometers, fuel_type, seller_type, make, model, body_type, rental_period,
  price_period, payment_terms, price_negotiable, payment_plan,
  down_payment_pct, installment_period, handover_date,
  bedrooms, bathrooms, area_sqm, floor_number, furnished, fitout_status,
  features, land_type, capacity,
  district, street, latitude, longitude,
  poster_type, agency_name, rega_license, developer_name, project_name,
  reference_number, tour_360_url, price_per_sqm
FROM public.listings;
