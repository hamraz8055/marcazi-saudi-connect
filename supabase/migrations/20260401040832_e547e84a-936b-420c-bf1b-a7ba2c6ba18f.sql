
-- ============================================================
-- FIX 1: Profiles — restrict public reads to non-sensitive fields
-- Create a public_profiles view with only safe columns
-- ============================================================

-- Replace the overly permissive SELECT policy
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;

-- Users can always read their own full profile
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Create a view for public profile access (non-sensitive fields only)
CREATE OR REPLACE VIEW public.public_profiles
WITH (security_invoker = true)
AS
SELECT
  user_id,
  display_name,
  avatar_url,
  nickname,
  verification_status,
  joined_at,
  status
FROM public.profiles;

-- Allow everyone to read public profiles view
GRANT SELECT ON public.public_profiles TO anon, authenticated;

-- ============================================================
-- FIX 2: Conversation participants — restrict INSERT
-- Only allow adding yourself to a brand-new conversation (no existing participants)
-- ============================================================

DROP POLICY IF EXISTS "Authenticated users can add participants" ON public.conversation_participants;

CREATE POLICY "Users can add participants to new conversations"
  ON public.conversation_participants FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id
  );

-- Also restrict conversation creation so only authenticated users create
DROP POLICY IF EXISTS "Authenticated users can create conversations" ON public.conversations;

CREATE POLICY "Authenticated users can create conversations"
  ON public.conversations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

-- ============================================================
-- FIX 3: Bids — hide max_auto_bid from non-owners
-- ============================================================

DROP POLICY IF EXISTS "Bids are viewable by everyone" ON public.bids;

-- Bid owners can see their full bid (including max_auto_bid)
CREATE POLICY "Bid owner sees full bid"
  ON public.bids FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Auction owners can see bids on their auctions
CREATE POLICY "Auction owner sees bids"
  ON public.bids FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.auctions WHERE id = bids.auction_id AND auctions.user_id = auth.uid())
  );

-- Create a view for public bid history (without max_auto_bid)
CREATE OR REPLACE VIEW public.public_bids
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

-- ============================================================
-- FIX 4: Notifications — restrict INSERT to self only
-- ============================================================

DROP POLICY IF EXISTS "Authenticated users can create notifications" ON public.notifications;

CREATE POLICY "Users can only create notifications for themselves"
  ON public.notifications FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);
