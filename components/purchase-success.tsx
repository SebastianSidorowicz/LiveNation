"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Check, Download, Mail, Calendar, MapPin, Clock, Inbox } from "lucide-react"
import { ProfessionalTicketGenerator } from "./professional-ticket-generator"

interface PurchaseSuccessProps {
  selectedSeats: { seatId: string; price: number; section: string; showId: string }[]
  customerData: any
  onBackToHome: () => void
}

export default function PurchaseSuccess({ selectedSeats, customerData, onBackToHome }: PurchaseSuccessProps) {
  // Get show data from customerData (passed from purchase confirmation)
  const show = customerData.showData

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

  const handleDownloadTickets = async () => {
    try {
      const generator = new ProfessionalTicketGenerator()

      const ticketsData = selectedSeats.map((seat) => ({
        seatId: seat.seatId,
        section: seat.section,
        price: seat.price,
        orderNumber: customerData.orderNumber,
        customerName: customerData.name,
        eventName: show?.title || "Evento",
        eventDate: formatDate(show?.date || ""),
        eventTime: formatTime(show?.time || ""),
        eventLocation: show ? `${show.location}, ${show.city}` : "Ubicación",
      }))

      await generator.generateAllTickets(ticketsData)
      generator.save(`tickets-${show?.title?.replace(/\s+/g, "-") || "evento"}-${customerData.orderNumber}.pdf`)

      alert("¡Tickets profesionales descargados exitosamente! 🎫✨")
    } catch (error) {
      console.error("Error generando tickets profesionales:", error)
      alert("Error al generar los tickets. Por favor intenta nuevamente.")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="container mx-auto max-w-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">¡Compra Exitosa!</h1>
          <p className="text-gray-600">Tu compra ha sido procesada correctamente</p>
        </div>

        <div className="space-y-6">
          {/* Información de la orden */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Confirmación de Orden</span>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  Confirmado
                </Badge>
              </CardTitle>
              <CardDescription>Número de orden: {customerData.orderNumber}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                  <Mail className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-semibold text-blue-900">Tickets enviados por email</p>
                    <p className="text-sm text-blue-700">Revisa tu bandeja de entrada: {customerData.email}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                  <Inbox className="h-5 w-5 text-yellow-600" />
                  <div>
                    <p className="font-semibold text-yellow-900">¿No ves el email?</p>
                    <p className="text-sm text-yellow-700">Revisa tu carpeta de spam o correo no deseado</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Detalles del evento */}
          <Card>
            <CardHeader>
              <CardTitle>Detalles del Evento</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="font-semibold">{show?.title || "Evento"}</p>
                    <p className="text-sm text-gray-600">{show?.artist || "Artista"}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="font-semibold">{formatDate(show?.date || "")}</p>
                    <p className="text-sm text-gray-600">
                      {formatTime(show?.time || "")} - Puertas abren a las {formatTime(show?.doors || "")}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="font-semibold">{show?.venue || "Venue"}</p>
                    <p className="text-sm text-gray-600">
                      {show?.location || ""}, {show?.city || ""}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tickets */}
          <Card>
            <CardHeader>
              <CardTitle>Tus Tickets</CardTitle>
              <CardDescription>También enviados a tu email con códigos QR únicos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {selectedSeats.map((seat) => (
                  <div key={seat.seatId} className="flex justify-between items-center p-3 border rounded-lg bg-white">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                        <span className="font-bold text-red-600">{seat.seatId}</span>
                      </div>
                      <div>
                        <p className="font-semibold">Asiento {seat.seatId}</p>
                        <Badge variant="outline">{seat.section}</Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">${seat.price.toLocaleString()}</p>
                      <p className="text-sm text-gray-600">
                        #{customerData.orderNumber}-{seat.seatId}
                      </p>
                    </div>
                  </div>
                ))}

                <Separator />

                <div className="flex justify-between items-center font-bold text-lg">
                  <span>Total Pagado:</span>
                  <span className="text-red-600">${customerData.totalAmount.toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Instrucciones importantes */}
          <Card>
            <CardHeader>
              <CardTitle>Instrucciones Importantes</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  • <strong>Revisa tu email</strong> - Los tickets digitales han sido enviados
                </li>
                <li>• Llega al menos 30 minutos antes del evento</li>
                <li>• Presenta tu ticket digital o impreso en la entrada</li>
                <li>• Trae una identificación válida</li>
                <li>• No se permite el reingreso una vez que salgas del recinto</li>
                <li>• Revisa las políticas de seguridad del venue</li>
                <li>• Guarda este email como respaldo de tu compra</li>
              </ul>
            </CardContent>
          </Card>

          {/* Acciones */}
          <div className="flex space-x-4">
            <Button onClick={handleDownloadTickets} className="flex-1" variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Descargar Tickets
            </Button>
            <Button onClick={onBackToHome} className="flex-1 bg-red-600 hover:bg-red-700">
              Volver al Inicio
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
