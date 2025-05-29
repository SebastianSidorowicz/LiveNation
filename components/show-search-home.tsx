"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Calendar, MapPin, Music, Filter, Star, Clock, Users } from "lucide-react"
import { shows, searchShows, getFeaturedShows } from "@/data/shows"
import type { Show } from "@/types/show"

interface ShowSearchHomeProps {
  onLogout: () => void
  onSelectShow: (showId: string) => void
}

export default function ShowSearchHome({ onLogout, onSelectShow }: ShowSearchHomeProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedGenre, setSelectedGenre] = useState("all")
  const [filteredShows, setFilteredShows] = useState(shows)
  const [featuredShows, setFeaturedShows] = useState<Show[]>([])

  useEffect(() => {
    setFeaturedShows(getFeaturedShows())
  }, [])

  useEffect(() => {
    let results = shows

    // Filtrar por búsqueda
    if (searchQuery.trim()) {
      results = searchShows(searchQuery)
    }

    // Filtrar por género
    if (selectedGenre !== "all") {
      results = results.filter((show) => show.genre.toLowerCase() === selectedGenre.toLowerCase())
    }

    setFilteredShows(results)
  }, [searchQuery, selectedGenre])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "on-sale":
        return <Badge className="bg-green-600">En Venta</Badge>
      case "sold-out":
        return <Badge variant="destructive">Agotado</Badge>
      case "coming-soon":
        return <Badge variant="outline">Próximamente</Badge>
      default:
        return null
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(":")
    return `${hours}:${minutes}`
  }

  const genres = ["all", "rock", "pop", "electronic", "jazz", "reggaeton", "folk"]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Music className="h-8 w-8 text-red-600" />
                <span className="text-xl font-bold text-gray-900">LIVE NATION</span>
              </div>
              <div className="hidden md:block">
                <h1 className="text-xl font-bold text-gray-900">Encuentra tu próximo show</h1>
                <p className="text-sm text-gray-600">Los mejores eventos en vivo</p>
              </div>
            </div>
            <Button
              onClick={onLogout}
              variant="outline"
              className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
            >
              Salir
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-600 to-red-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-4">Vive la Música</h2>
          <p className="text-xl mb-8 opacity-90">Descubre los mejores eventos en vivo cerca de ti</p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4 bg-white rounded-lg p-4 shadow-lg">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar artistas, venues, ciudades..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border-0 focus:ring-2 focus:ring-red-500 text-gray-900"
                />
              </div>
              <Select value={selectedGenre} onValueChange={setSelectedGenre}>
                <SelectTrigger className="w-full md:w-48 border-0 focus:ring-2 focus:ring-red-500">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Género" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los géneros</SelectItem>
                  {genres.slice(1).map((genre) => (
                    <SelectItem key={genre} value={genre}>
                      {genre.charAt(0).toUpperCase() + genre.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        {/* Featured Shows */}
        {!searchQuery && selectedGenre === "all" && (
          <section className="mb-12">
            <div className="flex items-center space-x-2 mb-6">
              <Star className="h-6 w-6 text-yellow-500" />
              <h3 className="text-2xl font-bold text-gray-900">Shows Destacados</h3>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredShows.map((show) => (
                <Card key={show.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
                  <div className="relative">
                    <img
                      src={show.image || "/placeholder.svg"}
                      alt={show.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 right-4">{getStatusBadge(show.status)}</div>
                    <div className="absolute top-4 left-4">
                      <Badge variant="outline" className="bg-white/90">
                        {show.genre}
                      </Badge>
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-lg">{show.title}</CardTitle>
                    <CardDescription className="text-red-600 font-semibold">{show.artist}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(show.date)}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4" />
                        <span>{formatTime(show.time)}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4" />
                        <span>
                          {show.venue}, {show.city}
                        </span>
                      </div>
                      <div className="flex items-center justify-between pt-2">
                        <span className="font-semibold text-gray-900">
                          Desde ${show.priceRange.min.toLocaleString()}
                        </span>
                        <Button
                          onClick={() => onSelectShow(show.id)}
                          size="sm"
                          className="bg-red-600 hover:bg-red-700"
                          disabled={show.status === "sold-out"}
                        >
                          {show.status === "sold-out" ? "Agotado" : "Ver Tickets"}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* All Shows / Search Results */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <Music className="h-6 w-6 text-red-600" />
              <h3 className="text-2xl font-bold text-gray-900">
                {searchQuery || selectedGenre !== "all"
                  ? `Resultados ${searchQuery ? `para "${searchQuery}"` : `- ${selectedGenre}`}`
                  : "Todos los Shows"}
              </h3>
              <Badge variant="outline">{filteredShows.length} eventos</Badge>
            </div>
          </div>

          {filteredShows.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Music className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No se encontraron shows</h3>
                <p className="text-gray-600">Intenta con otros términos de búsqueda o filtros</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredShows.map((show) => (
                <Card key={show.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
                  <div className="relative">
                    <img
                      src={show.image || "/placeholder.svg"}
                      alt={show.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 right-4">{getStatusBadge(show.status)}</div>
                    <div className="absolute top-4 left-4">
                      <Badge variant="outline" className="bg-white/90">
                        {show.genre}
                      </Badge>
                    </div>
                    {show.featured && (
                      <div className="absolute bottom-4 left-4">
                        <Badge className="bg-yellow-500 text-black">
                          <Star className="h-3 w-3 mr-1" />
                          Destacado
                        </Badge>
                      </div>
                    )}
                  </div>
                  <CardHeader>
                    <CardTitle className="text-lg">{show.title}</CardTitle>
                    <CardDescription className="text-red-600 font-semibold">{show.artist}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(show.date)}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4" />
                        <span>{formatTime(show.time)}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4" />
                        <span>
                          {show.venue}, {show.city}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4" />
                        <span>Capacidad: {show.capacity.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between pt-2">
                        <span className="font-semibold text-gray-900">
                          ${show.priceRange.min.toLocaleString()} - ${show.priceRange.max.toLocaleString()}
                        </span>
                        <Button
                          onClick={() => onSelectShow(show.id)}
                          size="sm"
                          className="bg-red-600 hover:bg-red-700"
                          disabled={show.status === "sold-out"}
                        >
                          {show.status === "sold-out"
                            ? "Agotado"
                            : show.status === "coming-soon"
                              ? "Próximamente"
                              : "Ver Tickets"}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Music className="h-8 w-8 text-white" />
                <span className="text-xl font-bold text-white">LIVE NATION</span>
              </div>
              <p className="text-gray-400 text-sm">
                La plataforma líder en entretenimiento en vivo. Conectamos artistas con fans.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Eventos</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Conciertos</li>
                <li>Festivales</li>
                <li>Teatro</li>
                <li>Deportes</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Soporte</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Centro de Ayuda</li>
                <li>Contacto</li>
                <li>Reembolsos</li>
                <li>FAQ</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Síguenos</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="https://www.facebook.com/LiveNation/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
                    Facebook
                  </a>
                </li>
                <li>
                  <a href="https://www.instagram.com/livenationnyc" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
                    Instagram
                  </a>
                </li>
                <li>
                  <a href="https://x.com/LiveNation" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
                    Twitter
                  </a>
                </li>
                <li>
                  <a href="https://www.youtube.com/user/livenationhungary" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
                    YouTube
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>© 2025 Live Nation Productions. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
