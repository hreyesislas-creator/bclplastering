/**
 * Source-of-truth types for the BCL CRM domain.
 * These mirror the Supabase tables (see supabase/schema.sql).
 */

export type LeadStatus =
  | "new"
  | "contacted"
  | "estimate_sent"
  | "won"
  | "lost";

export type ServiceType =
  | "stucco"
  | "plastering"
  | "remodel"
  | "exterior-paint"
  | "patio-cover"
  | "addition"
  | "drywall"
  | "other";

export interface Lead {
  id: string;
  full_name: string;
  phone: string;
  email: string | null;
  city: string | null;
  service_type: ServiceType;
  message: string | null;
  project_photo_urls: string[];
  status: LeadStatus;
  created_at: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  city: string;
  service_type: ServiceType;
  description: string;
  short_description?: string | null;
  category?: string | null;
  cover_image_url: string;
  before_images: string[];
  after_images: string[];
  featured: boolean;
  sort_order?: number;
  youtube_url?: string | null;
  youtube_embed_url?: string | null;
  created_at: string;
  updated_at?: string;
}

export type SiteImageMediaType = "image" | "youtube";

export interface SiteImage {
  id: string;
  image_key: string;
  label: string;
  description: string | null;
  recommended_width: number | null;
  recommended_height: number | null;
  section: string | null;
  page: string | null;
  image_url: string | null;
  alt_text: string | null;
  media_type: SiteImageMediaType;
  youtube_url: string | null;
  youtube_embed_url: string | null;
  sort_order: number;
  is_required: boolean;
  created_at: string;
  updated_at: string;
}

export type SiteImageMap = Record<string, SiteImage>;

export interface Review {
  id: string;
  customer_name: string;
  source: "google" | "yelp" | "thumbtack" | "facebook" | "direct";
  rating: number; // 1 – 5
  review_text: string;
  created_at: string;
}

/**
 * Database type matching the shape supabase-js v2 expects.
 * Replace with the output of `supabase gen types typescript` once
 * the project is linked.
 */
export interface Database {
  public: {
    Tables: {
      leads: {
        Row: Lead;
        Insert: Omit<Lead, "id" | "created_at" | "status"> & {
          id?: string;
          status?: LeadStatus;
        };
        Update: Partial<Lead>;
        Relationships: [];
      };
      projects: {
        Row: Project;
        Insert: Omit<Project, "id" | "created_at"> & { id?: string };
        Update: Partial<Project>;
        Relationships: [];
      };
      reviews: {
        Row: Review;
        Insert: Omit<Review, "id" | "created_at"> & { id?: string };
        Update: Partial<Review>;
        Relationships: [];
      };
      site_images: {
        Row: SiteImage;
        Insert: Omit<SiteImage, "id" | "created_at" | "updated_at"> & {
          id?: string;
        };
        Update: Partial<SiteImage>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
}
