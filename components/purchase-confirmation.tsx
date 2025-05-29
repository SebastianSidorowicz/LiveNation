"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Check, CreditCard, User, ArrowLeft, Mail } from "lucide-react"

interface PurchaseConfirmationProps {
  selectedSeats: string[]
  onBack: () => void
  onComplete: (customerData: any) => void
}

export default function PurchaseConfirmation({ selectedSeats, onBack, onComplete }: PurchaseConfirmationProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardName: "",
  })

  const [isProcessing, setIsProcessing] = useState(false)

  const seatPrices: { [key: string]: number } = {
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

  const getSeatPrice = (seatId: string) => {
    const row = seatId.charAt(0)
    return seatPrices[row] || 25000
  }

  const getTotalPrice = () => {
    return selectedSeats.reduce((total, seatId) => total + getSeatPrice(seatId), 0)
  }

  const getSeatSection = (seatId: string) => {
    const row = seatId.charAt(0)
    if (["A", "B"].includes(row)) return "VIP"
    if (["C", "D", "E"].includes(row)) return "Premium"
    return "General"
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const sendTicketEmail = async (orderNumber: string) => {
    try {
      const ticketData = {
        orderNumber,
        customerName: formData.name,
        customerEmail: formData.email,
        eventName: "The Show Must Go On",
        eventDate: "Jun 20, 2025",
        eventTime: "11:20 PM",
        eventLocation: "Maestro M. Lopez esq, Cruz Roja Argentina S/N, Córdoba",
        seats: selectedSeats.map((seatId) => ({
          id: seatId,
          section: getSeatSection(seatId),
          price: getSeatPrice(seatId),
        })),
        totalAmount: getTotalPrice() + 2500,
      }

      const response = await fetch("/api/send-ticket-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(ticketData),
      })

      const result = await response.json()

      if (result.success) {
        console.log("Email enviado exitosamente")
        // En desarrollo, mostrar el contenido del email
        if (result.emailContent) {
          console.log("Contenido del email:", result.emailContent)
        }
      } else {
        console.error("Error enviando email:", result.message)
      }
    } catch (error) {
      console.error("Error enviando email:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validaciones básicas
    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.cardNumber ||
      !formData.expiryDate ||
      !formData.cvv
    ) {
      alert("Por favor completa todos los campos")
      return
    }

    if (formData.cardNumber.length < 16) {
      alert("Número de tarjeta inválido")
      return
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      alert("Por favor ingresa un email válido")
      return
    }

    setIsProcessing(true)

    // Simular procesamiento de pago
    setTimeout(async () => {
      const orderNumber = `LN${Date.now().toString().slice(-8)}`

      // Enviar email con los tickets
      await sendTicketEmail(orderNumber)

      setIsProcessing(false)
      onComplete({
        ...formData,
        orderNumber,
        totalAmount: getTotalPrice() + 2500,
      })
    }, 3000)
  }

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ""
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    if (parts.length) {
      return parts.join(" ")
    } else {
      return v
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button onClick={onBack} variant="outline" className="flex items-center space-x-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Volver</span>
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Confirmación de Compra</h1>
          <div></div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Formulario de pago */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="h-5 w-5" />
                <span>Información de Pago</span>
              </CardTitle>
              <CardDescription>Completa tus datos para finalizar la compra</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Información personal */}
                <div className="space-y-4">
                  <h4 className="font-semibold flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>Información Personal</span>
                  </h4>

                  <div>
                    <Label htmlFor="name">Nombre Completo</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      placeholder="Juan Pérez"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="juan@email.com"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      <Mail className="h-3 w-3 inline mr-1" />
                      Los tickets se enviarán a este email
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="phone">Teléfono</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="+54 9 11 1234-5678"
                      required
                    />
                  </div>
                </div>

                <Separator />

                {/* Información de tarjeta */}
                <div className="space-y-4">
                  <h4 className="font-semibold">Información de Tarjeta</h4>

                  <div>
                    <Label htmlFor="cardNumber">Número de Tarjeta</Label>
                    <Input
                      id="cardNumber"
                      value={formData.cardNumber}
                      onChange={(e) => handleInputChange("cardNumber", formatCardNumber(e.target.value))}
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiryDate">Fecha de Vencimiento</Label>
                      <Input
                        id="expiryDate"
                        value={formData.expiryDate}
                        onChange={(e) => handleInputChange("expiryDate", e.target.value)}
                        placeholder="MM/AA"
                        maxLength={5}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        value={formData.cvv}
                        onChange={(e) => handleInputChange("cvv", e.target.value)}
                        placeholder="123"
                        maxLength={4}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="cardName">Nombre en la Tarjeta</Label>
                    <Input
                      id="cardName"
                      value={formData.cardName}
                      onChange={(e) => handleInputChange("cardName", e.target.value)}
                      placeholder="JUAN PEREZ"
                      required
                    />
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2 text-blue-800">
                    <Mail className="h-4 w-4" />
                    <span className="font-semibold">Entrega Digital</span>
                  </div>
                  <p className="text-sm text-blue-700 mt-1">
                    Tus tickets se enviarán automáticamente a tu email después del pago exitoso.
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-3"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Procesando Pago y Enviando Tickets...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Check className="h-4 w-4" />
                      <span>Confirmar Compra - ${getTotalPrice().toLocaleString()}</span>
                    </div>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Resumen de compra */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Resumen de Compra</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Asientos Seleccionados</h4>
                    <div className="space-y-2">
                      {selectedSeats.map((seatId) => (
                        <div key={seatId} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold">{seatId}</span>
                            <Badge variant="outline">{getSeatSection(seatId)}</Badge>
                          </div>
                          <span className="font-semibold">${getSeatPrice(seatId).toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>${getTotalPrice().toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Cargo por servicio:</span>
                      <span>$2.500</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total:</span>
                      <span className="text-red-600">${(getTotalPrice() + 2500).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Detalles del Evento</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span>Evento:</span>
                  <span className="font-semibold">The Show Must Go On</span>
                </div>
                <div className="flex justify-between">
                  <span>Fecha:</span>
                  <span>Jun 20, 2025</span>
                </div>
                <div className="flex justify-between">
                  <span>Hora:</span>
                  <span>11:20 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Lugar:</span>
                  <span>Cruz Roja Argentina</span>
                </div>
                <div className="flex justify-between">
                  <span>Cantidad:</span>
                  <span>
                    {selectedSeats.length} ticket{selectedSeats.length !== 1 ? "s" : ""}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
