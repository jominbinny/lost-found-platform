import Link from "next/link"
import { ModeToggle } from "@/components/mode-toggle"
import { Search } from "lucide-react"

export function Navbar() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="font-bold text-xl">
          Campus Lost & Found
        </Link>

        <div className="flex items-center gap-4">
          <Link href="/items" className="flex items-center gap-1 text-sm">
            <Search className="h-4 w-4" />
            <span className="hidden sm:inline">Search Items</span>
          </Link>
          <Link href="/report/lost" className="text-sm">
            Report Lost
          </Link>
          <Link href="/report/found" className="text-sm">
            Report Found
          </Link>
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}
