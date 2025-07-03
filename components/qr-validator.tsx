"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, Volume2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface QRValidatorProps {
  qrData: string
}

interface TicketInfo {
  orderNumber: string
  seatId: string
  customerName: string
  eventName: string
  validationUrl: string
}

export default function QRValidator({ qrData }: QRValidatorProps) {
  const [ticketInfo, setTicketInfo] = useState<TicketInfo | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const playiPhoneNotificationSound = async () => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      if (audioContext.state === "suspended") await audioContext.resume()

      // Crear el sonido similar al iPhone notification
      const createTone = (frequency: number, startTime: number, duration: number, volume = 0.15) => {
        const oscillator = audioContext.createOscillator()
        const gainNode = audioContext.createGain()

        oscillator.connect(gainNode)
        gainNode.connect(audioContext.destination)

        oscillator.frequency.setValueAtTime(frequency, startTime)
        oscillator.type = "sine"

        // Envelope para suavizar el sonido
        gainNode.gain.setValueAtTime(0, startTime)
        gainNode.gain.linearRampToValueAtTime(volume, startTime + 0.02)
        gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration)

        oscillator.start(startTime)
        oscillator.stop(startTime + duration)

        return { oscillator, gainNode }
      }

      const currentTime = audioContext.currentTime

      // Secuencia de tonos similar al iPhone notification (tri-tone)
      // Primer tono (Do - C5)
      createTone(523.25, currentTime, 0.3, 0.2)

      // Segundo tono (Mi - E5)
      createTone(659.25, currentTime + 0.15, 0.3, 0.18)

      // Tercer tono (Sol - G4) - más grave para el final
      createTone(392.0, currentTime + 0.3, 0.4, 0.15)

      console.log("🔊 Sonido de notificación iPhone reproducido")
    } catch (error) {
      console.error("Error reproduciendo sonido:", error)
      // Fallback: vibración si está disponible
      if (navigator.vibrate) {
        navigator.vibrate([200, 100, 200])
      }
    }
  }

  useEffect(() => {
    const validateTicket = async () => {
      setIsLoading(true)
      try {
        // Simular delay de validación
        await new Promise((resolve) => setTimeout(resolve, 1500))

        const urlParts = qrData.split("/")
        const dataPart = urlParts[urlParts.length - 1]
        const [orderNumber, seatId, rawCustomerName, raweventName] = dataPart.split("-")

        const parsedData: TicketInfo = {
          orderNumber,
          seatId,
          customerName: decodeURIComponent(rawCustomerName),
          eventName: decodeURIComponent(raweventName).replace(/["}]+$/, ""),
          validationUrl: qrData,
        }

        setTicketInfo(parsedData)

        // Reproducir sonido de iPhone notification al cargar la página (validación exitosa)
        setTimeout(() => {
          playiPhoneNotificationSound()
        }, 300) // Pequeño delay para que se vea la UI primero
      } catch (error) {
        console.error("Error al parsear el ticket:", error)
        setTicketInfo(null)
      } finally {
        setIsLoading(false)
      }
    }

    if (qrData) validateTicket()
  }, [qrData])

  if (isLoading) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="flex flex-col items-center justify-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Validando ticket...</p>
          <p className="text-xs text-gray-500 mt-2">Verificando autenticidad...</p>
        </CardContent>
      </Card>
    )
  }

  // Render fallback si ticketInfo es null
  const info = ticketInfo ?? {
    orderNumber: "N/A",
    seatId: "N/A",
    customerName: "Invitado",
    eventName: "Evento no disponible",
    validationUrl: "",
  }

  return (
    <Card className="w-full max-w-md mx-auto border-green-500 animate-in fade-in duration-500">
      <CardHeader className="bg-green-50">
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center space-x-2">
            <Check className="w-6 h-6 text-green-600 animate-in zoom-in duration-300" />
            <span className="text-green-800">Ticket Válido</span>
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={playiPhoneNotificationSound}
            className="h-8 w-8 p-0 hover:bg-green-100"
            title="Reproducir sonido de validación"
          >
            <Volume2 className="h-5 w-5 text-gray-600 hover:text-green-600 transition-colors" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="font-semibold">Estado:</span>
              <Check className="w-5 h-5 text-green-600" />
            </div>
            <Badge className="bg-green-600 hover:bg-green-700">✅ ACCESO PERMITIDO</Badge>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
              <span className="text-gray-600 font-medium">Orden:</span>
              <span className="font-mono text-lg">{info.orderNumber}</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
              <span className="text-gray-600 font-medium">Asiento:</span>
              <span className="font-bold text-lg text-blue-600">{info.seatId}</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
              <span className="text-gray-600 font-medium">Titular:</span>
              <span className="font-semibold">{info.customerName}</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
              <span className="text-gray-600 font-medium">Evento:</span>
              <span className="font-semibold">{info.eventName}</span>
            </div>
          </div>

          <div className="mt-6 p-4 rounded-lg bg-gradient-to-r from-green-100 to-green-50 border border-green-200">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <p className="text-sm font-bold text-green-800">🎉 ¡Validación Exitosa!</p>
            </div>
            <p className="text-xs text-green-700">
              Bienvenido al evento. Dirígete a tu asiento <strong>{info.seatId}</strong>
            </p>
            <p className="text-xs text-green-600 mt-1">
              Presenta este ticket al personal de seguridad si es necesario.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
