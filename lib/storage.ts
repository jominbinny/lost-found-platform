export interface Item {
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

export interface ContactRequest {
  id: string
  item_id: string
  from_name: string
  from_email: string
  to_email: string
  message: string
  created_at: string
  is_read: boolean
}

// Storage keys
const ITEMS_KEY = "campus_lost_found_items"
const CONTACT_REQUESTS_KEY = "campus_lost_found_contacts"

// Initialize with sample data if localStorage is empty
const initializeSampleData = () => {
  if (typeof window === "undefined") return

  const existingItems = localStorage.getItem(ITEMS_KEY)
  if (!existingItems) {
    const sampleItems: Item[] = [
      {
        id: "1",
        type: "lost",
        name: "John Smith",
        email: "john@example.com",
        item_name: "Blue Hydroflask Water Bottle",
        category: "Water Bottle",
        description: "Navy blue 32oz Hydroflask with a dent on the bottom and a sticker of a mountain on the side.",
        location: "Science Building, Room 302",
        date: "2024-01-15T14:30:00Z",
        created_at: "2024-01-15T14:30:00Z",
      },
      {
        id: "2",
        type: "lost",
        name: "Emily Johnson",
        email: "emily@example.com",
        item_name: "MacBook Pro Charger",
        category: "Electronics",
        description: "White Apple MacBook Pro charger with my name written in black marker on the brick.",
        location: "Library, 2nd floor study area",
        date: "2024-01-16T18:45:00Z",
        created_at: "2024-01-16T18:45:00Z",
      },
      {
        id: "3",
        type: "found",
        name: "Jessica Martinez",
        email: "jessica@example.com",
        item_name: "Silver iPhone 13",
        category: "Electronics",
        description: "Silver iPhone 13 with a clear case. Screen is cracked in the bottom right corner. Found locked.",
        location: "Engineering Building Hallway",
        date: "2024-01-15T17:10:00Z",
        created_at: "2024-01-15T17:10:00Z",
      },
      {
        id: "4",
        type: "found",
        name: "Robert Taylor",
        email: "robert@example.com",
        item_name: "Black Wallet",
        category: "Wallet",
        description: "Small black leather wallet containing some cash and cards. No ID inside.",
        location: "Basketball Court",
        date: "2024-01-16T19:30:00Z",
        created_at: "2024-01-16T19:30:00Z",
      },
      {
        id: "5",
        type: "lost",
        name: "Sarah Wilson",
        email: "sarah@example.com",
        item_name: "Black North Face Backpack",
        category: "Bag/Backpack",
        description:
          "Black North Face Surge backpack with a small tear on the front pocket. Contains textbooks and notebooks.",
        location: "Parking Lot B",
        date: "2024-01-18T08:30:00Z",
        created_at: "2024-01-18T08:30:00Z",
      },
      {
        id: "6",
        type: "found",
        name: "Amanda Garcia",
        email: "amanda@example.com",
        item_name: "Textbook - Introduction to Psychology",
        category: "Books",
        description: "Introduction to Psychology textbook, 5th edition. Name 'Alex' written inside the cover.",
        location: "Classroom 105, Arts Building",
        date: "2024-01-17T15:45:00Z",
        created_at: "2024-01-17T15:45:00Z",
      },
    ]
    localStorage.setItem(ITEMS_KEY, JSON.stringify(sampleItems))
  }

  const existingContacts = localStorage.getItem(CONTACT_REQUESTS_KEY)
  if (!existingContacts) {
    localStorage.setItem(CONTACT_REQUESTS_KEY, JSON.stringify([]))
  }
}

// Item operations
export const getItems = (): Item[] => {
  if (typeof window === "undefined") return []

  initializeSampleData()
  const items = localStorage.getItem(ITEMS_KEY)
  return items ? JSON.parse(items) : []
}

export const getItemById = (id: string): Item | null => {
  const items = getItems()
  return items.find((item) => item.id === id) || null
}

export const addItem = (item: Omit<Item, "id" | "created_at">): Item => {
  const items = getItems()
  const newItem: Item = {
    ...item,
    id: Date.now().toString(),
    created_at: new Date().toISOString(),
  }
  items.unshift(newItem)
  localStorage.setItem(ITEMS_KEY, JSON.stringify(items))
  return newItem
}

export const filterItems = (filters: {
  type?: "lost" | "found" | "all"
  category?: string
  search?: string
}): Item[] => {
  let items = getItems()

  if (filters.type && filters.type !== "all") {
    items = items.filter((item) => item.type === filters.type)
  }

  if (filters.category) {
    items = items.filter((item) => item.category === filters.category)
  }

  if (filters.search) {
    const searchLower = filters.search.toLowerCase()
    items = items.filter(
      (item) =>
        item.item_name.toLowerCase().includes(searchLower) || item.description.toLowerCase().includes(searchLower),
    )
  }

  return items.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
}

// Contact request operations
export const getContactRequests = (): ContactRequest[] => {
  if (typeof window === "undefined") return []

  const contacts = localStorage.getItem(CONTACT_REQUESTS_KEY)
  return contacts ? JSON.parse(contacts) : []
}

export const addContactRequest = (request: Omit<ContactRequest, "id" | "created_at" | "is_read">): ContactRequest => {
  const contacts = getContactRequests()
  const newRequest: ContactRequest = {
    ...request,
    id: Date.now().toString(),
    created_at: new Date().toISOString(),
    is_read: false,
  }
  contacts.unshift(newRequest)
  localStorage.setItem(CONTACT_REQUESTS_KEY, JSON.stringify(contacts))
  return newRequest
}

// Image handling (convert to base64 for localStorage)
export const convertImageToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}
