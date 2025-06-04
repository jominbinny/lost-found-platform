"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, X } from "lucide-react"

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

export function ItemsFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [mounted, setMounted] = useState(false)

  const type = searchParams.get("type") || "all"
  const category = searchParams.get("category") || ""
  const search = searchParams.get("search") || ""

  useEffect(() => {
    setMounted(true)
  }, [])

  // Don't render anything during SSR to avoid hydration mismatch
  if (!mounted) return null

  const updateFilters = (newParams: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString())

    Object.entries(newParams).forEach(([key, value]) => {
      if (value === null || value === "" || value === "all") {
        params.delete(key)
      } else {
        params.set(key, value)
      }
    })

    router.push(`/items?${params.toString()}`)
  }

  const handleTypeChange = (value: string) => {
    updateFilters({ type: value === "all" ? null : value })
  }

  const handleCategoryChange = (value: string) => {
    updateFilters({ category: value || null })
  }

  const handleSearchChange = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const searchValue = formData.get("search") as string
    updateFilters({ search: searchValue || null })
  }

  const clearFilters = () => {
    router.push("/items")
  }

  const hasActiveFilters = type !== "all" || category !== "" || search !== ""

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium mb-4">Search</h2>
        <form onSubmit={handleSearchChange} className="flex gap-2">
          <Input name="search" placeholder="Search items..." defaultValue={search} />
          <Button type="submit" size="icon">
            <Search className="h-4 w-4" />
          </Button>
        </form>
      </div>

      <div>
        <h2 className="text-lg font-medium mb-4">Filter By</h2>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label>Item Type</Label>
            <RadioGroup defaultValue={type} onValueChange={handleTypeChange} className="flex flex-col space-y-1">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="all" id="all" />
                <Label htmlFor="all">All Items</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="lost" id="lost" />
                <Label htmlFor="lost">Lost Items</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="found" id="found" />
                <Label htmlFor="found">Found Items</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label>Category</Label>
            <Select value={category} onValueChange={handleCategoryChange}>
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {itemCategories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {hasActiveFilters && (
        <Button variant="outline" className="w-full flex items-center gap-2" onClick={clearFilters}>
          <X className="h-4 w-4" />
          Clear Filters
        </Button>
      )}
    </div>
  )
}
