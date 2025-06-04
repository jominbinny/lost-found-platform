import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { format } from "date-fns"
import Link from "next/link"
import { ContactForm } from "@/components/contact-form"
import { getItemById } from "@/lib/storage"

export default function ItemDetailPage({ params }: { params: { id: string } }) {
  const item = getItemById(params.id)

  if (!item) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <Link href="/items" className="text-sm text-muted-foreground hover:text-foreground mb-2 inline-block">
              ← Back to all items
            </Link>
            <h1 className="text-3xl font-bold">{item.item_name}</h1>
          </div>

          <Badge variant={item.type === "lost" ? "destructive" : "default"} className="text-base px-3 py-1">
            {item.type === "lost" ? "Lost Item" : "Found Item"}
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            {item.image_url && (
              <div className="aspect-video relative rounded-lg overflow-hidden bg-muted">
                <img
                  src={item.image_url || "/placeholder.svg"}
                  alt={item.item_name}
                  className="object-contain w-full h-full"
                />
              </div>
            )}

            <div>
              <h2 className="text-xl font-semibold mb-4">Description</h2>
              <p className="text-muted-foreground whitespace-pre-wrap">{item.description}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-2">Category</h3>
                <p>{item.category}</p>
              </div>

              <div>
                <h3 className="font-medium mb-2">Location</h3>
                <p>{item.location}</p>
              </div>

              <div>
                <h3 className="font-medium mb-2">Date</h3>
                <p>{format(new Date(item.date), "PPP")}</p>
              </div>

              <div>
                <h3 className="font-medium mb-2">Status</h3>
                <Badge variant="outline">{item.type === "lost" ? "Still Missing" : "Unclaimed"}</Badge>
              </div>
            </div>
          </div>

          <div>
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">
                {item.type === "lost" ? "Found this item?" : "Is this yours?"}
              </h2>

              <p className="text-muted-foreground mb-6">
                {item.type === "lost"
                  ? "If you've found this item, please fill out the form below to contact the owner."
                  : "If this is your lost item, please fill out the form below to contact the finder."}
              </p>

              <ContactForm itemId={item.id} itemType={item.type} ownerEmail={item.email} />
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
