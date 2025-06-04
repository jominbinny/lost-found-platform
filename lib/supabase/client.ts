"use client"

import { createClient as createSupabaseClient } from "@supabase/supabase-js"

// Create a single supabase client for the entire client-side application
let client: ReturnType<typeof createSupabaseClient> | null = null

export function createClient() {
  if (client) return client

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing Supabase environment variables")
  }

  client = createSupabaseClient(supabaseUrl, supabaseAnonKey)
  return client
}
