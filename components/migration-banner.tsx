"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Upload, X } from "lucide-react"
import { migrateFromLocalStorage } from "@/lib/migrate-from-localstorage"
import { toast } from "@/hooks/use-toast"

export function MigrationBanner() {
  const [showBanner, setShowBanner] = useState(false)
  const [isMigrating, setIsMigrating] = useState(false)

  useEffect(() => {
    // Check if there's data in localStorage to migrate
    const hasLocalData =
      localStorage.getItem("campus_lost_found_items") || localStorage.getItem("campus_lost_found_contacts")

    if (hasLocalData) {
      setShowBanner(true)
    }
  }, [])

  const handleMigrate = async () => {
    setIsMigrating(true)

    try {
      const result = await migrateFromLocalStorage()

      if (result.success) {
        toast({
          title: "Migration Successful!",
          description: result.message,
        })
        setShowBanner(false)
      } else {
        toast({
          title: "Migration Failed",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Migration Error",
        description: "An unexpected error occurred during migration",
        variant: "destructive",
      })
    } finally {
      setIsMigrating(false)
    }
  }

  const handleDismiss = () => {
    setShowBanner(false)
    // Optionally clear localStorage if user dismisses
    localStorage.removeItem("campus_lost_found_items")
    localStorage.removeItem("campus_lost_found_contacts")
  }

  if (!showBanner) return null

  return (
    <Alert className="mb-6 border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
      <Upload className="h-4 w-4" />
      <AlertDescription className="flex items-center justify-between">
        <div className="flex-1">
          <strong>Data Migration Available:</strong> We found existing data in your browser. Would you like to migrate
          it to the new database system?
        </div>
        <div className="flex items-center gap-2 ml-4">
          <Button size="sm" onClick={handleMigrate} disabled={isMigrating}>
            {isMigrating ? (
              <>
                <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                Migrating...
              </>
            ) : (
              "Migrate Data"
            )}
          </Button>
          <Button size="sm" variant="outline" onClick={handleDismiss} disabled={isMigrating}>
            <X className="h-3 w-3" />
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  )
}
