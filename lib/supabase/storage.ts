import { createClient } from "./client"

export async function uploadImage(file: File, folder: "lost" | "found"): Promise<string | null> {
  const supabase = createClient()

  try {
    const fileExt = file.name.split(".").pop()
    const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`
    const filePath = `${folder}/${fileName}`

    const { error: uploadError } = await supabase.storage.from("item-images").upload(filePath, file)

    if (uploadError) {
      console.error("Error uploading image:", uploadError)
      return null
    }

    const { data: urlData } = supabase.storage.from("item-images").getPublicUrl(filePath)
    return urlData.publicUrl
  } catch (error) {
    console.error("Error in uploadImage:", error)
    return null
  }
}

export async function deleteImage(imageUrl: string): Promise<boolean> {
  const supabase = createClient()

  try {
    // Extract file path from URL
    const url = new URL(imageUrl)
    const pathParts = url.pathname.split("/")
    const filePath = pathParts.slice(-2).join("/") // Get "folder/filename"

    const { error } = await supabase.storage.from("item-images").remove([filePath])

    if (error) {
      console.error("Error deleting image:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("Error in deleteImage:", error)
    return false
  }
}
