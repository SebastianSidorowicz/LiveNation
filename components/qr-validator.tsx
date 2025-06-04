"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, Volume2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"

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

  const playSuccessSound = async () => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      if (audioContext.state === "suspended") await audioContext.resume()

      const oscillator1 = audioContext.createOscillator()
      const oscillator2 = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator1.connect(gainNode)
      oscillator2.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator1.frequency.setValueAtTime(523, audioContext.currentTime)
      oscillator2.frequency.setValueAtTime(659, audioContext.currentTime)
      oscillator1.frequency.setValueAtTime(659, audioContext.currentTime + 0.15)
      oscillator2.frequency.setValueAtTime(784, audioContext.currentTime + 0.15)

      gainNode.gain.setValueAtTime(0.2, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4)

      oscillator1.start(audioContext.currentTime)
      oscillator2.start(audioContext.currentTime)
      oscillator1.stop(audioContext.currentTime + 0.4)
      oscillator2.stop(audioContext.currentTime + 0.4)
    } catch (error) {
      if (navigator.vibrate) navigator.vibrate([200, 100, 200])
    }
  }

  useEffect(() => {
    const validateTicket = async () => {
      setIsLoading(true)
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000))

        const urlParts = qrData.split("/")
        const dataPart = urlParts[urlParts.length - 1]
        const [orderNumber, seatId, rawCustomerName, raweventName] = dataPart.split("-")

        const parsedData: TicketInfo = {
          orderNumber,
          seatId,
          customerName: decodeURIComponent(rawCustomerName),
          eventName: decodeURIComponent(raweventName).replace(/["}]+$/, ""),
          validationUrl: qrData
        }

        setTicketInfo(parsedData)
        playSuccessSound()
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
    validationUrl: ""
  }

  return (
    <Card className="w-full max-w-md mx-auto border-green-500">
      <CardHeader className="bg-green-50">
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center space-x-2">
            <Check className="w-5 h-5 text-green-600" />
            <span className="text-green-800">Ticket Válido</span>
          </span>
          <Volume2 className="h-5 w-5 text-gray-500" />
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="font-semibold">Estado:</span>
              <Check className="w-5 h-5 text-green-600" />
            </div>
            <Badge variant="success">ACCESO PERMITIDO</Badge>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Orden:</span>
              <span className="font-mono">{info.orderNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Asiento:</span>
              <span className="font-semibold">{info.seatId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Titular:</span>
              <span>{info.customerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Evento:</span>
              <span>{info.eventName}</span>
            </div>
          </div>
          <div className="mt-4 p-3 rounded-lg bg-green-100">
            <p className="text-sm font-semibold text-green-800">🎉 ¡Bienvenido al evento!</p>
            <p className="text-xs text-green-700">Dirígete a tu asiento {info.seatId}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
