import type { ShowDetails } from "@/types/show"

export const shows: ShowDetails[] = [
  {
    id: "the-show-must-go-on",
    title: "The Show Must Go On",
    artist: "Live Nation Productions",
    date: "2025-06-20",
    time: "23:20",
    venue: "Cruz Roja Argentina",
    location: "Maestro M. Lopez esq, Cruz Roja Argentina S/N",
    city: "Córdoba",
    description: "Una experiencia musical inolvidable que combina los mejores éxitos con una producción espectacular.",
    image: "/images/ticket-1.png",
    genre: "Rock",
    priceRange: { min: 25000, max: 45000 },
    status: "on-sale",
    featured: true,
    seatPricing: {
      A: 45000,
      B: 45000,
      C: 35000,
      D: 35000,
      E: 35000,
      F: 25000,
      G: 25000,
      H: 25000,
      I: 25000,
      J: 25000,
    },
    capacity: 5000,
    doors: "22:30",
  },
  {
    id: "rock-legends-night",
    title: "Rock Legends Night",
    artist: "Classic Rock Tribute",
    date: "2025-07-15",
    time: "21:00",
    venue: "Estadio Kempes",
    location: "Av. Cárcano s/n, Chateau Carreras",
    city: "Córdoba",
    description: "Los mejores tributos a las leyendas del rock en una noche épica.",
    image: "/images/ticket-2.png",
    genre: "Rock",
    priceRange: { min: 18000, max: 35000 },
    status: "on-sale",
    featured: true,
    seatPricing: {
      A: 35000,
      B: 35000,
      C: 28000,
      D: 28000,
      E: 28000,
      F: 22000,
      G: 22000,
      H: 18000,
      I: 18000,
      J: 18000,
    },
    capacity: 15000,
    doors: "20:00",
  },
  {
    id: "electronic-festival",
    title: "Electronic Dreams Festival",
    artist: "Various Artists",
    date: "2025-08-10",
    time: "20:00",
    venue: "Complejo Forja",
    location: "Av. Costanera Rafael Núñez 4750",
    city: "Córdoba",
    description: "Festival de música electrónica con los mejores DJs nacionales e internacionales.",
    image: "/images/ticket-1.png",
    genre: "Electronic",
    priceRange: { min: 15000, max: 40000 },
    status: "on-sale",
    featured: false,
    seatPricing: {
      A: 40000,
      B: 40000,
      C: 30000,
      D: 30000,
      E: 30000,
      F: 20000,
      G: 20000,
      H: 15000,
      I: 15000,
      J: 15000,
    },
    capacity: 8000,
    doors: "19:00",
  },
  {
    id: "jazz-night",
    title: "Jazz Under the Stars",
    artist: "Córdoba Jazz Ensemble",
    date: "2025-09-05",
    time: "21:30",
    venue: "Teatro del Libertador",
    location: "Av. Vélez Sársfield 365",
    city: "Córdoba",
    description: "Una noche íntima de jazz con los mejores músicos locales.",
    image: "/images/ticket-2.png",
    genre: "Jazz",
    priceRange: { min: 12000, max: 25000 },
    status: "coming-soon",
    featured: false,
    seatPricing: {
      A: 25000,
      B: 25000,
      C: 20000,
      D: 20000,
      E: 20000,
      F: 15000,
      G: 15000,
      H: 12000,
      I: 12000,
      J: 12000,
    },
    capacity: 1200,
    doors: "21:00",
  },
  {
    id: "pop-sensation",
    title: "Pop Sensation Tour",
    artist: "International Pop Star",
    date: "2025-10-20",
    time: "20:30",
    venue: "Arena Córdoba",
    location: "Av. Amadeo Sabattini 1050",
    city: "Córdoba",
    description: "El tour más esperado del año llega a Córdoba con un show espectacular.",
    image: "/images/ticket-1.png",
    genre: "Pop",
    priceRange: { min: 30000, max: 80000 },
    status: "sold-out",
    featured: true,
    seatPricing: {
      A: 80000,
      B: 80000,
      C: 60000,
      D: 60000,
      E: 60000,
      F: 45000,
      G: 45000,
      H: 35000,
      I: 35000,
      J: 30000,
    },
    capacity: 12000,
    doors: "19:30",
  },
]

export const getShowById = (id: string): ShowDetails | undefined => {
  return shows.find((show) => show.id === id)
}

export const getShowsByGenre = (genre: string): ShowDetails[] => {
  return shows.filter((show) => show.genre.toLowerCase() === genre.toLowerCase())
}

export const getFeaturedShows = (): ShowDetails[] => {
  return shows.filter((show) => show.featured)
}

export const searchShows = (query: string): ShowDetails[] => {
  const lowercaseQuery = query.toLowerCase()
  return shows.filter(
    (show) =>
      show.title.toLowerCase().includes(lowercaseQuery) ||
      show.artist.toLowerCase().includes(lowercaseQuery) ||
      show.venue.toLowerCase().includes(lowercaseQuery) ||
      show.city.toLowerCase().includes(lowercaseQuery) ||
      show.genre.toLowerCase().includes(lowercaseQuery),
  )
}
