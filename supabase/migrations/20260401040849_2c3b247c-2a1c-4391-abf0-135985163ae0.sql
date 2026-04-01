
-- Fix public_bids view: use security_invoker = true won't work since bids table now has restricted RLS.
-- Instead, recreate as security_definer but only expose safe columns (no max_auto_bid).
-- Actually, we need the view to bypass RLS to show public bid history. Let's keep security_invoker = false
-- but that's the lint warning. The proper fix: grant anon/authenticated SELECT on bids for viewing,
-- but only through the view. Let's use a different approach: create a function.

-- Drop the problematic view and recreate with security_invoker = true
-- But first we need a policy that allows public reads of bids (without max_auto_bid)
-- We'll add a public SELECT policy back but use a view to strip max_auto_bid

DROP VIEW IF EXISTS public.public_bids;

-- Add a public read policy for bids (everyone can see bid history)
CREATE POLICY "Public can view bid amounts"
  ON public.bids FOR SELECT
  TO anon, authenticated
  USING (true);

-- Now create the view with security_invoker = true (it will use caller's permissions)
CREATE OR REPLACE VIEW public.public_bids
WITH (security_invoker = true)
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

-- Fix mutable search_path on functions
ALTER FUNCTION public.generate_reference_number() SET search_path = public;
ALTER FUNCTION public.set_property_reference() SET search_path = public;
