export interface ShowDetails {
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
  priceRange: { min: number; max: number }
  status: string
  featured: boolean
  seatPricing: { [key: string]: number }
  capacity: number
  doors: string
}

export const shows: ShowDetails[] = [
  {
    id: "the-show-must-go-on",
    title: "The Show Must Go On Tour",
    artist: "Queen",
    date: "2025-06-20",
    time: "23:20",
    venue: "Cruz Roja Argentina",
    location: "Maestro M. Lopez esq, Cruz Roja Argentina S/N",
    city: "Córdoba",
    description: "Una experiencia musical inolvidable con los mejores éxitos de Queen en un tributo espectacular.",
    image: "/images/queen.jpg",
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
    id: "dua-lipa-live",
    title: "Future Nostalgia Tour",
    artist: "Dua Lipa",
    date: "2025-07-15",
    time: "21:00",
    venue: "Estadio Kempes",
    location: "Av. Cárcano s/n, Chateau Carreras",
    city: "Córdoba",
    description: "Dua Lipa llega a Córdoba con su gira mundial Future Nostalgia con todos sus éxitos.",
    image: "/images/dua lipa.jpg",
    genre: "Pop",
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
    id: "linkin-park-reunion",
    title: "Linkin Park Reunion Tour",
    artist: "Linkin Park",
    date: "2025-08-10",
    time: "20:00",
    venue: "Complejo Forja",
    location: "Av. Costanera Rafael Núñez 4750",
    city: "Córdoba",
    description: "El esperado regreso de Linkin Park con un show que recorre toda su discografía.",
    image: "/images/linking park.jpg",
    genre: "Rock",
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
    id: "oasis-comeback",
    title: "Oasis Comeback Tour",
    artist: "Oasis",
    date: "2025-09-05",
    time: "21:30",
    venue: "Teatro del Libertador",
    location: "Av. Vélez Sársfield 365",
    city: "Córdoba",
    description:
      "Después de años de espera, los hermanos Gallagher vuelven a reunirse para una gira mundial histórica.",
    image: "/images/oasis.png",
    genre: "Rock",
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
    id: "imagine-dragons-world-tour",
    title: "Imagine Dragons World Tour",
    artist: "Imagine Dragons",
    date: "2025-10-20",
    time: "20:30",
    venue: "Arena Córdoba",
    location: "Av. Amadeo Sabattini 1050",
    city: "Córdoba",
    description: "Imagine Dragons presenta su nuevo álbum con un espectáculo visual y sonoro sin precedentes.",
    image: "/images/imagine dragons.jpeg",
    genre: "Rock",
    priceRange: { min: 30000, max: 80000 },
    status: "on-sale",
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
  {
    id: "bad-bunny-latin-tour",
    title: "El Último Tour del Mundo",
    artist: "Bad Bunny",
    date: "2025-11-15",
    time: "22:00",
    venue: "Estadio Mario Alberto Kempes",
    location: "Av. Cárcano s/n, Chateau Carreras",
    city: "Córdoba",
    description: "El artista latino más escuchado del mundo llega a Córdoba con todos sus éxitos.",
    image: "/images/bad bunny.png",
    genre: "Urbano",
    priceRange: { min: 35000, max: 90000 },
    status: "sold-out",
    featured: true,
    seatPricing: {
      A: 90000,
      B: 90000,
      C: 70000,
      D: 70000,
      E: 70000,
      F: 50000,
      G: 50000,
      H: 40000,
      I: 40000,
      J: 35000,
    },
    capacity: 20000,
    doors: "20:30",
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
