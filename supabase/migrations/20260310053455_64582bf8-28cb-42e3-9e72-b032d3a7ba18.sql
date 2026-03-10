
-- Fix function search paths
CREATE OR REPLACE FUNCTION public.generate_auction_ref()
RETURNS text LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  RETURN 'AUC-' || LPAD(nextval('auction_ref_seq')::text, 6, '0');
END;
$$;

CREATE OR REPLACE FUNCTION public.generate_quotation_ref()
RETURNS text LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  RETURN 'RFQ-' || LPAD(nextval('quotation_ref_seq')::text, 6, '0');
END;
$$;

CREATE OR REPLACE FUNCTION public.set_auction_reference()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF NEW.reference_no IS NULL THEN
    NEW.reference_no := generate_auction_ref();
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.set_quotation_reference()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF NEW.reference_no IS NULL THEN
    NEW.reference_no := generate_quotation_ref();
  END IF;
  RETURN NEW;
END;
$$;

-- Fix overly permissive notification INSERT policy
DROP POLICY IF EXISTS "System can create notifications" ON public.notifications;
CREATE POLICY "Authenticated users can create notifications" ON public.notifications FOR INSERT TO authenticated WITH CHECK (true);
