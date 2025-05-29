"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Calendar, Clock, MapPin, Users, Star, Ticket, Music } from "lucide-react"
import { getShowById } from "@/data/shows"
import SeatSelection from "@/components/seat-selection"
import PurchaseConfirmation from "@/components/purchase-confirmation"
import PurchaseSuccess from "@/components/purchase-success"

interface ShowDetailPageProps {
  showId: string
  onBack: () => void
}

type PageState = "details" | "seat-selection" | "purchase-confirmation" | "purchase-success"

export default function ShowDetailPage({ showId, onBack }: ShowDetailPageProps) {
  const [currentPage, setCurrentPage] = useState<PageState>("details")
  const [selectedSeats, setSelectedSeats] = useState<string[]>([])
  const [customerData, setCustomerData] = useState<any>(null)

  const show = getShowById(showId)

  if (!show) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="text-center py-8">
            <Music className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Show no encontrado</h3>
            <p className="text-gray-600 mb-4">El evento que buscas no existe o ha sido removido.</p>
            <Button onClick={onBack}>Volver al inicio</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const handlePurchaseTickets = () => {
    setCurrentPage("seat-selection")
  }

  const handleSeatSelectionBack = () => {
    setCurrentPage("details")
  }

  const handleSeatSelectionConfirm = (seats: string[]) => {
    setSelectedSeats(seats)
    setCurrentPage("purchase-confirmation")
  }

  const handlePurchaseBack = () => {
    setCurrentPage("seat-selection")
  }

  const handlePurchaseComplete = (data: any) => {
    setCustomerData(data)
    setCurrentPage("purchase-success")
  }

  const handleBackToHome = () => {
    setCurrentPage("details")
    setSelectedSeats([])
    setCustomerData(null)
    onBack()
  }

  // Render different pages based on state
  if (currentPage === "seat-selection") {
    return <SeatSelection onBack={handleSeatSelectionBack} onConfirm={handleSeatSelectionConfirm} />
  }

  if (currentPage === "purchase-confirmation") {
    return (
      <PurchaseConfirmation
        selectedSeats={selectedSeats}
        onBack={handlePurchaseBack}
        onComplete={handlePurchaseComplete}
      />
    )
  }

  if (currentPage === "purchase-success") {
    return <PurchaseSuccess selectedSeats={selectedSeats} customerData={customerData} onBackToHome={handleBackToHome} />
  }

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

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-black text-white">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <img src="/images/live-nation-logo.png" alt="Live Nation" className="h-8 w-auto filter invert" />
            <div>
              <h1 className="text-2xl font-bold">LIVE NATION</h1>
              <p className="text-sm text-gray-300">Productions</p>
            </div>
          </div>
          <Button
            onClick={onBack}
            variant="outline"
            className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-600 to-red-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-5xl font-bold mb-4">{show.title}</h2>
          <p className="text-xl mb-8">{show.artist}</p>
          <div className="flex flex-wrap justify-center gap-6 text-sm">
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
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Event Banner */}
          <div className="relative rounded-xl overflow-hidden mb-10 shadow-xl">
            <img src={show.image || "/placeholder.svg"} alt="Event Banner" className="w-full h-64 object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6">
              <div className="flex items-center space-x-4 mb-2">
                {getStatusBadge(show.status)}
                <Badge variant="outline" className="bg-white/20 text-white border-white/30">
                  {show.genre}
                </Badge>
                {show.featured && (
                  <Badge className="bg-yellow-500 text-black">
                    <Star className="h-3 w-3 mr-1" />
                    Destacado
                  </Badge>
                )}
              </div>
              <h2 className="text-3xl font-bold text-white">{show.title}</h2>
              <p className="text-gray-200">{show.description}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Ticket Information */}
            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Información de Tickets</span>
                  {getStatusBadge(show.status)}
                </CardTitle>
                <CardDescription>Asegura tu lugar para este evento exclusivo</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Precio desde:</span>
                  <span className="text-2xl font-bold text-red-600">${show.priceRange.min.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Precio hasta:</span>
                  <span className="text-green-600">${show.priceRange.max.toLocaleString()}</span>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg mb-4">
                  <div className="flex items-center space-x-3 text-gray-700">
                    <Ticket className="h-5 w-5 text-red-500" />
                    <div>
                      <p className="font-medium">Múltiples opciones de asientos disponibles</p>
                      <p className="text-sm">Secciones VIP, Premium y General</p>
                    </div>
                  </div>
                </div>
                <Button
                  onClick={handlePurchaseTickets}
                  className="w-full bg-red-600 hover:bg-red-700"
                  disabled={show.status === "sold-out" || show.status === "coming-soon"}
                >
                  {show.status === "sold-out"
                    ? "Agotado"
                    : show.status === "coming-soon"
                      ? "Próximamente"
                      : "Comprar Tickets"}
                </Button>
              </CardContent>
            </Card>

            {/* Event Details */}
            <Card>
              <CardHeader>
                <CardTitle>Detalles del Evento</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">Capacidad: {show.capacity.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm">Género: {show.genre}</span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div>
                    <span className="font-semibold">Puertas abren:</span>
                    <span className="ml-2">{formatTime(show.doors)}</span>
                  </div>
                  <div>
                    <span className="font-semibold">Inicio del show:</span>
                    <span className="ml-2">{formatTime(show.time)}</span>
                  </div>
                  <div>
                    <span className="font-semibold">Ubicación completa:</span>
                    <span className="ml-2">
                      {show.location}, {show.city}
                    </span>
                  </div>
                  {show.ageRestriction && (
                    <div>
                      <span className="font-semibold">Restricción de edad:</span>
                      <span className="ml-2">{show.ageRestriction}</span>
                    </div>
                  )}
                </div>

                <Separator />

                <div className="space-y-2">
                  <h4 className="font-semibold">Términos & Condiciones:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• El ticket es válido únicamente para la fecha y hora indicadas.</li>
                    <li>• No se permite el ingreso con bebidas, alimentos o sustancias ilegales.</li>
                    <li>• No se realizarán reembolsos por cambios climáticos u otros factores externos.</li>
                    <li>• El organizador no se responsabiliza por objetos perdidos o robados.</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <img src="/images/live-nation-logo.png" alt="Live Nation" className="h-6 w-auto mx-auto mb-4 filter invert" />
          <p className="text-gray-400">© 2025 Live Nation Productions. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  )
}
