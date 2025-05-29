export interface Show {
  id: string
  title: string
  artist: string
  date: string
  time: string
  venue: string
  location: string
  city: string
  description: string
  image: string
  genre: string
  priceRange: {
    min: number
    max: number
  }
  status: "on-sale" | "sold-out" | "coming-soon"
  featured: boolean
}

export interface SeatPricing {
  [key: string]: number
}

export interface ShowDetails extends Show {
  seatPricing: SeatPricing
  capacity: number
  ageRestriction?: string
  doors: string
}
