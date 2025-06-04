"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { formatDistanceToNow } from "date-fns"
import { useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import type { Item } from "@/lib/supabase/types"

export function ItemsGrid() {
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const searchParams = useSearchParams()
  const supabase = createClient()

  const type = searchParams.get("type") as "lost" | "found" | null
  const category = searchParams.get("category")
  const search = searchParams.get("search")

  useEffect(() => {
    async function fetchItems() {
      setLoading(true)

      let query = supabase.from("items").select("*").order("created_at", { ascending: false })

      if (type && (type === "lost" || type === "found")) {
        query = query.eq("type", type)
      }

      if (category && category !== "all") {
        query = query.eq("category", category)
      }

      if (search) {
        query = query.or(`item_name.ilike.%${search}%,description.ilike.%${search}%`)
      }

      const { data, error } = await query

      if (error) {
        console.error("Error fetching items:", error)
      } else {
        setItems(data || [])
      }

      setLoading(false)
    }

    fetchItems()
  }, [type, category, search, supabase])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(9)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-5 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[120px] w-full mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3" />
            </CardContent>
            <CardFooter>
              <Skeleton className="h-4 w-1/3" />
            </CardFooter>
          </Card>
        ))}
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium">No items found</h3>
        <p className="text-muted-foreground mt-2">Try adjusting your filters or search terms.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <Link href={`/items/${item.id}`} key={item.id}>
          <Card className="h-full hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{item.item_name}</CardTitle>
                <Badge variant={item.type === "lost" ? "destructive" : "default"}>
                  {item.type === "lost" ? "Lost" : "Found"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {item.image_url && (
                <div className="aspect-video relative mb-4 rounded-md overflow-hidden bg-muted">
                  <img
                    src={item.image_url || "/placeholder.svg"}
                    alt={item.item_name}
                    className="object-cover w-full h-full"
                  />
                </div>
              )}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Category:</span>
                  <span>{item.category}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Location:</span>
                  <span>{item.location}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <p className="text-sm text-muted-foreground">
                {formatDistanceToNow(new Date(item.date), { addSuffix: true })}
              </p>
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  )
}
