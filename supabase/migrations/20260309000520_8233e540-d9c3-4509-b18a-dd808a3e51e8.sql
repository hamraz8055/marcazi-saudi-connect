-- Add property-specific columns to listings table
ALTER TABLE listings 
ADD COLUMN IF NOT EXISTS price_period TEXT,
ADD COLUMN IF NOT EXISTS payment_terms TEXT,
ADD COLUMN IF NOT EXISTS price_negotiable BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS contact_for_price BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS payment_plan BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS down_payment_pct NUMERIC,
ADD COLUMN IF NOT EXISTS installment_period TEXT,
ADD COLUMN IF NOT EXISTS handover_date DATE,
ADD COLUMN IF NOT EXISTS bedrooms INTEGER,
ADD COLUMN IF NOT EXISTS bathrooms INTEGER,
ADD COLUMN IF NOT EXISTS area_sqm NUMERIC,
ADD COLUMN IF NOT EXISTS floor_number TEXT,
ADD COLUMN IF NOT EXISTS furnished TEXT,
ADD COLUMN IF NOT EXISTS fitout_status TEXT,
ADD COLUMN IF NOT EXISTS features TEXT[],
ADD COLUMN IF NOT EXISTS land_type TEXT,
ADD COLUMN IF NOT EXISTS capacity INTEGER,
ADD COLUMN IF NOT EXISTS district TEXT,
ADD COLUMN IF NOT EXISTS street TEXT,
ADD COLUMN IF NOT EXISTS latitude NUMERIC,
ADD COLUMN IF NOT EXISTS longitude NUMERIC,
ADD COLUMN IF NOT EXISTS poster_type TEXT,
ADD COLUMN IF NOT EXISTS agency_name TEXT,
ADD COLUMN IF NOT EXISTS rega_license TEXT,
ADD COLUMN IF NOT EXISTS developer_name TEXT,
ADD COLUMN IF NOT EXISTS project_name TEXT,
ADD COLUMN IF NOT EXISTS reference_number TEXT,
ADD COLUMN IF NOT EXISTS tour_360_url TEXT,
ADD COLUMN IF NOT EXISTS price_per_sqm NUMERIC;

-- Create sequence for reference numbers
CREATE SEQUENCE IF NOT EXISTS listing_ref_seq START 1;

-- Create function to generate reference numbers
CREATE OR REPLACE FUNCTION generate_reference_number()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN 'MCZ-' || LPAD(nextval('listing_ref_seq')::text, 8, '0');
END;
$$;

-- Create trigger to auto-generate reference numbers for property listings
CREATE OR REPLACE FUNCTION set_property_reference()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.category = 'property' AND NEW.reference_number IS NULL THEN
    NEW.reference_number := generate_reference_number();
  END IF;
  RETURN NEW;
END;
$$;

-- Create trigger
DROP TRIGGER IF EXISTS property_reference_trigger ON listings;
CREATE TRIGGER property_reference_trigger
  BEFORE INSERT ON listings
  FOR EACH ROW
  EXECUTE FUNCTION set_property_reference();

-- Add comments to document the columns
COMMENT ON COLUMN listings.price_period IS 'Price period: yearly, monthly, weekly, daily, per_sqm';
COMMENT ON COLUMN listings.payment_terms IS 'Payment terms: 1_cheque, 2_cheques, 4_cheques, monthly, flexible';
COMMENT ON COLUMN listings.bedrooms IS '0 = Studio apartment';
COMMENT ON COLUMN listings.reference_number IS 'Auto-generated format: MCZ-XXXXXXXX';
COMMENT ON COLUMN listings.tour_360_url IS '360° virtual tour URL for properties';
COMMENT ON COLUMN listings.poster_type IS 'owner, agent, or developer';
COMMENT ON COLUMN listings.rega_license IS 'Saudi Real Estate General Authority license';
COMMENT ON COLUMN listings.land_type IS 'residential, commercial, agricultural, industrial, mixed, unspecified';
COMMENT ON COLUMN listings.furnished IS 'furnished, semi, unfurnished';
COMMENT ON COLUMN listings.fitout_status IS 'shell, fitted, partial';
COMMENT ON COLUMN listings.features IS 'Array of property features and amenities';