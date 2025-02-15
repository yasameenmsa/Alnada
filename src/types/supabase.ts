export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      news: {
        Row: {
          id: string;
          title_ar: string;
          title_en: string;
          content_ar: string;
          content_en: string;
          main_image_url: string | null;
          additional_images: Json | null;
          category: string;
          published: boolean;
          user_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['news']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['news']['Insert']>;
      };
      events: {
        Row: {
          id: string;
          title_ar: string;
          title_en: string;
          description_ar: string;
          description_en: string;
          main_image_url: string | null;
          additional_images: Json | null;
          event_date: string;
          location_ar: string;
          location_en: string;
          published: boolean;
          user_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['events']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['events']['Insert']>;
      };
      reports: {
        Row: {
          id: string;
          title_ar: string;
          title_en: string;
          description_ar: string;
          description_en: string;
          file_url: string;
          file_size: string;
          report_type: string;
          main_image_url: string | null;
          additional_images: Json | null;
          published: boolean;
          user_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['reports']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['reports']['Insert']>;
      };
      projects: {
        Row: {
          id: string;
          title_ar: string;
          title_en: string;
          description_ar: string;
          description_en: string;
          objectives_ar: string[];
          objectives_en: string[];
          achievements_ar: string[];
          achievements_en: string[];
          beneficiaries_ar: string[];
          beneficiaries_en: string[];
          duration_ar: string;
          duration_en: string;
          locations: {
            name_ar: string;
            name_en: string;
            coordinates: {
              lat: string;
              lng: string;
            };
          }[];
          start_date: string;
          end_date: string;
          budget: {
            amount: number;
            currency: string;
          };
          funding_source_ar: string[];
          funding_source_en: string[];
          status: 'Ongoing' | 'Completed' | 'Planned';
          project_phases: {
            name_ar: string;
            name_en: string;
            start_date: string;
            end_date: string;
            status: string;
          }[];
          main_image: {
            url: string;
            uploaded_at: string;
          };
          images: {
            url: string;
            uploaded_at: string;
            caption_ar?: string;
            caption_en?: string;
          }[];
          main_video: {
            url: string;
            uploaded_at: string;
          };
          videos: {
            url: string;
            uploaded_at: string;
            caption_ar?: string;
            caption_en?: string;
          }[];
          main_file: {
            url: string;
            uploaded_at: string;
          };
          files: {
            url: string;
            uploaded_at: string;
            description_ar?: string;
            description_en?: string;
          }[];
          beneficiaries_breakdown: {
            total: number;
            women: number;
            men: number;
            children: number;
            elderly: number;
            disabled: number;
          };
          published: boolean;
          user_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['projects']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['projects']['Insert']>;
      };
      success_stories: {
        Row: {
          id: string;
          title_ar: string;
          title_en: string;
          content_ar: string;
          content_en: string;
          author_name_ar: string;
          author_name_en: string;
          success_details_ar: Json;
          success_details_en: Json;
          key_takeaways_ar: Json;
          key_takeaways_en: Json;
          impact_ar: string;
          impact_en: string;
          start_date: string;
          end_date: string;
          categories: string[];
          location: string;
          main_image: {
            url: string;
            caption: string;
          };
          images: {
            url: string;
            caption: string;
          }[];
          main_video: string | null;
          videos: {
            url: string;
            caption: string;
          }[];
          main_file: string | null;
          files: {
            url: string;
            caption: string;
          }[];
          audience_engagement: Json;
          published: boolean;
          user_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['success_stories']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['success_stories']['Insert']>;
      };
    };
  };
}