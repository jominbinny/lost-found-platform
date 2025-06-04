export interface Database {
  public: {
    Tables: {
      items: {
        Row: {
          id: string
          type: "lost" | "found"
          name: string | null
          email: string
          item_name: string
          category: string
          description: string
          location: string
          date: string
          image_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          type: "lost" | "found"
          name?: string | null
          email: string
          item_name: string
          category: string
          description: string
          location: string
          date: string
          image_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          type?: "lost" | "found"
          name?: string | null
          email?: string
          item_name?: string
          category?: string
          description?: string
          location?: string
          date?: string
          image_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      contact_requests: {
        Row: {
          id: string
          item_id: string
          from_name: string
          from_email: string
          to_email: string
          message: string
          created_at: string
          is_read: boolean
        }
        Insert: {
          id?: string
          item_id: string
          from_name: string
          from_email: string
          to_email: string
          message: string
          created_at?: string
          is_read?: boolean
        }
        Update: {
          id?: string
          item_id?: string
          from_name?: string
          from_email?: string
          to_email?: string
          message?: string
          created_at?: string
          is_read?: boolean
        }
      }
    }
  }
}

export type Item = Database["public"]["Tables"]["items"]["Row"]
export type ItemInsert = Database["public"]["Tables"]["items"]["Insert"]
export type ContactRequest = Database["public"]["Tables"]["contact_requests"]["Row"]
export type ContactRequestInsert = Database["public"]["Tables"]["contact_requests"]["Insert"]
