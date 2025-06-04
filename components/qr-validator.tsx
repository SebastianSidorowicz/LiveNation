"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, X, Volume2 } from "lucide-react"
import { Badge } from "@/components/ui/badge" // Asegurate de tener esto

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
  const [isValid, setIsValid] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  // Mejorar la función de sonido y añadir más compatibilidad:

  const playSuccessSound = async () => {
    try {
      // Intentar usar Web Audio API primero
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()

      // Asegurar que el contexto esté activo
      if (audioContext.state === "suspended") {
        await audioContext.resume()
      }

      // Crear un sonido de éxito más distintivo
      const oscillator1 = audioContext.createOscillator()
      const oscillator2 = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator1.connect(gainNode)
      oscillator2.connect(gainNode)
      gainNode.connect(audioContext.destination)

      // Sonido de éxito (acorde mayor)
      oscillator1.frequency.setValueAtTime(523, audioContext.currentTime) // C5
      oscillator2.frequency.setValueAtTime(659, audioContext.currentTime) // E5

      oscillator1.frequency.setValueAtTime(659, audioContext.currentTime + 0.15) // E5
      oscillator2.frequency.setValueAtTime(784, audioContext.currentTime + 0.15) // G5

      gainNode.gain.setValueAtTime(0.2, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4)

      oscillator1.start(audioContext.currentTime)
      oscillator2.start(audioContext.currentTime)
      oscillator1.stop(audioContext.currentTime + 0.4)
      oscillator2.stop(audioContext.currentTime + 0.4)

      console.log("🔊 Sonido de éxito reproducido")
    } catch (error) {
      console.error("Error reproduciendo sonido:", error)
      // Fallback: vibración si está disponible
      if (navigator.vibrate) {
        navigator.vibrate([200, 100, 200])
      }
    }
  }

  const playErrorSound = async () => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()

      if (audioContext.state === "suspended") {
        await audioContext.resume()
      }

      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      // Sonido de error más distintivo
      oscillator.frequency.setValueAtTime(300, audioContext.currentTime)
      oscillator.frequency.setValueAtTime(200, audioContext.currentTime + 0.1)
      oscillator.frequency.setValueAtTime(150, audioContext.currentTime + 0.2)

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)

      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.5)

      console.log("🔊 Sonido de error reproducido")
    } catch (error) {
      console.error("Error reproduciendo sonido:", error)
      // Fallback: vibración si está disponible
      if (navigator.vibrate) {
        navigator.vibrate([500, 200, 500, 200, 500])
      }
    }
  }

  useEffect(() => {
    const validateTicket = async () => {
      setIsLoading(true)

      try {
        // Simular delay de validación
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Parsear los datos del QR

        const urlParts = qrData.split("/")
        const dataPart = urlParts[urlParts.length - 1] // lo último en la URL
        const [orderNumber, seatId, rawCustomerName, raweventName] = dataPart.split("-")

        const parsedData: TicketInfo = {
          orderNumber,
          seatId,
          customerName: decodeURIComponent(rawCustomerName),
          eventName: decodeURIComponent(raweventName).replace(/["}]+$/, ""),
          validationUrl: qrData
        }


        // Validar el ticket (simulado)
        const currentDate = new Date()
        const eventName = new Date(parsedData.eventName)

        // Verificar que el ticket sea válido
        const isTicketValid =
          parsedData.orderNumber && parsedData.seatId && parsedData.customerName && eventName >= currentDate // El evento no ha pasado

        setTicketInfo(parsedData)
        setIsValid(isTicketValid)

        // Reproducir sonido según el resultado
        if (isTicketValid) {
          playSuccessSound()
        } else {
          playErrorSound()
        }
      } catch (error) {
        console.error("Error validando ticket:", error)
        setIsValid(false)
        playErrorSound()
      } finally {
        setIsLoading(false)
      }
    }

    if (qrData) {
      validateTicket()
    }
  }, [qrData])

  if (isLoading) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="flex flex-col items-center justify-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Validando ticket...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={`w-full max-w-md mx-auto ${isValid ? "border-green-500" : "border-green-500"}`}>
      <CardHeader className={`${isValid ? "bg-green-50" : "bg-green-50"}`}>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center space-x-2">
              <Check className="w-5 h-5 text-green-600" />
              <span className="text-green-800">
              Ticket Válido
            </span>
          </span>
          <Volume2 className="h-5 w-5 text-gray-500" />
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {ticketInfo && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="font-semibold">Estado:</span>
                <Check className="w-5 h-5 text-green-600" />
              </div>
              <span className="text-green-700 font-semibold">ACCESO PERMITIDO</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Orden:</span>
                <span className="font-mono">{ticketInfo.orderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Asiento:</span>
                <span className="font-semibold">{ticketInfo.seatId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Titular:</span>
                <span>{ticketInfo.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Evento:</span>
                <span>{ticketInfo.eventName}</span>
              </div>
            </div>

            {isValid && (
              <div className="mt-4 p-3 bg-green-100 rounded-lg">
                <p className="text-green-800 text-sm font-semibold">🎉 ¡Bienvenido al evento!</p>
                <p className="text-green-700 text-xs">Dirígete a tu asiento {ticketInfo.seatId}</p>
              </div>
            )}

            {!isValid && (
              <div className="mt-4 p-3 bg-green-100 rounded-lg">
                <p className="text-green-800 text-sm font-semibold">🎉 ¡Bienvenido al evento!</p>
                <p className="text-green-700 text-xs">Dirígete a tu asiento {ticketInfo.seatId}</p>
              </div>
            )}
          </CardContent>
    </Card>
  )
}
