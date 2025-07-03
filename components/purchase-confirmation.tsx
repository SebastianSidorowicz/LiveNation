"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Check, CreditCard, User, ArrowLeft, Mail, AlertCircle } from "lucide-react"
import { getShowById } from "@/data/shows"

interface PurchaseConfirmationProps {
  selectedSeats: { seatId: string; price: number; section: string; showId: string }[]
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

  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [isProcessing, setIsProcessing] = useState(false)

  // Get show details from the first selected seat (all seats should be from the same show)
  const showId = selectedSeats[0]?.showId
  const show = getShowById(showId)

  const getTotalPrice = () => {
    return selectedSeats.reduce((total, seat) => total + seat.price, 0)
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  // Format time for display
  const formatTime = (timeString: string) => {
    if (!timeString) return ""
    const [hours, minutes] = timeString.split(":")
    return `${hours}:${minutes}`
  }

  // Funciones de validación
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePhone = (phone: string): boolean => {
    // Solo números, espacios, guiones y paréntesis
    const phoneRegex = /^[\d\s\-$$$$+]+$/
    return phoneRegex.test(phone) && phone.replace(/\D/g, "").length >= 8
  }

  const validateCardNumber = (cardNumber: string): boolean => {
    // Solo números y espacios, mínimo 13 dígitos
    const cleanNumber = cardNumber.replace(/\s/g, "")
    return /^\d+$/.test(cleanNumber) && cleanNumber.length >= 13 && cleanNumber.length <= 19
  }

  const validateExpiryDate = (expiryDate: string): boolean => {
    if (!/^\d{2}\/\d{2}$/.test(expiryDate)) return false

    const [month, year] = expiryDate.split("/").map(Number)
    if (month < 1 || month > 12) return false

    const currentDate = new Date()
    const currentYear = currentDate.getFullYear() % 100 // Últimos 2 dígitos
    const currentMonth = currentDate.getMonth() + 1

    // Verificar que la fecha sea futura
    if (year < currentYear || (year === currentYear && month < currentMonth)) {
      return false
    }

    return true
  }

  const validateCVV = (cvv: string): boolean => {
    return /^\d{3,4}$/.test(cvv)
  }

  // Funciones de formateo
  const formatCardNumber = (value: string): string => {
    // Solo números
    const v = value.replace(/\D/g, "")
    // Agrupar de 4 en 4
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ""
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    return parts.length ? parts.join(" ") : v
  }

  const formatExpiryDate = (value: string): string => {
    // Solo números
    const v = value.replace(/\D/g, "")
    if (v.length >= 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`
    }
    return v
  }

  const formatPhone = (value: string): string => {
    // Mantener solo números, espacios, guiones, paréntesis y +
    return value.replace(/[^\d\s\-$$$$+]/g, "")
  }

  const formatCVV = (value: string): string => {
    // Solo números, máximo 4 dígitos
    return value.replace(/\D/g, "").substring(0, 4)
  }

  const handleInputChange = (field: string, value: string) => {
    let formattedValue = value
    const newErrors = { ...errors }

    // Aplicar formateo según el campo
    switch (field) {
      case "cardNumber":
        formattedValue = formatCardNumber(value)
        if (value && !validateCardNumber(formattedValue)) {
          newErrors.cardNumber = "Número de tarjeta inválido (13-19 dígitos)"
        } else {
          delete newErrors.cardNumber
        }
        break

      case "expiryDate":
        formattedValue = formatExpiryDate(value)
        if (value && !validateExpiryDate(formattedValue)) {
          newErrors.expiryDate = "Fecha inválida o vencida (MM/AA)"
        } else {
          delete newErrors.expiryDate
        }
        break

      case "cvv":
        formattedValue = formatCVV(value)
        if (value && !validateCVV(formattedValue)) {
          newErrors.cvv = "CVV inválido (3-4 dígitos)"
        } else {
          delete newErrors.cvv
        }
        break

      case "phone":
        formattedValue = formatPhone(value)
        if (value && !validatePhone(formattedValue)) {
          newErrors.phone = "Teléfono inválido (mínimo 8 dígitos)"
        } else {
          delete newErrors.phone
        }
        break

      case "email":
        if (value && !validateEmail(value)) {
          newErrors.email = "Email inválido"
        } else {
          delete newErrors.email
        }
        break

      case "name":
        if (value && value.trim().length < 2) {
          newErrors.name = "Nombre muy corto"
        } else {
          delete newErrors.name
        }
        break

      case "cardName":
        if (value && value.trim().length < 2) {
          newErrors.cardName = "Nombre en tarjeta muy corto"
        } else {
          delete newErrors.cardName
        }
        break
    }

    setFormData((prev) => ({ ...prev, [field]: formattedValue }))
    setErrors(newErrors)
  }

  const sendTicketEmail = async (orderNumber: string) => {
    if (!show) return

    try {
      const ticketData = {
        orderNumber,
        customerName: formData.name,
        customerEmail: formData.email,
        eventName: show.title,
        eventDate: formatDate(show.date),
        eventTime: formatTime(show.time),
        eventLocation: `${show.location}, ${show.city}`,
        seats: selectedSeats.map((seat) => ({
          id: seat.seatId,
          section: seat.section,
          price: seat.price,
        })),
        totalAmount: getTotalPrice() + 2500,
      }

      console.log("📧 Enviando datos del ticket:", ticketData)

      const response = await fetch("/api/send-ticket-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ticketData),
      })

      console.log("📡 Response status:", response.status)
      console.log("📡 Response headers:", Object.fromEntries(response.headers.entries()))

      // Safely parse the response
      const contentType = response.headers.get("content-type") ?? ""
      let result: any = null

      if (contentType.includes("application/json")) {
        // Response is JSON → parse normally
        result = await response.json()
        console.log("📧 Resultado JSON:", result)
      } else {
        // Probably a 4xx/5xx HTML or text response
        const text = await response.text()
        console.log("📧 Resultado texto:", text)
        result = { success: false, message: text }
      }

      if (response.ok && result?.success) {
        console.log("✅ Email enviado exitosamente")
        if (result.emailContent) {
          console.log("📧 Contenido del email disponible en desarrollo")
        }
      } else {
        console.error("❌ Error enviando email:", result?.message ?? "Respuesta no exitosa")
      }
    } catch (error) {
      console.error("❌ Error enviando email (network/parse):", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validación final
    const finalErrors: { [key: string]: string } = {}

    if (!formData.name.trim()) finalErrors.name = "Nombre requerido"
    if (!formData.email.trim()) finalErrors.email = "Email requerido"
    if (!formData.phone.trim()) finalErrors.phone = "Teléfono requerido"
    if (!formData.cardNumber.trim()) finalErrors.cardNumber = "Número de tarjeta requerido"
    if (!formData.expiryDate.trim()) finalErrors.expiryDate = "Fecha de vencimiento requerida"
    if (!formData.cvv.trim()) finalErrors.cvv = "CVV requerido"
    if (!formData.cardName.trim()) finalErrors.cardName = "Nombre en tarjeta requerido"

    // Validaciones específicas
    if (formData.email && !validateEmail(formData.email)) {
      finalErrors.email = "Email inválido"
    }
    if (formData.phone && !validatePhone(formData.phone)) {
      finalErrors.phone = "Teléfono inválido"
    }
    if (formData.cardNumber && !validateCardNumber(formData.cardNumber)) {
      finalErrors.cardNumber = "Número de tarjeta inválido"
    }
    if (formData.expiryDate && !validateExpiryDate(formData.expiryDate)) {
      finalErrors.expiryDate = "Fecha de vencimiento inválida o vencida"
    }
    if (formData.cvv && !validateCVV(formData.cvv)) {
      finalErrors.cvv = "CVV inválido"
    }

    if (Object.keys(finalErrors).length > 0) {
      setErrors(finalErrors)
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
        showData: show, // Include show data for other components
      })
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button onClick={onBack} variant="outline" className="flex items-center space-x-2 bg-transparent">
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
                    <Label htmlFor="name">Nombre Completo *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      placeholder="Juan Pérez"
                      className={errors.name ? "border-red-500" : ""}
                      required
                    />
                    {errors.name && (
                      <p className="text-red-500 text-xs mt-1 flex items-center">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {errors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="juan@email.com"
                      className={errors.email ? "border-red-500" : ""}
                      required
                    />
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1 flex items-center">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {errors.email}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      <Mail className="h-3 w-3 inline mr-1" />
                      Los tickets se enviarán a este email
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="phone">Teléfono *</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="+54 9 11 1234-5678"
                      className={errors.phone ? "border-red-500" : ""}
                      required
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-xs mt-1 flex items-center">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {errors.phone}
                      </p>
                    )}
                  </div>
                </div>

                <Separator />

                {/* Información de tarjeta */}
                <div className="space-y-4">
                  <h4 className="font-semibold">Información de Tarjeta</h4>

                  <div>
                    <Label htmlFor="cardNumber">Número de Tarjeta *</Label>
                    <Input
                      id="cardNumber"
                      value={formData.cardNumber}
                      onChange={(e) => handleInputChange("cardNumber", e.target.value)}
                      placeholder="1234 5678 9012 3456"
                      maxLength={23} // 19 dígitos + 4 espacios
                      className={errors.cardNumber ? "border-red-500" : ""}
                      required
                    />
                    {errors.cardNumber && (
                      <p className="text-red-500 text-xs mt-1 flex items-center">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {errors.cardNumber}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiryDate">Fecha de Vencimiento *</Label>
                      <Input
                        id="expiryDate"
                        value={formData.expiryDate}
                        onChange={(e) => handleInputChange("expiryDate", e.target.value)}
                        placeholder="MM/AA"
                        maxLength={5}
                        className={errors.expiryDate ? "border-red-500" : ""}
                        required
                      />
                      {errors.expiryDate && (
                        <p className="text-red-500 text-xs mt-1 flex items-center">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          {errors.expiryDate}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="cvv">CVV *</Label>
                      <Input
                        id="cvv"
                        value={formData.cvv}
                        onChange={(e) => handleInputChange("cvv", e.target.value)}
                        placeholder="123"
                        maxLength={4}
                        className={errors.cvv ? "border-red-500" : ""}
                        required
                      />
                      {errors.cvv && (
                        <p className="text-red-500 text-xs mt-1 flex items-center">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          {errors.cvv}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="cardName">Nombre en la Tarjeta *</Label>
                    <Input
                      id="cardName"
                      value={formData.cardName}
                      onChange={(e) => handleInputChange("cardName", e.target.value)}
                      placeholder="JUAN PEREZ"
                      className={errors.cardName ? "border-red-500" : ""}
                      required
                    />
                    {errors.cardName && (
                      <p className="text-red-500 text-xs mt-1 flex items-center">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {errors.cardName}
                      </p>
                    )}
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
                  disabled={isProcessing || Object.keys(errors).length > 0}
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
                      {selectedSeats.map((seat) => (
                        <div key={seat.seatId} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold">{seat.seatId}</span>
                            <Badge variant="outline">{seat.section}</Badge>
                          </div>
                          <span className="font-semibold">${seat.price.toLocaleString()}</span>
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
