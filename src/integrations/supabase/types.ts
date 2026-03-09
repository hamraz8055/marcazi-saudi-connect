export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      applications: {
        Row: {
          applicant_city: string | null
          applicant_email: string | null
          applicant_id: string
          applicant_name: string | null
          applicant_phone: string | null
          applied_at: string | null
          confirmed_documents: string[] | null
          cover_letter: string | null
          id: string
          listing_id: string
          matched_skills: string[] | null
          resume_url: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          applicant_city?: string | null
          applicant_email?: string | null
          applicant_id: string
          applicant_name?: string | null
          applicant_phone?: string | null
          applied_at?: string | null
          confirmed_documents?: string[] | null
          cover_letter?: string | null
          id?: string
          listing_id: string
          matched_skills?: string[] | null
          resume_url?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          applicant_city?: string | null
          applicant_email?: string | null
          applicant_id?: string
          applicant_name?: string | null
          applicant_phone?: string | null
          applied_at?: string | null
          confirmed_documents?: string[] | null
          cover_letter?: string | null
          id?: string
          listing_id?: string
          matched_skills?: string[] | null
          resume_url?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "applications_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "applications_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "public_listings"
            referencedColumns: ["id"]
          },
        ]
      }
      auctions: {
        Row: {
          category: string
          city: string
          condition: string | null
          created_at: string
          current_bid: number | null
          description: string | null
          duration_days: number
          ends_at: string
          id: string
          images: string[] | null
          reserve_price: number | null
          starting_price: number
          status: string | null
          title: string
          total_bids: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          category: string
          city: string
          condition?: string | null
          created_at?: string
          current_bid?: number | null
          description?: string | null
          duration_days?: number
          ends_at: string
          id?: string
          images?: string[] | null
          reserve_price?: number | null
          starting_price: number
          status?: string | null
          title: string
          total_bids?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string
          city?: string
          condition?: string | null
          created_at?: string
          current_bid?: number | null
          description?: string | null
          duration_days?: number
          ends_at?: string
          id?: string
          images?: string[] | null
          reserve_price?: number | null
          starting_price?: number
          status?: string | null
          title?: string
          total_bids?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      bids: {
        Row: {
          amount: number
          auction_id: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          amount: number
          auction_id: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          amount?: number
          auction_id?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bids_auction_id_fkey"
            columns: ["auction_id"]
            isOneToOne: false
            referencedRelation: "auctions"
            referencedColumns: ["id"]
          },
        ]
      }
      conversation_participants: {
        Row: {
          conversation_id: string
          created_at: string
          id: string
          last_read_at: string | null
          user_id: string
        }
        Insert: {
          conversation_id: string
          created_at?: string
          id?: string
          last_read_at?: string | null
          user_id: string
        }
        Update: {
          conversation_id?: string
          created_at?: string
          id?: string
          last_read_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversation_participants_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          created_at: string
          id: string
          listing_id: string | null
          listing_title: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          listing_id?: string | null
          listing_title?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          listing_id?: string | null
          listing_title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      favorites: {
        Row: {
          created_at: string
          id: string
          listing_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          listing_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          listing_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorites_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "favorites_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "public_listings"
            referencedColumns: ["id"]
          },
        ]
      }
      job_profiles: {
        Row: {
          certificates: Json | null
          created_at: string | null
          digital_profiles: Json | null
          experience: Json | null
          id: string
          languages: string[] | null
          portfolio: Json | null
          qualifications: Json | null
          references: Json | null
          resume_url: string | null
          skills: string[] | null
          updated_at: string | null
          user_id: string
          visa_status: string | null
        }
        Insert: {
          certificates?: Json | null
          created_at?: string | null
          digital_profiles?: Json | null
          experience?: Json | null
          id?: string
          languages?: string[] | null
          portfolio?: Json | null
          qualifications?: Json | null
          references?: Json | null
          resume_url?: string | null
          skills?: string[] | null
          updated_at?: string | null
          user_id: string
          visa_status?: string | null
        }
        Update: {
          certificates?: Json | null
          created_at?: string | null
          digital_profiles?: Json | null
          experience?: Json | null
          id?: string
          languages?: string[] | null
          portfolio?: Json | null
          qualifications?: Json | null
          references?: Json | null
          resume_url?: string | null
          skills?: string[] | null
          updated_at?: string | null
          user_id?: string
          visa_status?: string | null
        }
        Relationships: []
      }
      listing_inquiries: {
        Row: {
          id: string
          listing_id: string
          message: string | null
          sender_email: string | null
          sender_name: string | null
          sent_at: string | null
        }
        Insert: {
          id?: string
          listing_id: string
          message?: string | null
          sender_email?: string | null
          sender_name?: string | null
          sent_at?: string | null
        }
        Update: {
          id?: string
          listing_id?: string
          message?: string | null
          sender_email?: string | null
          sender_name?: string | null
          sent_at?: string | null
        }
        Relationships: []
      }
      listings: {
        Row: {
          agency_name: string | null
          application_deadline: string | null
          area_sqm: number | null
          bathrooms: number | null
          bedrooms: number | null
          body_type: string | null
          call_clicks: number | null
          capacity: number | null
          category: string
          chat_starts: number | null
          city: string
          company_logo_url: string | null
          contact_email: string | null
          contact_for_price: boolean | null
          contract_duration: string | null
          created_at: string
          description: string | null
          developer_name: string | null
          district: string | null
          down_payment_pct: number | null
          email_inquiries: number | null
          employment_type: string | null
          features: string[] | null
          fitout_status: string | null
          floor_number: string | null
          fuel_type: string | null
          furnished: string | null
          handover_date: string | null
          hourly_rate: number | null
          id: string
          images: string[] | null
          installment_period: string | null
          kilometers: number | null
          land_type: string | null
          latitude: number | null
          listing_type: string
          longitude: number | null
          make: string | null
          model: string | null
          payment_plan: boolean | null
          payment_terms: string | null
          phone: string | null
          phone_country_code: string | null
          phone_number: string | null
          poster_type: string | null
          price: number | null
          price_negotiable: boolean | null
          price_per_sqm: number | null
          price_period: string | null
          project_name: string | null
          reference_number: string | null
          rega_license: string | null
          rental_duration_type: string | null
          rental_period: string | null
          rental_rate: number | null
          rental_rate_tbd: boolean | null
          required_documents: string[] | null
          required_skills: string[] | null
          salary_max: number | null
          salary_min: number | null
          salary_negotiable: boolean | null
          seller_type: string | null
          show_email: boolean | null
          show_phone: boolean | null
          status: string | null
          street: string | null
          subcategory: string | null
          title: string
          tour_360_url: string | null
          updated_at: string
          user_id: string
          views: number | null
          whatsapp_clicks: number | null
          year: number | null
        }
        Insert: {
          agency_name?: string | null
          application_deadline?: string | null
          area_sqm?: number | null
          bathrooms?: number | null
          bedrooms?: number | null
          body_type?: string | null
          call_clicks?: number | null
          capacity?: number | null
          category: string
          chat_starts?: number | null
          city: string
          company_logo_url?: string | null
          contact_email?: string | null
          contact_for_price?: boolean | null
          contract_duration?: string | null
          created_at?: string
          description?: string | null
          developer_name?: string | null
          district?: string | null
          down_payment_pct?: number | null
          email_inquiries?: number | null
          employment_type?: string | null
          features?: string[] | null
          fitout_status?: string | null
          floor_number?: string | null
          fuel_type?: string | null
          furnished?: string | null
          handover_date?: string | null
          hourly_rate?: number | null
          id?: string
          images?: string[] | null
          installment_period?: string | null
          kilometers?: number | null
          land_type?: string | null
          latitude?: number | null
          listing_type?: string
          longitude?: number | null
          make?: string | null
          model?: string | null
          payment_plan?: boolean | null
          payment_terms?: string | null
          phone?: string | null
          phone_country_code?: string | null
          phone_number?: string | null
          poster_type?: string | null
          price?: number | null
          price_negotiable?: boolean | null
          price_per_sqm?: number | null
          price_period?: string | null
          project_name?: string | null
          reference_number?: string | null
          rega_license?: string | null
          rental_duration_type?: string | null
          rental_period?: string | null
          rental_rate?: number | null
          rental_rate_tbd?: boolean | null
          required_documents?: string[] | null
          required_skills?: string[] | null
          salary_max?: number | null
          salary_min?: number | null
          salary_negotiable?: boolean | null
          seller_type?: string | null
          show_email?: boolean | null
          show_phone?: boolean | null
          status?: string | null
          street?: string | null
          subcategory?: string | null
          title: string
          tour_360_url?: string | null
          updated_at?: string
          user_id: string
          views?: number | null
          whatsapp_clicks?: number | null
          year?: number | null
        }
        Update: {
          agency_name?: string | null
          application_deadline?: string | null
          area_sqm?: number | null
          bathrooms?: number | null
          bedrooms?: number | null
          body_type?: string | null
          call_clicks?: number | null
          capacity?: number | null
          category?: string
          chat_starts?: number | null
          city?: string
          company_logo_url?: string | null
          contact_email?: string | null
          contact_for_price?: boolean | null
          contract_duration?: string | null
          created_at?: string
          description?: string | null
          developer_name?: string | null
          district?: string | null
          down_payment_pct?: number | null
          email_inquiries?: number | null
          employment_type?: string | null
          features?: string[] | null
          fitout_status?: string | null
          floor_number?: string | null
          fuel_type?: string | null
          furnished?: string | null
          handover_date?: string | null
          hourly_rate?: number | null
          id?: string
          images?: string[] | null
          installment_period?: string | null
          kilometers?: number | null
          land_type?: string | null
          latitude?: number | null
          listing_type?: string
          longitude?: number | null
          make?: string | null
          model?: string | null
          payment_plan?: boolean | null
          payment_terms?: string | null
          phone?: string | null
          phone_country_code?: string | null
          phone_number?: string | null
          poster_type?: string | null
          price?: number | null
          price_negotiable?: boolean | null
          price_per_sqm?: number | null
          price_period?: string | null
          project_name?: string | null
          reference_number?: string | null
          rega_license?: string | null
          rental_duration_type?: string | null
          rental_period?: string | null
          rental_rate?: number | null
          rental_rate_tbd?: boolean | null
          required_documents?: string[] | null
          required_skills?: string[] | null
          salary_max?: number | null
          salary_min?: number | null
          salary_negotiable?: boolean | null
          seller_type?: string | null
          show_email?: boolean | null
          show_phone?: boolean | null
          status?: string | null
          street?: string | null
          subcategory?: string | null
          title?: string
          tour_360_url?: string | null
          updated_at?: string
          user_id?: string
          views?: number | null
          whatsapp_clicks?: number | null
          year?: number | null
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          sender_id: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          sender_id: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address: Json | null
          avatar_url: string | null
          created_at: string
          date_of_birth: string | null
          deactivation_reason: string | null
          display_name: string | null
          first_name: string | null
          gender: string | null
          id: string
          joined_at: string | null
          last_name: string | null
          nationality: string | null
          nickname: string | null
          phone: string | null
          phone_numbers: Json | null
          status: string | null
          updated_at: string
          user_id: string
          verification_docs: Json | null
          verification_status: string | null
        }
        Insert: {
          address?: Json | null
          avatar_url?: string | null
          created_at?: string
          date_of_birth?: string | null
          deactivation_reason?: string | null
          display_name?: string | null
          first_name?: string | null
          gender?: string | null
          id?: string
          joined_at?: string | null
          last_name?: string | null
          nationality?: string | null
          nickname?: string | null
          phone?: string | null
          phone_numbers?: Json | null
          status?: string | null
          updated_at?: string
          user_id: string
          verification_docs?: Json | null
          verification_status?: string | null
        }
        Update: {
          address?: Json | null
          avatar_url?: string | null
          created_at?: string
          date_of_birth?: string | null
          deactivation_reason?: string | null
          display_name?: string | null
          first_name?: string | null
          gender?: string | null
          id?: string
          joined_at?: string | null
          last_name?: string | null
          nationality?: string | null
          nickname?: string | null
          phone?: string | null
          phone_numbers?: Json | null
          status?: string | null
          updated_at?: string
          user_id?: string
          verification_docs?: Json | null
          verification_status?: string | null
        }
        Relationships: []
      }
      quotations: {
        Row: {
          budget_max: number | null
          budget_min: number | null
          category: string
          created_at: string
          deadline: string | null
          delivery_city: string | null
          delivery_required: boolean | null
          description: string | null
          id: string
          quantity: number | null
          quotes_count: number | null
          specifications: string | null
          status: string | null
          title: string
          unit: string | null
          updated_at: string
          urgency: string | null
          user_id: string
        }
        Insert: {
          budget_max?: number | null
          budget_min?: number | null
          category: string
          created_at?: string
          deadline?: string | null
          delivery_city?: string | null
          delivery_required?: boolean | null
          description?: string | null
          id?: string
          quantity?: number | null
          quotes_count?: number | null
          specifications?: string | null
          status?: string | null
          title: string
          unit?: string | null
          updated_at?: string
          urgency?: string | null
          user_id: string
        }
        Update: {
          budget_max?: number | null
          budget_min?: number | null
          category?: string
          created_at?: string
          deadline?: string | null
          delivery_city?: string | null
          delivery_required?: boolean | null
          description?: string | null
          id?: string
          quantity?: number | null
          quotes_count?: number | null
          specifications?: string | null
          status?: string | null
          title?: string
          unit?: string | null
          updated_at?: string
          urgency?: string | null
          user_id?: string
        }
        Relationships: []
      }
      quote_responses: {
        Row: {
          created_at: string
          delivery_time: string | null
          id: string
          notes: string | null
          price_offer: number
          quotation_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          delivery_time?: string | null
          id?: string
          notes?: string | null
          price_offer: number
          quotation_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          delivery_time?: string | null
          id?: string
          notes?: string | null
          price_offer?: number
          quotation_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "quote_responses_quotation_id_fkey"
            columns: ["quotation_id"]
            isOneToOne: false
            referencedRelation: "quotations"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      public_listings: {
        Row: {
          agency_name: string | null
          application_deadline: string | null
          area_sqm: number | null
          bathrooms: number | null
          bedrooms: number | null
          body_type: string | null
          call_clicks: number | null
          capacity: number | null
          category: string | null
          chat_starts: number | null
          city: string | null
          company_logo_url: string | null
          contact_email: string | null
          contact_for_price: boolean | null
          contract_duration: string | null
          created_at: string | null
          description: string | null
          developer_name: string | null
          district: string | null
          down_payment_pct: number | null
          email_inquiries: number | null
          employment_type: string | null
          features: string[] | null
          fitout_status: string | null
          floor_number: string | null
          fuel_type: string | null
          furnished: string | null
          handover_date: string | null
          hourly_rate: number | null
          id: string | null
          images: string[] | null
          installment_period: string | null
          kilometers: number | null
          land_type: string | null
          latitude: number | null
          listing_type: string | null
          longitude: number | null
          make: string | null
          model: string | null
          payment_plan: boolean | null
          payment_terms: string | null
          phone: string | null
          phone_country_code: string | null
          phone_full: string | null
          phone_number: string | null
          poster_type: string | null
          price: number | null
          price_negotiable: boolean | null
          price_per_sqm: number | null
          price_period: string | null
          project_name: string | null
          reference_number: string | null
          rega_license: string | null
          rental_duration_type: string | null
          rental_period: string | null
          rental_rate: number | null
          rental_rate_tbd: boolean | null
          required_documents: string[] | null
          required_skills: string[] | null
          salary_max: number | null
          salary_min: number | null
          salary_negotiable: boolean | null
          seller_type: string | null
          show_email: boolean | null
          show_phone: boolean | null
          status: string | null
          street: string | null
          subcategory: string | null
          title: string | null
          tour_360_url: string | null
          updated_at: string | null
          user_id: string | null
          views: number | null
          whatsapp_clicks: number | null
          year: number | null
        }
        Insert: {
          agency_name?: string | null
          application_deadline?: string | null
          area_sqm?: number | null
          bathrooms?: number | null
          bedrooms?: number | null
          body_type?: string | null
          call_clicks?: number | null
          capacity?: number | null
          category?: string | null
          chat_starts?: number | null
          city?: string | null
          company_logo_url?: string | null
          contact_email?: never
          contact_for_price?: boolean | null
          contract_duration?: string | null
          created_at?: string | null
          description?: string | null
          developer_name?: string | null
          district?: string | null
          down_payment_pct?: number | null
          email_inquiries?: number | null
          employment_type?: string | null
          features?: string[] | null
          fitout_status?: string | null
          floor_number?: string | null
          fuel_type?: string | null
          furnished?: string | null
          handover_date?: string | null
          hourly_rate?: number | null
          id?: string | null
          images?: string[] | null
          installment_period?: string | null
          kilometers?: number | null
          land_type?: string | null
          latitude?: number | null
          listing_type?: string | null
          longitude?: number | null
          make?: string | null
          model?: string | null
          payment_plan?: boolean | null
          payment_terms?: string | null
          phone?: string | null
          phone_country_code?: string | null
          phone_full?: never
          phone_number?: string | null
          poster_type?: string | null
          price?: number | null
          price_negotiable?: boolean | null
          price_per_sqm?: number | null
          price_period?: string | null
          project_name?: string | null
          reference_number?: string | null
          rega_license?: string | null
          rental_duration_type?: string | null
          rental_period?: string | null
          rental_rate?: number | null
          rental_rate_tbd?: boolean | null
          required_documents?: string[] | null
          required_skills?: string[] | null
          salary_max?: number | null
          salary_min?: number | null
          salary_negotiable?: boolean | null
          seller_type?: string | null
          show_email?: boolean | null
          show_phone?: boolean | null
          status?: string | null
          street?: string | null
          subcategory?: string | null
          title?: string | null
          tour_360_url?: string | null
          updated_at?: string | null
          user_id?: string | null
          views?: number | null
          whatsapp_clicks?: number | null
          year?: number | null
        }
        Update: {
          agency_name?: string | null
          application_deadline?: string | null
          area_sqm?: number | null
          bathrooms?: number | null
          bedrooms?: number | null
          body_type?: string | null
          call_clicks?: number | null
          capacity?: number | null
          category?: string | null
          chat_starts?: number | null
          city?: string | null
          company_logo_url?: string | null
          contact_email?: never
          contact_for_price?: boolean | null
          contract_duration?: string | null
          created_at?: string | null
          description?: string | null
          developer_name?: string | null
          district?: string | null
          down_payment_pct?: number | null
          email_inquiries?: number | null
          employment_type?: string | null
          features?: string[] | null
          fitout_status?: string | null
          floor_number?: string | null
          fuel_type?: string | null
          furnished?: string | null
          handover_date?: string | null
          hourly_rate?: number | null
          id?: string | null
          images?: string[] | null
          installment_period?: string | null
          kilometers?: number | null
          land_type?: string | null
          latitude?: number | null
          listing_type?: string | null
          longitude?: number | null
          make?: string | null
          model?: string | null
          payment_plan?: boolean | null
          payment_terms?: string | null
          phone?: string | null
          phone_country_code?: string | null
          phone_full?: never
          phone_number?: string | null
          poster_type?: string | null
          price?: number | null
          price_negotiable?: boolean | null
          price_per_sqm?: number | null
          price_period?: string | null
          project_name?: string | null
          reference_number?: string | null
          rega_license?: string | null
          rental_duration_type?: string | null
          rental_period?: string | null
          rental_rate?: number | null
          rental_rate_tbd?: boolean | null
          required_documents?: string[] | null
          required_skills?: string[] | null
          salary_max?: number | null
          salary_min?: number | null
          salary_negotiable?: boolean | null
          seller_type?: string | null
          show_email?: boolean | null
          show_phone?: boolean | null
          status?: string | null
          street?: string | null
          subcategory?: string | null
          title?: string | null
          tour_360_url?: string | null
          updated_at?: string | null
          user_id?: string | null
          views?: number | null
          whatsapp_clicks?: number | null
          year?: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      generate_reference_number: { Args: never; Returns: string }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
