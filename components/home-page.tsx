"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin, Users, Music, Star, Ticket } from "lucide-react"
import SeatSelection from "@/components/seat-selection"
import PurchaseConfirmation from "@/components/purchase-confirmation"
import PurchaseSuccess from "@/components/purchase-success"

interface HomePageProps {
  onLogout: () => void
}

type PageState = "home" | "seat-selection" | "purchase-confirmation" | "purchase-success"

export default function HomePage({ onLogout }: HomePageProps) {
  const [currentPage, setCurrentPage] = useState<PageState>("home")
  const [selectedSeats, setSelectedSeats] = useState<string[]>([])
  const [customerData, setCustomerData] = useState<any>(null)

  const handlePurchaseTickets = () => {
    setCurrentPage("seat-selection")
  }

  const handleSeatSelectionBack = () => {
    setCurrentPage("home")
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
    setCurrentPage("home")
    setSelectedSeats([])
    setCustomerData(null)
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

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-black text-white">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Music className="h-8 w-8 text-red-500" />
            <div>
              <h1 className="text-2xl font-bold">LIVE NATION</h1>
              <p className="text-sm text-gray-300">Productions</p>
            </div>
          </div>
          <Button
            onClick={onLogout}
            variant="outline"
            className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
          >
            Exit
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-600 to-red-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-5xl font-bold mb-4">The Show Must Go On</h2>
          <p className="text-xl mb-8">An Unforgettable Live Experience</p>
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>Jun 20, 2025</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <span>11:20 PM</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4" />
              <span>Maestro M. Lopez esq, Cruz Roja Argentina S/N, Córdoba</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Event Banner */}
          <div className="relative rounded-xl overflow-hidden mb-10 shadow-xl">
            <img src="/images/ticket-1.png" alt="Event Banner" className="w-full h-64 object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6">
              <Badge className="mb-2 bg-red-600 hover:bg-red-700 self-start">LIVE EVENT</Badge>
              <h2 className="text-3xl font-bold text-white">The Show Must Go On</h2>
              <p className="text-gray-200">An unforgettable night of music and performance</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Ticket Information */}
            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Ticket Information</span>
                  <Badge variant="destructive">ON SALE</Badge>
                </CardTitle>
                <CardDescription>Secure your spot for this exclusive event</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Starting Price:</span>
                  <span className="text-2xl font-bold text-red-600">$25.000</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold">VIP Packages:</span>
                  <span className="text-green-600">Available</span>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg mb-4">
                  <div className="flex items-center space-x-3 text-gray-700">
                    <Ticket className="h-5 w-5 text-red-500" />
                    <div>
                      <p className="font-medium">Multiple seating options available</p>
                      <p className="text-sm">VIP, Premium and General sections</p>
                    </div>
                  </div>
                </div>
                <Button onClick={handlePurchaseTickets} className="w-full bg-red-600 hover:bg-red-700">
                  Purchase Tickets
                </Button>
              </CardContent>
            </Card>

            {/* Event Details */}
            <Card>
              <CardHeader>
                <CardTitle>Event Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">Capacity: 5,000</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm">VIP Available</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Terms & Conditions:</h4>
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

          {/* Featured Images */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="overflow-hidden">
              <img src="/images/ticket-1.png" alt="Live Nation Ticket Design" className="w-full h-48 object-cover" />
              <CardContent className="p-4">
                <h3 className="font-semibold">Official Event Ticket</h3>
                <p className="text-sm text-gray-600">Secure digital tickets with unique QR codes</p>
              </CardContent>
            </Card>
            <Card className="overflow-hidden">
              <img src="/images/ticket-2.png" alt="Event Terms and Conditions" className="w-full h-48 object-cover" />
              <CardContent className="p-4">
                <h3 className="font-semibold">Event Information</h3>
                <p className="text-sm text-gray-600">Complete details and terms for attendees</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">© 2025 Live Nation Productions. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
