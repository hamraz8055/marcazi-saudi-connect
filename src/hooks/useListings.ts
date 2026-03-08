import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Listing {
  id: string;
  user_id: string;
  category: string;
  subcategory: string | null;
  title: string;
  description: string | null;
  listing_type: string;
  city: string;
  price: number | null;
  contact_for_price: boolean | null;
  phone: string | null;
  images: string[];
  views: number | null;
  status: string | null;
  created_at: string;
  updated_at: string;
  // Job fields
  employment_type?: string | null;
  salary_min?: number | null;
  salary_max?: number | null;
  hourly_rate?: number | null;
  salary_negotiable?: boolean | null;
  contract_duration?: string | null;
  required_skills?: string[] | null;
  company_logo_url?: string | null;
  application_deadline?: string | null;
  // Phone & contact fields
  phone_country_code?: string | null;
  phone_number?: string | null;
  show_phone?: boolean | null;
  show_email?: boolean | null;
  contact_email?: string | null;
  phone_full?: string | null;
  call_clicks?: number | null;
  whatsapp_clicks?: number | null;
  email_inquiries?: number | null;
  chat_starts?: number | null;
  // Vehicle fields
  year?: number | null;
  kilometers?: number | null;
  fuel_type?: string | null;
  seller_type?: string | null;
  make?: string | null;
  model?: string | null;
  body_type?: string | null;
  rental_rate?: number | null;
  rental_period?: string | null;
  // Job extra fields
  required_documents?: string[] | null;
  rental_rate_tbd?: boolean | null;
  rental_duration_type?: string | null;
  // Property fields
  price_period?: string | null;
  payment_terms?: string | null;
  price_negotiable?: boolean | null;
  payment_plan?: boolean | null;
  down_payment_pct?: number | null;
  installment_period?: string | null;
  handover_date?: string | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
  area_sqm?: number | null;
  floor_number?: string | null;
  furnished?: string | null;
  fitout_status?: string | null;
  features?: string[] | null;
  land_type?: string | null;
  capacity?: number | null;
  district?: string | null;
  street?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  poster_type?: string | null;
  agency_name?: string | null;
  rega_license?: string | null;
  developer_name?: string | null;
  project_name?: string | null;
  reference_number?: string | null;
  tour_360_url?: string | null;
  price_per_sqm?: number | null;
}

export function useListings(filters?: {
  category?: string | null;
  city?: string | null;
  search?: string;
  listingType?: string;
  sortBy?: string;
  priceMin?: number;
  priceMax?: number;
  limit?: number;
  offset?: number;
}) {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  const fetchListings = useCallback(async () => {
    setLoading(true);
    let query = supabase.from("listings").select("*", { count: "exact" }).eq("status", "active");
    
    if (filters?.category) query = query.eq("category", filters.category);
    if (filters?.city) query = query.eq("city", filters.city);
    if (filters?.listingType && filters.listingType !== "all") query = query.eq("listing_type", filters.listingType);
    if (filters?.search) query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
    if (filters?.priceMin) query = query.gte("price", filters.priceMin);
    if (filters?.priceMax) query = query.lte("price", filters.priceMax);
    
    if (filters?.sortBy === "price_asc") query = query.order("price", { ascending: true, nullsFirst: false });
    else if (filters?.sortBy === "price_desc") query = query.order("price", { ascending: false, nullsFirst: false });
    else if (filters?.sortBy === "views") query = query.order("views", { ascending: false });
    else query = query.order("created_at", { ascending: false });

    if (filters?.limit) query = query.limit(filters.limit);
    if (filters?.offset) query = query.range(filters.offset, filters.offset + (filters.limit || 12) - 1);

    const { data, count } = await query;
    setListings((data as Listing[]) || []);
    setTotal(count || 0);
    setLoading(false);
  }, [filters?.category, filters?.city, filters?.search, filters?.listingType, filters?.sortBy, filters?.priceMin, filters?.priceMax, filters?.limit, filters?.offset]);

  useEffect(() => { fetchListings(); }, [fetchListings]);

  return { listings, loading, total, refetch: fetchListings };
}

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function useListing(id: string | undefined) {
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [seller, setSeller] = useState<{ display_name: string | null; avatar_url: string | null; user_id: string } | null>(null);

  useEffect(() => {
    if (!id) { setLoading(false); return; }
    if (!UUID_REGEX.test(id)) { setLoading(false); return; }
    const fetch = async () => {
      const { data } = await supabase.from("listings").select("*").eq("id", id).single();
      if (data) {
        setListing(data as Listing);
        await supabase.from("listings").update({ views: (data.views || 0) + 1 }).eq("id", id);
        const { data: profile } = await supabase.from("profiles").select("display_name, avatar_url, user_id").eq("user_id", data.user_id).single();
        setSeller(profile);
      }
      setLoading(false);
    };
    fetch();
  }, [id]);

  return { listing, loading, seller };
}
