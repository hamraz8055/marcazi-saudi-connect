
-- Add missing columns to auctions table
ALTER TABLE public.auctions ADD COLUMN IF NOT EXISTS reference_no text UNIQUE;
ALTER TABLE public.auctions ADD COLUMN IF NOT EXISTS subcategory text;
ALTER TABLE public.auctions ADD COLUMN IF NOT EXISTS bid_increment numeric DEFAULT 500;
ALTER TABLE public.auctions ADD COLUMN IF NOT EXISTS start_time timestamptz DEFAULT now();
ALTER TABLE public.auctions ADD COLUMN IF NOT EXISTS extended boolean DEFAULT false;
ALTER TABLE public.auctions ADD COLUMN IF NOT EXISTS winner_id uuid;
ALTER TABLE public.auctions ADD COLUMN IF NOT EXISTS winning_bid numeric;
ALTER TABLE public.auctions ADD COLUMN IF NOT EXISTS deposit_required boolean DEFAULT true;
ALTER TABLE public.auctions ADD COLUMN IF NOT EXISTS deposit_pct numeric DEFAULT 5;
ALTER TABLE public.auctions ADD COLUMN IF NOT EXISTS auto_extend_minutes integer DEFAULT 5;
ALTER TABLE public.auctions ADD COLUMN IF NOT EXISTS total_views integer DEFAULT 0;
ALTER TABLE public.auctions ADD COLUMN IF NOT EXISTS watchers integer DEFAULT 0;

-- Add missing columns to bids table
ALTER TABLE public.bids ADD COLUMN IF NOT EXISTS is_winning boolean DEFAULT false;
ALTER TABLE public.bids ADD COLUMN IF NOT EXISTS is_auto_bid boolean DEFAULT false;
ALTER TABLE public.bids ADD COLUMN IF NOT EXISTS max_auto_bid numeric;
ALTER TABLE public.bids ADD COLUMN IF NOT EXISTS status text DEFAULT 'active';

-- Create auction_watchers table
CREATE TABLE IF NOT EXISTS public.auction_watchers (
  auction_id uuid REFERENCES public.auctions(id) ON DELETE CASCADE NOT NULL,
  user_id uuid NOT NULL,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (auction_id, user_id)
);

-- Create auction_deposits table
CREATE TABLE IF NOT EXISTS public.auction_deposits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  auction_id uuid REFERENCES public.auctions(id) ON DELETE CASCADE NOT NULL,
  user_id uuid NOT NULL,
  amount numeric,
  status text DEFAULT 'pending',
  paid_at timestamptz,
  refunded_at timestamptz
);

-- Add missing columns to quotations table
ALTER TABLE public.quotations ADD COLUMN IF NOT EXISTS reference_no text UNIQUE;
ALTER TABLE public.quotations ADD COLUMN IF NOT EXISTS subcategory text;
ALTER TABLE public.quotations ADD COLUMN IF NOT EXISTS images text[];
ALTER TABLE public.quotations ADD COLUMN IF NOT EXISTS budget_tbd boolean DEFAULT false;
ALTER TABLE public.quotations ADD COLUMN IF NOT EXISTS required_documents text[];
ALTER TABLE public.quotations ADD COLUMN IF NOT EXISTS awarded_to uuid;
ALTER TABLE public.quotations ADD COLUMN IF NOT EXISTS awarded_quote_id uuid;
ALTER TABLE public.quotations ADD COLUMN IF NOT EXISTS total_views integer DEFAULT 0;

-- Create quotes table (supplier responses with more fields)
CREATE TABLE IF NOT EXISTS public.quotes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quotation_id uuid REFERENCES public.quotations(id) ON DELETE CASCADE NOT NULL,
  supplier_id uuid NOT NULL,
  price_offer numeric NOT NULL,
  delivery_time text,
  delivery_date date,
  notes text,
  attachments text[],
  status text DEFAULT 'submitted',
  buyer_rating integer,
  buyer_review text,
  submitted_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  type text NOT NULL,
  title text NOT NULL,
  message text,
  link text,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create sequence for auction reference numbers
CREATE SEQUENCE IF NOT EXISTS auction_ref_seq START 1;
CREATE SEQUENCE IF NOT EXISTS quotation_ref_seq START 1;

-- Function to generate auction reference
CREATE OR REPLACE FUNCTION public.generate_auction_ref()
RETURNS text LANGUAGE plpgsql AS $$
BEGIN
  RETURN 'AUC-' || LPAD(nextval('auction_ref_seq')::text, 6, '0');
END;
$$;

-- Function to generate quotation reference
CREATE OR REPLACE FUNCTION public.generate_quotation_ref()
RETURNS text LANGUAGE plpgsql AS $$
BEGIN
  RETURN 'RFQ-' || LPAD(nextval('quotation_ref_seq')::text, 6, '0');
END;
$$;

-- Trigger for auction reference
CREATE OR REPLACE FUNCTION public.set_auction_reference()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.reference_no IS NULL THEN
    NEW.reference_no := generate_auction_ref();
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_auction_ref ON public.auctions;
CREATE TRIGGER trg_auction_ref BEFORE INSERT ON public.auctions
FOR EACH ROW EXECUTE FUNCTION public.set_auction_reference();

-- Trigger for quotation reference
CREATE OR REPLACE FUNCTION public.set_quotation_reference()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.reference_no IS NULL THEN
    NEW.reference_no := generate_quotation_ref();
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_quotation_ref ON public.quotations;
CREATE TRIGGER trg_quotation_ref BEFORE INSERT ON public.quotations
FOR EACH ROW EXECUTE FUNCTION public.set_quotation_reference();

-- Enable RLS on new tables
ALTER TABLE public.auction_watchers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.auction_deposits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- RLS for auction_watchers
CREATE POLICY "Anyone can view watchers" ON public.auction_watchers FOR SELECT USING (true);
CREATE POLICY "Users can watch auctions" ON public.auction_watchers FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can unwatch" ON public.auction_watchers FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- RLS for auction_deposits
CREATE POLICY "Users can view own deposits" ON public.auction_deposits FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can create deposits" ON public.auction_deposits FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Auction owners can view deposits" ON public.auction_deposits FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM public.auctions WHERE auctions.id = auction_deposits.auction_id AND auctions.user_id = auth.uid())
);

-- RLS for quotes
CREATE POLICY "Suppliers can view own quotes" ON public.quotes FOR SELECT TO authenticated USING (auth.uid() = supplier_id);
CREATE POLICY "Quotation owners can view quotes" ON public.quotes FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM public.quotations WHERE quotations.id = quotes.quotation_id AND quotations.user_id = auth.uid())
);
CREATE POLICY "Suppliers can submit quotes" ON public.quotes FOR INSERT TO authenticated WITH CHECK (auth.uid() = supplier_id);
CREATE POLICY "Quotation owners can update quotes" ON public.quotes FOR UPDATE TO authenticated USING (
  EXISTS (SELECT 1 FROM public.quotations WHERE quotations.id = quotes.quotation_id AND quotations.user_id = auth.uid())
);

-- RLS for notifications
CREATE POLICY "Users can view own notifications" ON public.notifications FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "System can create notifications" ON public.notifications FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update own notifications" ON public.notifications FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- Enable realtime on auctions and bids
ALTER PUBLICATION supabase_realtime ADD TABLE public.bids;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
