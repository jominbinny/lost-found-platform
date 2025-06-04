"use client"

import { createClient } from "@/lib/supabase/client"
import { uploadImage } from "@/lib/supabase/storage"

interface LocalStorageItem {
  id: string
  type: "lost" | "found"
  name?: string
  email: string
  item_name: string
  category: string
  description: string
  location: string
  date: string
  image_url?: string
  created_at: string
}

interface LocalStorageContactRequest {
  id: string
  item_id: string
  from_name: string
  from_email: string
  to_email: string
  message: string
  created_at: string
  is_read: boolean
}

export async function migrateFromLocalStorage(): Promise<{ success: boolean; message: string }> {
  const supabase = createClient()

  try {
    // Get data from localStorage
    const itemsData = localStorage.getItem("campus_lost_found_items")
    const contactsData = localStorage.getItem("campus_lost_found_contacts")

    if (!itemsData && !contactsData) {
      return { success: false, message: "No data found in localStorage to migrate" }
    }

    let migratedItems = 0
    let migratedContacts = 0

    // Migrate items
    if (itemsData) {
      const items: LocalStorageItem[] = JSON.parse(itemsData)

      for (const item of items) {
        let imageUrl = item.image_url

        // If image is base64, convert to blob and upload to Supabase
        if (imageUrl && imageUrl.startsWith("data:")) {
          try {
            const response = await fetch(imageUrl)
            const blob = await response.blob()
            const file = new File([blob], `migrated-${item.id}.jpg`, { type: blob.type })
            imageUrl = await uploadImage(file, item.type)
          } catch (error) {
            console.warn(`Failed to migrate image for item ${item.id}:`, error)
            imageUrl = null
          }
        }

        const { error } = await supabase.from("items").insert({
          type: item.type,
          name: item.name || null,
          email: item.email,
          item_name: item.item_name,
          category: item.category,
          description: item.description,
          location: item.location,
          date: item.date,
          image_url: imageUrl,
          created_at: item.created_at,
        })

        if (!error) {
          migratedItems++
        } else {
          console.warn(`Failed to migrate item ${item.id}:`, error)
        }
      }
    }

    // Migrate contact requests
    if (contactsData) {
      const contacts: LocalStorageContactRequest[] = JSON.parse(contactsData)

      for (const contact of contacts) {
        const { error } = await supabase.from("contact_requests").insert({
          item_id: contact.item_id,
          from_name: contact.from_name,
          from_email: contact.from_email,
          to_email: contact.to_email,
          message: contact.message,
          created_at: contact.created_at,
          is_read: contact.is_read,
        })

        if (!error) {
          migratedContacts++
        } else {
          console.warn(`Failed to migrate contact ${contact.id}:`, error)
        }
      }
    }

    // Clear localStorage after successful migration
    if (migratedItems > 0 || migratedContacts > 0) {
      localStorage.removeItem("campus_lost_found_items")
      localStorage.removeItem("campus_lost_found_contacts")
    }

    return {
      success: true,
      message: `Successfully migrated ${migratedItems} items and ${migratedContacts} contact requests to Supabase`,
    }
  } catch (error) {
    console.error("Migration error:", error)
    return {
      success: false,
      message: `Migration failed: ${error instanceof Error ? error.message : "Unknown error"}`,
    }
  }
}
