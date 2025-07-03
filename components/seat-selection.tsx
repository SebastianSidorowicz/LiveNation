"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, User, CreditCard } from "lucide-react"
import { getShowById } from "@/data/shows"

interface SeatSelectionProps {
  onBack: () => void
  onConfirm: (selectedSeats: { seatId: string; price: number; section: string; showId: string }[]) => void
  showId: string
}

interface Seat {
  id: string
  row: string
  number: number
  status: "available" | "occupied" | "selected"
  price: number
  section: string
}

export default function SeatSelection({ onBack, onConfirm, showId }: SeatSelectionProps) {
  // Get show details based on showId
  const show = getShowById(showId)

  // Generar asientos con algunos ocupados aleatoriamente
  const generateSeats = (): Seat[] => {
    const seats: Seat[] = []

    // Use show's pricing if available, otherwise use default pricing
    const seatPricing = show?.seatPricing || {
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
    }

    const sections = [
      { name: "VIP", rows: ["A", "B"], seatsPerRow: 10, price: seatPricing.A },
      { name: "Premium", rows: ["C", "D", "E"], seatsPerRow: 12, price: seatPricing.C },
      { name: "General", rows: ["F", "G", "H", "I", "J"], seatsPerRow: 15, price: seatPricing.F },
    ]

    sections.forEach((section) => {
      section.rows.forEach((row) => {
        for (let i = 1; i <= section.seatsPerRow; i++) {
          const seatId = `${row}${i}`
          const isOccupied = Math.random() < 0.3 // 30% de asientos ocupados
          seats.push({
            id: seatId,
            row,
            number: i,
            status: isOccupied ? "occupied" : "available",
            price: seatPricing[row] || section.price,
            section: section.name,
          })
        }
      })
    })

    return seats
  }

  const [seats, setSeats] = useState<Seat[]>(generateSeats())
  const [selectedSeats, setSelectedSeats] = useState<string[]>([])

  const handleSeatClick = (seatId: string) => {
    const seat = seats.find((s) => s.id === seatId)
    if (!seat || seat.status === "occupied") return

    setSeats((prevSeats) =>
      prevSeats.map((s) => {
        if (s.id === seatId) {
          const newStatus = s.status === "selected" ? "available" : "selected"
          return { ...s, status: newStatus }
        }
        return s
      }),
    )

    setSelectedSeats((prev) => {
      if (prev.includes(seatId)) {
        return prev.filter((id) => id !== seatId)
      } else {
        return [...prev, seatId]
      }
    })
  }

  const getSeatColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-500 hover:bg-green-600"
      case "occupied":
        return "bg-red-500 cursor-not-allowed"
      case "selected":
        return "bg-blue-500 hover:bg-blue-600"
      default:
        return "bg-gray-500"
    }
  }

  const getSelectedSeatsInfo = () => {
    return seats.filter((seat) => selectedSeats.includes(seat.id))
  }

  const getTotalPrice = () => {
    return getSelectedSeatsInfo().reduce((total, seat) => total + seat.price, 0)
  }

  const groupSeatsByRow = () => {
    const grouped: { [key: string]: Seat[] } = {}
    seats.forEach((seat) => {
      if (!grouped[seat.row]) {
        grouped[seat.row] = []
      }
      grouped[seat.row].push(seat)
    })
    return grouped
  }

  const handleConfirmSelection = () => {
    if (selectedSeats.length === 0) {
      alert("Por favor selecciona al menos un asiento")
      return
    }

    const selectedData = getSelectedSeatsInfo().map((seat) => ({
      seatId: seat.id,
      price: seat.price,
      section: seat.section,
      showId: showId,
    }))

    onConfirm(selectedData)
  }

  const groupedSeats = groupSeatsByRow()

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  // Format time for display
  const formatTime = (timeString: string) => {
    if (!timeString) return ""
    const [hours, minutes] = timeString.split(":")
    return `${hours}:${minutes}`
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button onClick={onBack} variant="outline" className="flex items-center space-x-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Volver</span>
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Selección de Asientos</h1>
          <div></div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Mapa de asientos */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Mapa del Venue</CardTitle>
                <CardDescription>Haz clic en los asientos disponibles para seleccionarlos</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Escenario */}
                <div className="bg-gray-800 text-white text-center py-4 mb-8 rounded-lg">
                  <h3 className="text-lg font-bold">🎤 ESCENARIO 🎤</h3>
                </div>

                {/* Leyenda */}
                <div className="flex justify-center space-x-6 mb-6">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-green-500 rounded"></div>
                    <span className="text-sm">Disponible</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-blue-500 rounded"></div>
                    <span className="text-sm">Seleccionado</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-red-500 rounded"></div>
                    <span className="text-sm">Ocupado</span>
                  </div>
                </div>

                {/* Asientos por sección */}
                <div className="space-y-6">
                  {/* VIP Section */}
                  <div>
                    <h4 className="text-lg font-semibold mb-2 text-purple-600">
                      VIP - ${(show?.seatPricing?.A || 45000).toLocaleString()}
                    </h4>
                    <div className="space-y-2">
                      {["A", "B"].map((row) => (
                        <div key={row} className="flex items-center justify-center space-x-1">
                          <span className="w-6 text-center font-semibold">{row}</span>
                          {groupedSeats[row]?.map((seat) => (
                            <button
                              key={seat.id}
                              onClick={() => handleSeatClick(seat.id)}
                              className={`w-8 h-8 rounded text-xs font-semibold text-white transition-colors ${getSeatColor(seat.status)}`}
                              disabled={seat.status === "occupied"}
                              title={`Asiento ${seat.id} - $${seat.price.toLocaleString()}`}
                            >
                              {seat.number}
                            </button>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Premium Section */}
                  <div>
                    <h4 className="text-lg font-semibold mb-2 text-orange-600">
                      Premium - ${(show?.seatPricing?.C || 35000).toLocaleString()}
                    </h4>
                    <div className="space-y-2">
                      {["C", "D", "E"].map((row) => (
                        <div key={row} className="flex items-center justify-center space-x-1">
                          <span className="w-6 text-center font-semibold">{row}</span>
                          {groupedSeats[row]?.map((seat) => (
                            <button
                              key={seat.id}
                              onClick={() => handleSeatClick(seat.id)}
                              className={`w-8 h-8 rounded text-xs font-semibold text-white transition-colors ${getSeatColor(seat.status)}`}
                              disabled={seat.status === "occupied"}
                              title={`Asiento ${seat.id} - $${seat.price.toLocaleString()}`}
                            >
                              {seat.number}
                            </button>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* General Section */}
                  <div>
                    <h4 className="text-lg font-semibold mb-2 text-blue-600">
                      General - ${(show?.seatPricing?.F || 25000).toLocaleString()}
                    </h4>
                    <div className="space-y-2">
                      {["F", "G", "H", "I", "J"].map((row) => (
                        <div key={row} className="flex items-center justify-center space-x-1">
                          <span className="w-6 text-center font-semibold">{row}</span>
                          {groupedSeats[row]?.map((seat) => (
                            <button
                              key={seat.id}
                              onClick={() => handleSeatClick(seat.id)}
                              className={`w-8 h-8 rounded text-xs font-semibold text-white transition-colors ${getSeatColor(seat.status)}`}
                              disabled={seat.status === "occupied"}
                              title={`Asiento ${seat.id} - $${seat.price.toLocaleString()}`}
                            >
                              {seat.number}
                            </button>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Resumen de selección */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Asientos Seleccionados</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedSeats.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No has seleccionado ningún asiento</p>
                ) : (
                  <div className="space-y-3">
                    {getSelectedSeatsInfo().map((seat) => (
                      <div key={seat.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <div>
                          <span className="font-semibold">{seat.id}</span>
                          <Badge variant="outline" className="ml-2">
                            {seat.section}
                          </Badge>
                        </div>
                        <span className="font-semibold">${seat.price.toLocaleString()}</span>
                      </div>
                    ))}
                    <Separator />
                    <div className="flex justify-between items-center font-bold text-lg">
                      <span>Total:</span>
                      <span className="text-red-600">${getTotalPrice().toLocaleString()}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Información del Evento</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span>Evento:</span>
                  <span className="font-semibold">{show?.title || "Evento"}</span>
                </div>
                <div className="flex justify-between">
                  <span>Artista:</span>
                  <span className="font-semibold">{show?.artist || "Artista"}</span>
                </div>
                <div className="flex justify-between">
                  <span>Fecha:</span>
                  <span>{formatDate(show?.date || "")}</span>
                </div>
                <div className="flex justify-between">
                  <span>Hora:</span>
                  <span>{formatTime(show?.time || "")}</span>
                </div>
                <div className="flex justify-between">
                  <span>Lugar:</span>
                  <span>{show?.venue || "Venue"}</span>
                </div>
              </CardContent>
            </Card>

            <Button
              onClick={handleConfirmSelection}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-3"
              disabled={selectedSeats.length === 0}
            >
              <CreditCard className="h-4 w-4 mr-2" />
              Proceder al Pago ({selectedSeats.length} asiento{selectedSeats.length !== 1 ? "s" : ""})
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
