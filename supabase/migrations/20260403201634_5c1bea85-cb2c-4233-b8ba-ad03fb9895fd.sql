
-- 1. Fix conversation_participants: remove permissive INSERT and add secure RPC
DROP POLICY IF EXISTS "Users can add participants to new conversations" ON public.conversation_participants;

-- Create a secure function to start a conversation (atomically creates conversation + both participants)
CREATE OR REPLACE FUNCTION public.start_conversation(
  p_other_user_id uuid,
  p_listing_id text DEFAULT NULL,
  p_listing_title text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_conv_id uuid;
  v_current_user uuid := auth.uid();
BEGIN
  IF v_current_user IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;
  
  IF v_current_user = p_other_user_id THEN
    RAISE EXCEPTION 'Cannot start conversation with yourself';
  END IF;

  -- Check if conversation already exists between these two users for this listing
  SELECT cp1.conversation_id INTO v_conv_id
  FROM conversation_participants cp1
  JOIN conversation_participants cp2 ON cp1.conversation_id = cp2.conversation_id
  LEFT JOIN conversations c ON c.id = cp1.conversation_id
  WHERE cp1.user_id = v_current_user
    AND cp2.user_id = p_other_user_id
    AND (p_listing_id IS NULL OR c.listing_id = p_listing_id)
  LIMIT 1;

  IF v_conv_id IS NOT NULL THEN
    RETURN v_conv_id;
  END IF;

  -- Create new conversation
  INSERT INTO conversations (listing_id, listing_title)
  VALUES (p_listing_id, p_listing_title)
  RETURNING id INTO v_conv_id;

  -- Add both participants
  INSERT INTO conversation_participants (conversation_id, user_id)
  VALUES (v_conv_id, v_current_user), (v_conv_id, p_other_user_id);

  RETURN v_conv_id;
END;
$$;

-- Also tighten conversations INSERT: only allow via the RPC (remove direct insert)
DROP POLICY IF EXISTS "Authenticated users can create conversations" ON public.conversations;


-- 2. Fix listing-images storage: add path ownership check to INSERT
DROP POLICY IF EXISTS "Authenticated users can upload listing images" ON storage.objects;

CREATE POLICY "Users can upload to own listing images folder"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'listing-images'
    AND (storage.foldername(name))[1] = (auth.uid())::text
  );


-- 3. Fix public_listings view: conditionally expose contact info
DROP VIEW IF EXISTS public.public_listings;

CREATE OR REPLACE VIEW public.public_listings AS
SELECT
  id, user_id, category, subcategory, title, description, listing_type, city, images, status,
  price, contact_for_price, price_negotiable, price_period, payment_terms, payment_plan,
  down_payment_pct, installment_period, rental_rate, rental_rate_tbd, rental_duration_type, rental_period,
  views, call_clicks, whatsapp_clicks, email_inquiries, chat_starts,
  created_at, updated_at,
  -- Property fields
  bedrooms, bathrooms, area_sqm, latitude, longitude, price_per_sqm, capacity,
  handover_date, features, floor_number, furnished, fitout_status, land_type,
  district, street, poster_type, agency_name, rega_license, developer_name,
  project_name, reference_number, tour_360_url,
  -- Motors fields
  make, model, body_type, fuel_type, year, kilometers, seller_type,
  -- Jobs fields
  salary_min, salary_max, salary_negotiable, hourly_rate, employment_type,
  contract_duration, application_deadline, required_skills, required_documents, company_logo_url,
  -- Contact: conditionally exposed based on owner preferences
  show_phone, show_email,
  CASE WHEN show_phone = true THEN phone_country_code ELSE NULL END AS phone_country_code,
  CASE WHEN show_phone = true THEN phone_number ELSE NULL END AS phone_number,
  CASE WHEN show_phone = true THEN phone ELSE NULL END AS phone,
  CASE WHEN show_phone = true THEN CONCAT(phone_country_code, phone_number) ELSE NULL END AS phone_full,
  CASE WHEN show_email = true THEN contact_email ELSE NULL END AS contact_email
FROM public.listings
WHERE status = 'active';
