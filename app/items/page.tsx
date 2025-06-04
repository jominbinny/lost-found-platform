import { ItemsGrid } from "@/components/items-grid"
import { ItemsFilter } from "@/components/items-filter"

export default function ItemsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Browse Items</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <ItemsFilter />
        </div>

        <div className="lg:col-span-3">
          <ItemsGrid />
        </div>
      </div>
    </div>
  )
}
