"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { format } from "date-fns"
import { CalendarIcon, Loader2, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { toast } from "@/hooks/use-toast"
import { createClient } from "@/lib/supabase/client"
import { uploadImage } from "@/lib/supabase/storage"

const formSchema = z.object({
  name: z.string().optional(),
  email: z.string().email("Please enter a valid email address"),
  item_name: z.string().min(2, "Item name must be at least 2 characters"),
  category: z.string().min(1, "Please select a category"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  location: z.string().min(2, "Location must be at least 2 characters"),
  date: z.date({ required_error: "Please select a date" }),
  image: z.instanceof(File).optional(),
})

const itemCategories = [
  "ID Card",
  "Electronics",
  "Clothing",
  "Accessories",
  "Books",
  "Keys",
  "Water Bottle",
  "Bag/Backpack",
  "Wallet",
  "Other",
]

export function ReportForm({ type }: { type: "lost" | "found" }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      item_name: "",
      category: "",
      description: "",
      location: "",
      date: new Date(),
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)

    try {
      let imageUrl = null

      // Upload image if provided (only for found items)
      if (type === "found" && values.image && values.image.size > 0) {
        imageUrl = await uploadImage(values.image, type)
        if (!imageUrl) {
          throw new Error("Failed to upload image")
        }
      }

      // Insert item into database
      const { error } = await supabase.from("items").insert({
        type,
        name: values.name || null,
        email: values.email,
        item_name: values.item_name,
        category: values.category,
        description: values.description,
        location: values.location,
        date: values.date.toISOString(),
        image_url: imageUrl,
      })

      if (error) {
        throw new Error(`Error submitting form: ${error.message}`)
      }

      toast({
        title: "Success!",
        description:
          type === "lost"
            ? "Your lost item has been reported. We'll notify you if someone finds it."
            : "Thank you for reporting a found item. The owner will be notified.",
      })

      router.push("/")
    } catch (error) {
      console.error("Error:", error)
      toast({
        title: "Error",
        description: "There was a problem submitting your report. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      form.setValue("image", file)

      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    form.setValue("image", undefined)
    setImagePreview(null)
    // Reset the file input
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
    if (fileInput) {
      fileInput.value = ""
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your Name (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormDescription>Your name will only be visible to administrators.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input type="email" placeholder="you@example.com" {...field} required />
              </FormControl>
              <FormDescription>
                Your email will be used to contact you if your item is {type === "lost" ? "found" : "claimed"}.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="item_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Item Name</FormLabel>
              <FormControl>
                <Input placeholder="Blue Hydroflask Water Bottle" {...field} required />
              </FormControl>
              <FormDescription>A short name for the item you {type === "lost" ? "lost" : "found"}.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {itemCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>Select the category that best describes the item.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Provide details about the item (color, brand, distinguishing features, etc.)"
                  className="min-h-[120px]"
                  {...field}
                  required
                />
              </FormControl>
              <FormDescription>
                The more details you provide, the easier it will be to{" "}
                {type === "lost" ? "find your item" : "identify the owner"}.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input
                  placeholder={type === "lost" ? "Where you think you lost it" : "Where you found it"}
                  {...field}
                  required
                />
              </FormControl>
              <FormDescription>Be as specific as possible (building name, room number, etc.).</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button variant={"outline"} className="w-full pl-3 text-left font-normal">
                      {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date > new Date() || date < new Date("2000-01-01")}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>The date when you {type === "lost" ? "lost" : "found"} the item.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {type === "found" && (
          <FormField
            control={form.control}
            name="image"
            render={({ field: { value, onChange, ...fieldProps } }) => (
              <FormItem>
                <FormLabel>Image (Optional)</FormLabel>
                <FormControl>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        {...fieldProps}
                        className="max-w-sm"
                      />
                      {imagePreview && (
                        <Button type="button" variant="outline" size="icon" onClick={removeImage}>
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    {imagePreview && (
                      <div className="mt-2 relative aspect-video w-full max-w-sm rounded-md overflow-hidden border">
                        <img
                          src={imagePreview || "/placeholder.svg"}
                          alt="Preview"
                          className="object-contain w-full h-full"
                        />
                      </div>
                    )}
                  </div>
                </FormControl>
                <FormDescription>
                  Upload a clear photo of the item you found to help the owner identify it.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            `Submit ${type === "lost" ? "Lost" : "Found"} Item Report`
          )}
        </Button>
      </form>
    </Form>
  )
}
