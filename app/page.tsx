import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RecentItems } from "@/components/recent-items"
import { MigrationBanner } from "@/components/migration-banner"

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <MigrationBanner />
      <div className="flex flex-col items-center text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Campus Lost & Found</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mb-8">
          Lost something? Found something? Let's reconnect the dots.
        </p>

        <div className="flex flex-wrap gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/report/lost">Report Lost Item</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/report/found">Report Found Item</Link>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="max-w-4xl mx-auto">
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="all">All Items</TabsTrigger>
          <TabsTrigger value="lost">Lost Items</TabsTrigger>
          <TabsTrigger value="found">Found Items</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <RecentItems type="all" />
        </TabsContent>

        <TabsContent value="lost">
          <RecentItems type="lost" />
        </TabsContent>

        <TabsContent value="found">
          <RecentItems type="found" />
        </TabsContent>
      </Tabs>

      <div className="grid md:grid-cols-3 gap-8 mt-16 max-w-6xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Report Lost Items</CardTitle>
            <CardDescription>Submit details about your lost belongings</CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              Fill out a simple form with details about what you've lost, where, and when. Include your contact
              information so we can reach you when it's found.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href="/report/lost">Report Lost Item</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Report Found Items</CardTitle>
            <CardDescription>Submit details about items you've found</CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              If you've found something on campus, report it here. Upload a photo and provide details to help the owner
              identify their belongings.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full" variant="outline">
              <Link href="/report/found">Report Found Item</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Browse Items</CardTitle>
            <CardDescription>Search through all reported items</CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              Browse through all reported lost and found items. Filter by category, date, or location to find what
              you're looking for quickly.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full" variant="outline">
              <Link href="/items">View All Items</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
